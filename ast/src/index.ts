import fs from "fs"
import { findAll } from "solidity-ast/utils"
// import { VariableDeclaration } from "solidity-ast"

const { readFile, readdir } = fs.promises

/*
forge build --ast
npx ts-node src/index.ts
npx nodemon --watch src --exec ts-node src/index.ts
*/

function dfs<A>(
  start: A,
  get: (a: A) => A[],
  f: (i: number, d: number, a: A) => void,
) {
  const q: [number, A][] = [[0, start]]

  let i = 0
  while (q.length > 0) {
    const [d, a] = q.pop() as [number, A]

    f(i, d, a)
    i++

    const next = get(a)
    // Reverse
    for (let j = next.length - 1; j >= 0; j--) {
      q.push([d + 1, next[j]])
    }
  }
}

async function main() {
  // const files = await readdir("./tmp/Ast.sol")
  // console.log(files)

  const data = JSON.parse(await readFile("./tmp/Ast.sol/Vault.json", "utf-8"))

  // @ts-ignore
  //console.log(data.ast)

  const contracts = findAll("ContractDefinition", data.ast)

  // TODO: inheritance

  const map: Map<number, { id: number; name: string; c3: number[] }> = new Map()
  for (const con of contracts) {
    if (!map.has(con.id)) {
      map.set(con.id, {
        id: con.id,
        name: con.name,
        // C3 linearized base contracts
        c3: [...con.linearizedBaseContracts],
      })
    }
    console.log(con.name, con.id, con.linearizedBaseContracts)
  }

  console.log("map", map)

  const depths: Map<number, number> = new Map()
  for (const [k, v] of map) {
    depths.set(k, v.c3.length - 1)
  }

  console.log("depths", depths)

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
