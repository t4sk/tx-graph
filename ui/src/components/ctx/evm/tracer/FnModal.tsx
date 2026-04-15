import React from "react"
import CopyText from "../../../CopyText"
import Explorer from "../../../Explorer"
import FnDef from "../../../tracer/FnDef"
import { FnCall } from "../../../tracer/types"
import { CallType } from "../types"
import Gas from "./Gas"
import Op from "./Op"
import styles from "./FnModal.module.css"

const FnModal: React.FC<{
  ctx: {
    type: CallType
    src: string
    dst: string
    selector?: string
    val?: bigint
    raw?: { input?: string; output?: string }
    gas?: bigint
  }
  fn: FnCall
  chain: string
}> = ({ ctx, fn, chain }) => {
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
      <div className={styles.row}>
        <div className={styles.label}>src: </div>
        <div className={styles.val}>
          <CopyText text={ctx.src} val={ctx.src} />
        </div>
        <Explorer chain={chain} addr={ctx.src} />
      </div>
      <div className={styles.row}>
        <div className={styles.label}>dst: </div>
        <div className={styles.val}>
          <CopyText text={ctx.dst} val={ctx.dst} />
        </div>
        <Explorer chain={chain} addr={ctx.dst} />
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
            <CopyText
              text={ctx.val.toString()}
              val={ctx.val.toString()}
              textClassName={styles.eth}
            />
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
