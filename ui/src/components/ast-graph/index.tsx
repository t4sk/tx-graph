import { useMemo } from "react"
import { Graph, Props as GraphProps } from "../graph"
import * as Types from "./lib/types"
import * as screen from "./lib/screen"

// TODO: fix graph type
// @ts-ignore
export type Props<A, F> = Omit<GraphProps<Types.Call<A, F>>, "layout"> & {
  contracts: Map<number, Types.Contract>
  nodeWidth?: number
  nodeHeight?: number
}

export const AstGraph = <A, F>(props: Props<A, F>) => {
  const {
    width,
    height,
    nodeWidth = 200,
    nodeHeight = 40,
    nodeXGap = 50,
    nodeYGap = 50,
    contracts,
  } = props

  const layout = useMemo(() => {
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
  }, [contracts, width, height])

  return <Graph {...props} layout={layout} />
}
