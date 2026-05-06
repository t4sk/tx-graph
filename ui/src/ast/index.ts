import { findAll } from "solidity-ast/utils"
import { SourceUnit, ContractDefinition } from "solidity-ast"
import { Contract } from "./types"

function assert(b: boolean, msg: string = "") {
  if (!b) {
    throw new Error(msg)
  }
}

// TODO: fix - render with partial AST info (example Rebase)
// TODO: clean up, replace warnings?
export function parse(
  files: { name: string; path: string; data: { ast: SourceUnit } }[],
): { data: Map<number, Contract> | null; error: any } {
  try {
    // SourceUnit id => SourceUnit node
    const srcMap: Map<number, SourceUnit> = new Map()
    // ContractDefinition id => SourceUnit id
    const idToSourceUnitId: Map<number, number> = new Map()
    const idToName: Map<number, string> = new Map()
    // ContractDefinition id => ContractDefinition
    const idToContractDef: Map<number, ContractDefinition> = new Map()
    // ContractDefinition id => depth
    const idToDepth: Map<number, number> = new Map()

    for (const { path, data } of files) {
      console.log(path)
      if (!data.ast) {
        console.warn(`${path}: AST missing`)
        continue
      }

      // Map SourceUnit id to SourceUnit
      const srcUnits = [...findAll("SourceUnit", data.ast)]
      for (const src of srcUnits) {
        if (srcMap.has(src.id)) {
          console.warn(`${path} overwriting source: id = ${src.id}`)
        }
        srcMap.set(src.id, src)
      }

      // Map id => SourceUnit id
      const importDirectives = [...findAll("ImportDirective", data.ast)]
      for (const importDir of importDirectives) {
        for (const sym of importDir.symbolAliases) {
          const ref = sym.foreign.referencedDeclaration
          if (ref != undefined) {
            // TODO: fix - doesn't work with Script.sol
            /*
            const sourceUnitId = idToSourceUnitId.get(ref)
            if (sourceUnitId != undefined) {
              assert(
                sourceUnitId == importDir.sourceUnit,
                `${path} ref: ${ref} stored source unit: ${sourceUnitId} import source unit: ${importDir.sourceUnit}`,
              )
            }
            idToSourceUnitId.set(ref, importDir.sourceUnit)
            */
            idToName.set(ref, sym.foreign.name)
          }
        }
      }

      // Map id to ContractDefinition and contract depth
      const contractDefs = [...findAll("ContractDefinition", data.ast)]
      for (const con of contractDefs) {
        if (idToContractDef.has(con.id)) {
          console.warn(
            `${path} contract already set - name: ${con.name} id: ${con.id}`,
          )
        }
        idToContractDef.set(con.id, con)
        idToName.set(con.id, con.name)

        const depth = con.linearizedBaseContracts.length - 1
        idToDepth.set(con.id, depth)
      }
    }

    const cons: Map<number, Contract> = new Map()
    for (const [id, con] of idToContractDef) {
      assert(
        con.linearizedBaseContracts[0] == id,
        `invalid linearized base contracts: ${con.linearizedBaseContracts}`,
      )

      const c = {
        id,
        name: con.name,
        // Remove self
        parents: con.linearizedBaseContracts.slice(1),
        vars: new Map(),
        funcs: new Map(),
      }

      cons.set(id, c)

      const vars = findAll("VariableDeclaration", con)
      for (const v of vars) {
        if (v.stateVariable) {
          c.vars.set(v.id, {
            id: v.id,
            name: v.name,
            type: v.typeDescriptions.typeString,
            vis: v.visibility,
            mut: v.mutability,
          })
        }
      }

      const funcs = findAll("FunctionDefinition", con)
      for (const func of funcs) {
        c.funcs.set(func.id, {
          id: func.id,
          kindt: func.kind,
          name: func.name,
          selector: func.functionSelector,
          vis: func.visibility,
          mut: func.stateMutability,
        })
      }
    }

    // Placeholder for contract ids without ContractDefinition
    // but referenced in linearizedBaseContracts
    for (const [, con] of cons) {
      for (const id of con.parents) {
        if (!cons.has(id)) {
          const name = idToName.get(id) || `${id}`
          cons.set(id, {
            id,
            name,
            parents: [],
            vars: new Map(),
            funcs: new Map(),
          })
        }
      }
    }

    return { data: cons, error: null }
  } catch (error) {
    console.error("Parse AST failed:", error)
    return { data: null, error }
  }
}
