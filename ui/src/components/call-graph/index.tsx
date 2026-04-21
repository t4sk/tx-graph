import { useMemo } from "react"
import * as GraphTypes from "../graph/lib/types"
import { Graph, Props as GraphProps } from "../graph"
import * as Types from "./lib/types"
import * as screen from "./lib/screen"

export type Props<A, F> = Omit<GraphProps<Types.Call<A, F>>, "layout"> & {
  nodeWidth?: number
  nodeHeight?: number
  groups: GraphTypes.Groups
  calls: Types.Call<A, F>[]
  tracer: Types.Tracer
}

export const CallGraph = <A, F>(props: Props<A, F>) => {
  const {
    width,
    height,
    groups,
    calls,
    tracer,
    nodeWidth = 200,
    nodeHeight = 40,
    nodeXGap = 50,
    nodeYGap = 50,
  } = props
  const layout = useMemo(() => {
    return screen.map(groups, calls, {
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
  }, [tracer, calls, width, height])

  return <Graph {...props} layout={layout} />
}
