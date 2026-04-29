import fs from "fs"
import path from "path"
import assert from "assert"
import { findAll } from "solidity-ast/utils"
import { SourceUnit, ContractDefinition } from "solidity-ast"

const { readFile, readdir } = fs.promises

/*
forge build --ast
npx ts-node src/index.ts
npx nodemon --watch src --exec ts-node src/index.ts
*/

async function main() {
  const root = "./tmp/dev"
  const filePaths = [
    `${root}/Auth.sol/Auth.json`,
    `${root}/Base.sol/Base.json`,
    `${root}/Token.sol/Token.json`,
    `${root}/Vault.sol/Vault.json`,
  ]

  const json = []
  for (const filePath of filePaths) {
    const data = JSON.parse(await readFile(filePath, "utf-8"))
    json.push({ filePath, data })
  }

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

  for (const { data } of json) {
    // Map SourceUnit id to SourceUnit
    const srcUnits = [...findAll("SourceUnit", data.ast)]
    for (const src of srcUnits) {
      assert(!srcMap.has(src.id))
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
              `ref: ${ref} != source unit: ${sourceUnitId}`,
            )
          }
          idToSourceUnitId.set(ref, importDir.sourceUnit)
        }
      }
    }

    // Map id to ContractDefinition and contract depth
    const contractDefs = [...findAll("ContractDefinition", data.ast)]
    for (const con of contractDefs) {
      assert(
        !idToContractDef.has(con.id),
        `contract already set name: ${con.name} id: ${con.id}`,
      )
      idToContractDef.set(con.id, con)

      const depth = con.linearizedBaseContracts.length - 1
      idToDepth.set(con.id, depth)

      if (!groupByDepth.has(depth)) {
        groupByDepth.set(depth, new Set())
      }
      const set = groupByDepth.get(depth)
      assert(set != undefined, `set at depth: ${depth} is undefined`)
      assert(!set.has(con.id), `already in set id: ${con.id}`)
      set.add(con.id)
    }
  }

  console.log(groupByDepth)

  return

  // TODO: link imports
  const data = JSON.parse(await readFile("./tmp/dev/Vault.json", "utf-8"))

  // @ts-ignore
  //console.log(data.ast)

  const contracts = [...findAll("ContractDefinition", data.ast)]

  // TODO: inheritance
  // ImportDirective, sourceUnit -> ast.id (check nodeType = "SourceUnit")
  const map: Map<
    number,
    { id: number; name: string; c3: number[]; depth: number }
  > = new Map()
  for (const con of contracts) {
    if (!map.has(con.id)) {
      map.set(con.id, {
        id: con.id,
        name: con.name,
        // C3 linearized base contracts
        c3: [...con.linearizedBaseContracts],
        depth: con.linearizedBaseContracts.length - 1,
      })
    }
    console.log(con.name, con.id, con.linearizedBaseContracts)
  }

  console.log("map", map)

  // id => depth
  const depths: Map<number, number> = new Map()
  for (const [k, v] of map) {
    depths.set(k, v.depth)
  }

  console.log("depths", depths)

  // depth => [id]
  const groups: Map<number, number[]> = new Map()
  for (const [k, v] of map) {
    const d = v.c3.length - 1
    if (!groups.has(d)) {
      groups.set(d, [])
    }
    groups.get(d)?.push(k)
  }

  console.log("groups", groups)

  for (const [k, v] of map) {
    //
  }
  return

  // TODO: inheritance layout

  for (const con of contracts) {
    console.log(con.name)

    console.log("--- state variables ---")
    const vars = findAll("VariableDeclaration", con)
    for (const v of vars) {
      if (v.stateVariable) {
        console.log(
          v.name,
          // v?.typeName?.nodeType,
          v.visibility,
        )
      }
    }

    console.log("--- functions ---")
    // TODO: get public state variable getters
    const funcs = findAll("FunctionDefinition", con)
    for (const fn of funcs) {
      console.log(fn.kind, fn.name, fn.visibility, fn.stateMutability)
    }

    console.log("--- modifiers ---")
    const mods = findAll("ModifierDefinition", con)
    for (const m of mods) {
      console.log(m.name)
    }

    console.log("--- events ---")
    const events = findAll("EventDefinition", con)
    for (const e of events) {
      console.log(e.name)
    }
  }
}

main()
