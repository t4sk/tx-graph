import { Id, Link, Graph } from "./types"
import { assert } from "./utils"

// Build adjaceny map
export function build(links: Link[]): Graph {
  // dst => sources
  const incoming: Map<Id, Set<Id>> = new Map()
  // src => destinations
  const outgoing: Map<Id, Set<Id>> = new Map()

  for (let i = 0; i < links.length; i++) {
    const l = links[i]

    if (!outgoing.has(l.src)) {
      outgoing.set(l.src, new Set())
    }
    outgoing.get(l.src)?.add(l.dst)

    if (!incoming.has(l.dst)) {
      incoming.set(l.dst, new Set())
    }
    incoming.get(l.dst)?.add(l.src)
  }

  return { incoming, outgoing }
}

// Breadth first search
export function bfs<A>(
  start: A,
  get: (v: A) => A[] | null,
  f?: (i: number, d: number, v: A) => void,
) {
  const q: [number, A][] = [[0, start]]
  const visited: Set<A> = new Set()
  let i = 0
  let k = 0

  while (i < q.length) {
    // Avoid using shift() which is O(N) to get element from the head of q
    const [d, v] = q[i++]

    if (visited.has(v)) {
      continue
    }
    visited.add(v)

    if (f) {
      f(k, d, v)
      k++
    }

    const neighbors = get(v)
    if (neighbors) {
      for (const w of neighbors) {
        if (!visited.has(w)) {
          q.push([d + 1, w])
        }
      }
    }
  }
}

// Depth first search
export function dfs<A>(
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

// Binary search
export function search<A>(
  arr: A[],
  get: (a: A) => number,
  x: number,
): number | null {
  if (arr.length == 0) {
    return null
  }

  if (arr.length == 1) {
    return 0
  }

  let low = 0
  let high = arr.length - 1

  assert(get(arr[low]) < get(arr[high]), "data not sorted")

  // Binary search
  while (low < high) {
    let mid = ((low + high) / 2) >> 0

    if (get(arr[mid]) > x) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  return low
}
