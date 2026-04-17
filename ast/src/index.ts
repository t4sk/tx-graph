import fs from "fs"
import { findAll } from "solidity-ast/utils"
// import { VariableDeclaration } from "solidity-ast"

const { readFile } = fs.promises

// forge build --ast
// npx ts-node src/index.ts
// npx nodemon --watch src --exec ts-node src/index.ts

async function main() {
  const data = JSON.parse(await readFile("./tmp/Counter.json", "utf-8"))

  // @ts-ignore
  //console.log(data.ast)

  const contracts = findAll("ContractDefinition", data.ast)
  // TODO: inheritance

  for (const con of contracts) {
    console.log(con.name)

    // State variables
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

    // Functions
    // TODO: get public state variable getters
    const funcs = findAll("FunctionDefinition", con)
    for (const fn of funcs) {
      console.log(fn.name, fn.visibility, fn.stateMutability)
    }

    // Modifiers
    const mods = findAll("ModifierDefinition", con)
    for (const m of mods) {
      console.log(m.name)
    }

    // Events
    const events = findAll("EventDefinition", con)
    for (const e of events) {
      console.log(e.name)
    }
  }
}

main()
