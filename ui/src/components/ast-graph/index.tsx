import { useMemo } from "react"
import * as GraphTypes from "../graph/lib/types"
import { Graph, Props as GraphProps } from "../graph"
import * as Types from "./lib/types"
import * as screen from "./lib/screen"

// TODO: fix graph type
// @ts-ignore
export type Props<A, F> = Omit<GraphProps<Types.Call<A, F>>, "layout"> & {
  nodeWidth?: number
  nodeHeight?: number
  // groups: GraphTypes.Groups
}

export const AstGraph = <A, F>(props: Props<A, F>) => {
  const {
    width,
    height,
    nodeWidth = 200,
    nodeHeight = 40,
    nodeXGap = 50,
    nodeYGap = 50,
  } = props

  const contracts = new Map([
    [39894, { id: 39894, name: "Auth", parents: [39897] }],
    [39897, { id: 39897, name: "Base", parents: [] }],
    [39972, { id: 39972, name: "Token", parents: [39897] }],
    [
      40013,
      {
        id: 40013,
        name: "Vault",
        parents: [39894, 39972, 39897],
      },
    ],
  ])

  const groupByDepth = {
    "1": [39894, 39972],
    "0": [39897],
    "3": [40013],
  }

  const layout = useMemo(() => {
    // @ts-ignore
    return screen.map(contracts, {
      width,
      height,
      center: {
        x: width >> 1,
        y: height >> 1,
      },
      node: {
        width: nodeWidth,
        height: nodeHeight,
        gap: {
          x: nodeXGap,
          y: nodeYGap,
        },
      },
    })
  }, [width, height])

  console.log("LAYOUTS", layout)

  return <Graph {...props} layout={layout} />
}
