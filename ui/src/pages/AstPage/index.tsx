import { useState } from "react"
import { toast } from "react-toastify"
import { useWindowSizeContext } from "../../contexts/WindowSize"
import { useFileWatchContext } from "../../contexts/FileWatch"
import { AstGraph } from "../../components/ast-graph"
import styles from "./index.module.css"

const STYLES = {
  BG_COLOR: "rgb(17, 17, 17)",
}

function AstPage() {
  const windowSize = useWindowSizeContext()
  const fileWatch = useFileWatchContext()

  if (!windowSize) {
    return <div>loading...</div>
  }

  const contracts = new Map([
    [39894, { id: 39894, name: "Auth", parents: new Set([39897]) }],
    [39897, { id: 39897, name: "Base", parents: new Set([]) }],
    [39972, { id: 39972, name: "Token", parents: new Set([39897]) }],
    [
      40013,
      {
        id: 40013,
        name: "Vault",
        parents: new Set([39894, 39972, 39897]),
      },
    ],
  ])

  return (
    <div className={styles.component}>
      <AstGraph
        disabled={false}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor={STYLES.BG_COLOR}
        getNodeStyle={() => ({ fill: "black", stroke: "white" })}
        getNodeText={(hover, node) => ({
          txt: contracts.get(node.id)?.name || "?",
          top: false,
        })}
        getArrowStyle={() => ({ top: false, style: { stroke: "white" } })}
        calls={[]}
      />
    </div>
  )
}

export default AstPage
