import {
  Id,
  Arrow,
  ArrowType,
  Screen,
  Node,
  Layout,
} from "../../graph/lib/types"
import { getMidPoints } from "../../graph/lib/screen"
import { Contract } from "./types"

function arrow(nodes: Map<Id, Node>, i: number, src: Id, dst: Id): Arrow {
  const s = nodes.get(src) as Node
  const e = nodes.get(dst) as Node

  const m0 = getMidPoints(s.rect)
  const m1 = getMidPoints(e.rect)

  const p0 = m0.bottom
  const p1 = m1.top

  let arrowType: ArrowType = "straight"
  if (p0.x != p1.x) {
    arrowType = "bottom-top"
  }

  return {
    i,
    s: s.id,
    e: e.id,
    p0,
    p1,
    // TODO: need to adjust for state vars and funs
    type: arrowType,
  }
}

export function map(contracts: Map<Id, Contract>, screen: Screen): Layout {
  const nodes: Map<Id, Node> = new Map()
  // TODO: Reverse look up
  const rev: Map<Id, Id> = new Map()

  // Initialize nodes
  for (const [id] of contracts) {
    nodes.set(id, {
      id,
      rect: {
        x: 0,
        y: 0,
        width: screen.node.width,
        // TODO: height calculated from funcs + state vars
        height: screen.node.height,
      },
    })
  }

  // Group by depth
  const groupByDepth: Map<number, Set<Id>> = new Map()
  let maxDepth = 0
  for (const [id, con] of contracts) {
    const d = con.parents.length
    if (!groupByDepth.has(d)) {
      groupByDepth.set(d, new Set())
    }
    groupByDepth.get(d)!.add(id)
    maxDepth = Math.max(d, maxDepth)
  }

  // Find width
  let maxNodes = 0
  for (const [, ids] of groupByDepth) {
    maxNodes = Math.max(ids.size, maxNodes)
  }
  const width =
    maxNodes > 0
      ? maxNodes * screen.node.width + (maxNodes - 1) * screen.node.gap.x
      : 0

  // Find max height at each depth
  let height = 0
  const maxHeightAtDepth: Map<number, number> = new Map()
  for (const [d, ids] of groupByDepth) {
    let h = 0
    for (const id of ids) {
      const node = nodes.get(id)!
      h = Math.max(node.rect.height, h)
    }
    maxHeightAtDepth.set(d, h)
    height += h
    if (d < maxDepth) {
      height += screen.node.gap.y
    }
  }

  // Calculates top and left and bounds all nodes
  const left = screen.center.x - (width >> 1)
  const top = screen.center.y - (height >> 1)

  const topAtDepth: Map<number, number> = new Map()
  topAtDepth.set(0, top)
  {
    let t = top
    for (let d = 0; d <= maxDepth; d++) {
      let h = 0
      const v = maxHeightAtDepth.get(d)
      if (v) {
        h = v + screen.node.gap.y
      }

      if (d <= maxDepth) {
        topAtDepth.set(d + 1, t + h)
        t += h
      }
    }
  }

  // Position nodes
  for (let d = 0; d <= maxDepth; d++) {
    const ids = groupByDepth.get(d)
    if (!ids) {
      continue
    }

    const n = ids.size
    const width = n * screen.node.width + (n - 1) * screen.node.gap.x

    let x = screen.center.x - (width >> 1)
    const y = topAtDepth.get(d)!
    for (const id of ids) {
      const node = nodes.get(id)!
      node.rect.x = x
      node.rect.y = y
      x += screen.node.width + screen.node.gap.x
    }
  }

  // TODO: remove, fix arrows
  console.log("CON", contracts)
  console.log("GROUP", groupByDepth)
  console.log("top", topAtDepth)
  console.log("nodes", nodes)

  // TODO: fix
  // Position arrows
  const arrows: Arrow[] = []
  for (const [id, con] of contracts) {
    for (const p of con.parents) {
      const i = arrows.length
      arrows.push(arrow(nodes, i, p, id))
    }
  }

  return {
    rect: {
      x: left,
      y: top,
      width,
      height,
    },
    nodes,
    arrows,
    rev,
  }
}
