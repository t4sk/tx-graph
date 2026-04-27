import fs from "fs"
import path from "path"
import assert from "assert"
import { findAll } from "solidity-ast/utils"
import { SourceUnit } from "solidity-ast"

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
  for (const { data } of json) {
    const srcUnits = [...findAll("SourceUnit", data.ast)]
    for (const src of srcUnits) {
      assert(!srcMap.has(src.id))
      srcMap.set(src.id, src)
    }
  }

  console.log(srcMap)

  for (const { data } of json) {
    // referenced declaration => source unit
    const importMap: Map<number, number> = new Map()
    // https://solidity-ast.info/interfaces/ImportDirective
    const importDirectives = [...findAll("ImportDirective", data.ast)]
    // TODO: handle import all without aliase
    for (const importDir of importDirectives) {
      for (const sym of importDir.symbolAliases) {
        const ref = sym.foreign.referencedDeclaration
        if (ref != undefined) {
          importMap.set(ref, importDir.sourceUnit)
        }
      }
    }
    console.log(importMap)

    const contractDefs = [...findAll("ContractDefinition", data.ast)]
    for (const con of contractDefs) {
      // https://solidity-ast.info/interfaces/InheritanceSpecifier
      for (const base of con.baseContracts) {
        // TODO: if nodeType = "UserDefinedTypeName"
        if (base.baseName.nodeType == "IdentifierPath") {
          const ref = base.baseName.referencedDeclaration
          const srcId = importMap.get(ref)
          assert(srcId != undefined)
          const src = srcMap.get(srcId)
          console.log(srcId, src)
          //
        }
      }
      for (const id of con.linearizedBaseContracts) {
        //
      }
    }
  }

  // contract def -> linearizedBaseContracts -> baseContracts referencedDeclaration
  // TODO: if import all exports?
  // -> import directive symbolAlias -> referencedDeclaration
  // or
  // -> contract definition in the same file?
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
