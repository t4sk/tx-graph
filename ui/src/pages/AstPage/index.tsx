import { useState } from "react"
import { toast } from "react-toastify"
import { useWindowSizeContext } from "../../contexts/WindowSize"
import { useFileWatchContext } from "../../contexts/FileWatch"
import { AstGraph } from "../../components/ast-graph"
import styles from "./index.module.css"

function AstPage() {
  const windowSize = useWindowSizeContext()
  const fileWatch = useFileWatchContext()

  if (!windowSize) {
    return <div>loading...</div>
  }

  return (
    <div className={styles.component}>
      <AstGraph
        disabled={false}
        width={windowSize.width}
        height={windowSize.height}
        backgroundColor="white"
        getNodeStyle={() => ({ fill: "", stroke: "" })}
        getNodeText={() => ({ txt: "", top: false })}
        getArrowStyle={() => ({ top: false, style: { stroke: "" } })}
        calls={[]}
      />
    </div>
  )
}

export default AstPage
