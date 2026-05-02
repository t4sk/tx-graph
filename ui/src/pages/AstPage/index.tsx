import { useMemo } from "react"
import { toast } from "react-toastify"
import { useWindowSizeContext } from "../../contexts/WindowSize"
import { useFileWatchContext } from "../../contexts/FileWatch"
import * as GraphTypes from "../../components/graph/lib/types"
import { AstGraph } from "../../components/ast-graph"
import * as Ast from "../../ast"
import styles from "./index.module.css"

// Canvas doesn't recognize css var colors
// Don't use opaque colors (rgba) for overlapping objects (it intensifies the colors)
const STYLES = {
  BG_COLOR: "rgb(17, 17, 17)",
  NODE_BORDER_COLOR: "rgb(70, 75, 155)",
  // NODE_COLOR: "rgba(12, 62, 92, 0.55)",
  NODE_COLOR: "rgb(20, 20, 32)",
  NODE_TEXT_COLOR: "rgb(255, 255, 255)",
  NODE_HOVER_COLOR: "rgb(40, 45, 100)",
  NODE_HOVER_TEXT_COLOR: "rgb(210, 215, 255)",
  NODE_HOVER_BORDER_COLOR: "rgb(129, 140, 248)",
  NODE_DIM_COLOR: "rgba(20, 20, 32, 0.5)",
  ARROW_COLOR: "rgb(250, 160, 100)",
  ARROW_DIM_COLOR: "rgb(80, 85, 95)",
  // ARROW_IN_COLOR: "rgb(255, 99, 99)",
  ARROW_IN_COLOR: "rgb(64, 196, 255)",
  ARROW_OUT_COLOR: "rgb(64, 196, 255)",
  ARROW_HOVER_COLOR: "rgb(64, 196, 255)",
  ARROW_PIN_COLOR: "rgb(255, 215, 0)",
  ARROW_TRACER_COLOR: "rgb(0, 255, 136)",
  ARROW_TRACER_ETH_COLOR: "#FF4DB8",
  ARROW_ETH_COLOR: "#8B2D52",
}

function getNodeFillColor(
  hover: GraphTypes.Hover | null,
  node: GraphTypes.Node,
): string {
  if (hover?.node == node.id) {
    return STYLES.NODE_HOVER_COLOR
  }
  return STYLES.NODE_COLOR
}

type ArrowType = "in" | "out" | "hover" | "dim" | ""

function getArrowType(
  hover: GraphTypes.Hover | null,
  arrow: GraphTypes.Arrow,
): ArrowType {
  if (hover?.node != null) {
    if (hover.node == arrow.s) {
      return "out"
    }
    if (hover.node == arrow.e) {
      return "in"
    }
    return "dim"
  }
  if (hover?.arrows != null && hover?.arrows.size > 0) {
    if (hover.arrows.has(arrow.i)) {
      return "hover"
    }
    return "dim"
  }
  return "dim"
}

function getArrowColor(t: ArrowType): string {
  switch (t) {
    case "in":
      return STYLES.ARROW_IN_COLOR
    case "out":
      return STYLES.ARROW_OUT_COLOR
    case "hover":
      return STYLES.ARROW_HOVER_COLOR
    case "dim":
      return STYLES.ARROW_DIM_COLOR
    default:
      return STYLES.ARROW_COLOR
  }
}

function AstPage() {
  const windowSize = useWindowSizeContext()
  const fileWatch = useFileWatchContext()

  if (!windowSize) {
    return <div>loading...</div>
  }

  /*
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
  */
  const files = fileWatch.get("ast")
  const res = useMemo(
    () =>
      Ast.parse(
        // @ts-ignore
        files.map((f) => {
          return {
            name: f.name,
            path: f.path,
            data: f.data,
          }
        }),
      ),
    [files],
  )

  if (res?.error) {
    return <div>error parsing AST :(</div>
  }

  return (
    <div className={styles.component}>
      {res.data ? (
        <AstGraph
          contracts={res.data}
          disabled={false}
          width={windowSize.width}
          height={windowSize.height}
          backgroundColor={STYLES.BG_COLOR}
          getNodeStyle={(hover, node) => ({
            fill: getNodeFillColor(hover, node),
            stroke: STYLES.NODE_BORDER_COLOR,
          })}
          getNodeText={(hover, node) => ({
            txt: res.data!.get(node.id)?.name || "?",
            top: true,
            textAlign: "center",
          })}
          getArrowStyle={(hover, arrow) => {
            const top =
              hover?.node == arrow.i ||
              hover?.node == arrow.s ||
              hover?.node == arrow.e ||
              hover?.arrows?.has(arrow.i)
            const t = getArrowType(hover, arrow)
            return {
              top: !!top,
              style: { stroke: getArrowColor(t) },
            }
          }}
          calls={
            [
              /* TODO: remove */
            ]
          }
        />
      ) : null}
    </div>
  )
}

export default AstPage
