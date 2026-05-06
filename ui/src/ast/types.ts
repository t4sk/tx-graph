export type Contract = {
  id: number
  name: string
  // C3 linearized base contracts
  parents: number[]
  // State variables
  vars: Map<number, Var>
  funcs: Map<number, Func>
  // TODO: events?
}

export type Mutability = "mutable" | "immutable" | "constant"
export type StateMutability = "payable" | "pure" | "nonpayable" | "view"
export type Visibility = "external" | "public" | "internal" | "private"
export type FuncKind =
  | "function"
  | "fallback"
  | "receive"
  | "constructor"
  | "freeFunction"

// https://solidity-ast.info/interfaces/VariableDeclaration
export type Var = {
  id: number
  name: string
  type: string
  vis: Visibility
  mut: Mutability
}

// TODO: data to represent how functions, modifiers and state variables are connected
// https://solidity-ast.info/interfaces/FunctionDefinition
export type Func = {
  id: number
  kind: FuncKind
  name: string
  selector?: string
  vis: Visibility
  mut: StateMutability
  // TODO: inputs and outputs
}
