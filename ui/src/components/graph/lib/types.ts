export type Id = number

export type Link = {
  src: Id
  dst: Id
}

export type Obj<T, V> = {
  id: Id
  type: T
  val: V
}

// Group id => ids
export type Groups = Map<Id, Set<Id>>

export type Graph = {
  // Child => parents
  incoming: Map<Id, Set<Id>>
  // Parent => children
  outgoing: Map<Id, Set<Id>>
}

// SVG
export type Point = {
  x: number
  y: number
}

export type Rect = {
  // left
  x: number
  // top
  y: number
  width: number
  height: number
}

// Mid points
export type Mid = {
  top: Point
  left: Point
  bottom: Point
  right: Point
  center: Point
}

export type Canvas = {
  graph: CanvasRenderingContext2D | null
  ui: CanvasRenderingContext2D | null
}

export type Screen = {
  width: number
  height: number
  center: Point
  node: {
    width: number
    height: number
    // Space between 2 nodes
    gap: { x: number; y: number }
  }
}

export type ArrowType = "straight" | "zig-zag" | "callback" | "top-down"

export type Arrow = {
  // Call index
  i: number
  // Starting node id
  s: Id
  // Ending node id
  e: Id
  p0: Point
  p1: Point
  type: ArrowType
}

export type Node = {
  id: Id
  rect: Rect
}

export type Layout = {
  rect: Rect
  nodes: Map<Id, Node>
  arrows: Arrow[]
  // Reverse look up
  // Id => group id
  rev: Map<Id, Id>
}

// UI
export type Hover = {
  node: Id | null
  // Set of Arrow id
  arrows: Set<Id> | null
}
