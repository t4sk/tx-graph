import React, { useEffect, useState, useRef } from "react"
import { RPC_CONFIG } from "../../../../config"
import * as api from "../../../../api"
import useAsync from "../../../../hooks/useAsync"
import useFileTree from "../../../../hooks/useFileTree"
import CopyText from "../../../CopyText"
import Copy from "../../../svg/Copy"
import Check from "../../../svg/Check"
import Code from "../../../svg/Code"
import FullScreen from "../../../svg/FullScreen"
import FullScreenExit from "../../../svg/FullScreenExit"
import Button from "../../../Button"
import FileTree, { File } from "../../../FileTree"
import CodeViewer from "../../../CodeViewer"
import styles from "./ContractModal.module.css"

// TODO: hightlight current selected file
// TODO: find and open contract

const ContractModal: React.FC<{
  ctx: { name?: string; dst: string }
  chain: string
}> = ({ ctx, chain }) => {
  const getContract = useAsync(api.getContract)
  const [fullScreen, setFullScreen] = useState(false)
  const [copied, setCopied] = useState<boolean>(false)
  const fileTree = useFileTree()
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (ctx.dst && chain && chain != "foundry-test") {
      getContract.exec({ addr: ctx.dst, chain })
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  const copy = (val: string) => {
    navigator.clipboard.writeText(val)

    setCopied(true)
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  const blockscan = (
    RPC_CONFIG[chain as keyof typeof RPC_CONFIG] as { blockscan?: string }
  )?.blockscan

  const files: File[] = Object.entries(getContract.data?.src || {}).map(
    ([k, v]) => {
      const parts = k.split("/")
      const name = parts.slice(-1)?.[0] || ""

      return {
        type: "file",
        path: k,
        // depth of root path = 0
        depth: parts.length,
        name,
        data: v,
      }
    },
  )

  return (
    <div
      className={styles.component}
      style={{
        height: fullScreen ? "90vh" : "300px",
        transition: "height 0.3s ease",
      }}
    >
      <div className={styles.header}>
        {ctx.name ? <div className={styles.headerRow}>{ctx.name}</div> : null}
        <div className={styles.headerRow}>
          <CopyText text={ctx.dst} val={ctx.dst} />
          {blockscan ? (
            <a
              className={styles.blockscan}
              href={`https://vscode.blockscan.com/${blockscan}/${ctx.dst}`}
              target="_blank"
              rel="noreferrer"
            >
              <Code size={16} />
            </a>
          ) : null}
        </div>
      </div>
      {getContract.data ? (
        <div className={styles.main}>
          <div className={styles.tree}>
            {files.length > 0 ? (
              <FileTree
                files={files}
                open={fileTree.state.open}
                toggle={fileTree.toggle}
                onClickFile={fileTree.set}
              />
            ) : null}
          </div>
          {fileTree.state.file ? (
            <div className={styles.code}>
              <div className={styles.tools}>
                <Button
                  className={styles.copyBtn}
                  onClick={() => copy(fileTree.state.file?.data || "")}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
                <Button
                  className={styles.fullScreenBtn}
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  {fullScreen ? (
                    <FullScreenExit size={16} />
                  ) : (
                    <FullScreen size={16} />
                  )}
                </Button>
              </div>
              <div className={styles.codeViewer}>
                <CodeViewer text={fileTree.state.file?.data || ""} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default ContractModal
