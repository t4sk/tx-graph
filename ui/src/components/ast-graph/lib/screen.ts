import { Id, Groups, Arrow, Screen, Node, Layout } from "../../graph/lib/types"
import { getMidPoints, arrow } from "../../graph/lib/screen"
import { assert } from "../../graph/lib/utils"
import { Contract } from "./types"

export function map<A, F>(
  contracts: Map<number, Contract>,
  screen: Screen,
): Layout {
  const nodes: Map<Id, Node> = new Map()
  // TODO: Reverse look up
  const rev: Map<Id, Id> = new Map()

  // Calculate group width and height
  for (const [id, con] of contracts) {
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

  /*
  group by depth
  find max depth = num iters <- max depth
  find width <- max length of group in depth * node width
  find height = sum max height per depth
  calc center x, y
  position nodes
  draw nodes
  draw arrows
  */

  const arrows: Arrow[] = []
  for (let i = 0; i < calls.length; i++) {
    const c = calls[i]
    arrows.push(arrow(nodes, i, c.src, c.dst))
  }

  return {
    rect: {
      x: x0,
      y: y0,
      width: xMax,
      height: yMax,
    },
    nodes,
    arrows,
    rev,
  }
}
