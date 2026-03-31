import React from "react"
import CopyText from "../../../CopyText"
import FnDef from "../../../tracer/FnDef"
import { FnCall } from "../../../tracer/types"
import { CallType } from "../types"
import Gas from "./Gas"
import Op from "./Op"
import styles from "./FnModal.module.css"

const FnModal: React.FC<{
  ctx: {
    type: CallType
    selector?: string
    val?: bigint
    raw?: { input?: string; output?: string }
    gas?: bigint
  }
  fn: FnCall
}> = ({ ctx, fn }) => {
  return (
    <div className={styles.component}>
      <div className={styles.row}>
        <div className={styles.label}>fn: </div>
        <div className={styles.val}>
          <FnDef name={fn.name} inputs={fn.inputs} outputs={fn.outputs} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>type: </div>
        <div className={styles.val}>
          <Op ctx={ctx} />
        </div>
      </div>
      {ctx.gas ? (
        <div className={styles.row}>
          <div className={styles.label}>gas: </div>
          <div className={`${styles.val} ${styles.gas}`}>{ctx.gas}</div>
        </div>
      ) : null}
      {ctx.selector ? (
        <div className={styles.row}>
          <div className={styles.label}>selector: </div>
          <div className={styles.val}>
            <CopyText text={ctx.selector} val={ctx.selector} />
          </div>
        </div>
      ) : null}
      {ctx.val ? (
        <div className={styles.row}>
          <div className={styles.label}>value:</div>
          <div className={styles.val}>
            <CopyText text={ctx.val.toString()} val={ctx.val.toString()} />
          </div>
        </div>
      ) : null}
      {ctx.raw?.input ? (
        <div className={styles.sub}>
          <div className={styles.subHeader}>inputs</div>
          {fn.inputs.map((input, i) => {
            const val = input.val.toString()
            return (
              <div className={styles.row} key={i}>
                <div className={styles.label}>
                  {input.name}{" "}
                  <span className={styles.type}>({input.type})</span>:
                </div>
                <div className={styles.val}>
                  <CopyText text={val} val={val} max={64} />
                </div>
              </div>
            )
          })}
          <div className={styles.row}>
            <div className={styles.label}>raw: </div>
            <div className={styles.val}>
              <CopyText text={ctx.raw.input} val={ctx.raw.input} max={64} />
            </div>
          </div>
        </div>
      ) : null}
      {ctx.raw?.output ? (
        <div className={styles.sub}>
          <div className={styles.subHeader}>outputs</div>
          {fn.outputs.map((output, i) => {
            const val = output.val.toString()
            return (
              <div className={styles.row} key={i}>
                <div className={styles.label}>
                  {output.name}{" "}
                  <span className={styles.type}>({output.type})</span>:
                </div>
                <div className={styles.val}>
                  <CopyText text={val} val={val} max={64} />
                </div>
              </div>
            )
          })}
          <div className={styles.row}>
            <div className={styles.label}>raw: </div>
            <div className={styles.val}>
              <CopyText text={ctx.raw.output} val={ctx.raw.output} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FnModal
