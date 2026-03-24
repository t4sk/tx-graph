import React from "react"
import { InputDef, OutputDef } from "./types"
import styles from "./FnDef.module.css"

const FnDef: React.FC<{
  name: string
  inputs: InputDef[]
  outputs: OutputDef[]
}> = ({ name, inputs, outputs }) => {
  return (
    <div className={styles.component}>
      <div>
        <span className={styles.fn}>{name}</span>
        <span>(</span>
        {inputs.map((v, i) => (
          <React.Fragment key={i}>
            {!!v.name ? (
              <>
                <span className={styles.name}>{v.name}</span>
                <span>: </span>
              </>
            ) : null}
            <span className={styles.type}>{v.type}</span>
            {i < inputs.length - 1 ? <span>, </span> : null}
          </React.Fragment>
        ))}
        <span>)</span>
        {outputs.length > 0 ? (
          <>
            <span> {`→`} </span>
            <span>(</span>
            {outputs.map((v, i) => (
              <React.Fragment key={i}>
                {!!v.name ? (
                  <>
                    <span className={styles.name}>{v.name}</span>
                    <span>: </span>
                  </>
                ) : null}
                <span className={styles.type}>{v.type}</span>
                {i < outputs.length - 1 ? <span>, </span> : null}
              </React.Fragment>
            ))}
            <span>)</span>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default FnDef
