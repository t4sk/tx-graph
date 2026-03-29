import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppContext } from "../../contexts/App"
import { useFileWatchContext } from "../../contexts/FileWatch"
import Button from "../../components/Button"
import ChainSelect from "../../components/ChainSelect"
import FoundryForm from "./FoundryForm"
import styles from "./index.module.css"

export function HomePage() {
  const nav = useNavigate()
  const app = useAppContext()
  const fileWatch = useFileWatchContext()
  const [params, setSearchParams] = useSearchParams()
  const [inputs, setInputs] = useState({
    chain: params.get("chain") || "eth-mainnet",
    txHash: params.get("txHash") || "",
    rpc: params.get("rpc") || app.state.rpc,
    etherscan: params.get("etherscan") || app.state.etherscan,
  })

  useEffect(() => {
    fileWatch.reset()
  }, [inputs.chain])

  const setInput = (key: string, val: string) => {
    const newInputs = { ...inputs, [key]: val }
    setInputs(newInputs)

    const params = new URLSearchParams(newInputs as Record<string, string>)
    setSearchParams(params)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (inputs.chain == "foundry-test") {
      const trace = fileWatch.get("trace")?.[0] || null
      if (trace != null) {
        // Need none empty tx hash for /tx to render
        nav(`/tx/0x00?${params.toString()}`)
      }
    } else {
      const txHash = inputs.txHash.trim()
      if (txHash != "") {
        const rpc = inputs.rpc.trim()
        const etherscan = inputs.etherscan.trim()
        if (rpc) {
          app.setRpc(rpc)
        }
        if (etherscan) {
          app.setEtherscan(etherscan)
        }

        nav(`/tx/${txHash}?${params.toString()}`)
      }
    }
  }

  return (
    <div className={styles.component}>
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>network</label>
            <ChainSelect
              value={inputs.chain}
              onChange={(val) => setInput("chain", val)}
            />
          </div>

          {inputs.chain == "foundry-test" ? (
            <div className={styles.foundrySection}>
              <FoundryForm />
              <Button type="submit">explore</Button>
            </div>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>transaction hash</label>
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.input}
                    type="text"
                    value={inputs.txHash}
                    onChange={(e) => setInput("txHash", e.target.value)}
                    placeholder="0x..."
                    autoFocus
                  />
                  <Button type="submit">explore</Button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>rpc url (optional)</label>
                <input
                  className={styles.input}
                  type="text"
                  value={inputs.rpc}
                  onChange={(e) => setInput("rpc", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  etherscan api key (optional)
                </label>
                <input
                  className={styles.input}
                  type="text"
                  value={inputs.etherscan}
                  onChange={(e) => setInput("etherscan", e.target.value)}
                  placeholder="API key"
                />
              </div>
            </>
          )}
        </form>
      </div>
      <a
        className={styles.footer}
        href="https://github.com/t4sk/tx-graph"
        target="_blank"
      >
        GitHub
      </a>
    </div>
  )
}

export default HomePage
