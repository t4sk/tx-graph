export type Id = number

export type Call<C, F> = {
  // Call index
  i: number
  src: Id
  dst: Id
  depth: number
  ctx: C
  fn: F
  ok: boolean
}

export type Tracer = {
  hover: Id | null
  pins: Set<Id>
  folded: Set<Id>
}
