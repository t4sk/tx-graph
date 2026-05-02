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
    // ContractDefinition id => ContractDefinition
    const idToContractDef: Map<number, ContractDefinition> = new Map()
    // ContractDefinition id => depth
    const idToDepth: Map<number, number> = new Map()
    // Group by depth (ContractDefinition ids)
    const groupByDepth: Map<number, Set<number>> = new Map()

    for (const { path, data } of files) {
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
            if (idToSourceUnitId.has(ref)) {
              const sourceUnitId = idToSourceUnitId.get(ref)
              assert(
                sourceUnitId == importDir.sourceUnit,
                `${path} ref: ${ref} != source unit: ${sourceUnitId}`,
              )
            }
            idToSourceUnitId.set(ref, importDir.sourceUnit)
          }
        }
      }

      // Map id to ContractDefinition and contract depth
      const contractDefs = [...findAll("ContractDefinition", data.ast)]
      for (const con of contractDefs) {
        if (idToContractDef.has(con.id)) {
          console.warn(
            `${path} contract already set name: ${con.name} id: ${con.id}`,
          )
        }
        idToContractDef.set(con.id, con)

        const depth = con.linearizedBaseContracts.length - 1
        idToDepth.set(con.id, depth)

        if (!groupByDepth.has(depth)) {
          groupByDepth.set(depth, new Set())
        }
        const set = groupByDepth.get(depth)!
        set.add(con.id)
      }
    }

    const cons: Map<number, Contract> = new Map()
    for (const [id, con] of idToContractDef) {
      assert(
        con.linearizedBaseContracts[0] == id,
        `invalid linearized base contracts: ${con.linearizedBaseContracts}`,
      )
      cons.set(id, {
        id,
        name: con.name,
        // Remove self
        parents: con.linearizedBaseContracts.slice(1),
      })
    }

    return { data: cons, error: null }
  } catch (error) {
    console.error("Parse AST failed:", error)
    return { data: null, error }
  }
}
