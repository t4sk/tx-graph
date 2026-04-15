import React from "react"
import { RPC_CONFIG } from "../config"
import ArrowTopRightOnSquare from "./svg/ArrowTopRightOnSquare"
import styles from "./Explorer.module.css"

const Explorer: React.FC<{
  chain: string
  addr: string
}> = ({ chain, addr }) => {
  const explorer = (
    RPC_CONFIG[chain as keyof typeof RPC_CONFIG] as {
      explorer?: (addr: string) => string
    }
  )?.explorer

  if (!explorer) {
    return null
  }

  return (
    <a
      className={styles.component}
      href={explorer(addr)}
      target="_blank"
      rel="noreferrer"
    >
      <ArrowTopRightOnSquare size={16} />
    </a>
  )
}

export default Explorer
