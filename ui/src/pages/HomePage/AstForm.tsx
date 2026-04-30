import { toast } from "react-toastify"
import * as FileTypes from "../../types/file"
import { useFileWatchContext } from "../../contexts/FileWatch"
import Button from "../../components/Button"
import Spinner from "../../components/svg/Spinner"
import Check from "../../components/svg/Check"
import styles from "./AstForm.module.css"

const FILE_SYS_ACCESS = !!(
  // @ts-ignore
  (window?.showDirectoryPicker && window?.showOpenFilePicker)
)

const AstForm: React.FC<{}> = ({}) => {
  const fileWatch = useFileWatchContext()
  const astFiles = fileWatch.get("ast")

  // TODO: no need to use filewatch?
  const selectAstFiles = async () => {
    try {
      // @ts-ignore
      fileWatch.watch("ast", await window.showDirectoryPicker())
    } catch (err) {
      toast.error(`Failed to select AST files: ${err}`)
    }
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (files) {
      const vals: FileTypes.File[] = []
      try {
        for (const file of files) {
          const text = await file.text()
          const json = JSON.parse(text)

          vals.push({
            name: file.name,
            path: file.webkitRelativePath,
            data: json,
            lastModified: file.lastModified,
            size: file.size,
          })
        }
      } catch (err) {
        toast.error(`Failed to parse JSON: ${err}`)
      }

      if (vals.length > 0) {
        fileWatch.set("ast", vals)
      }
    }
  }

  return (
    <div>
      <div className={styles.input}>
        <div className={styles.row}>
          {astFiles.length > 0 ? (
            <Check size={16} className={styles.check} />
          ) : null}
          <div>Upload AST files</div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.shell}>
            <span style={{ color: "orange" }}>forge</span>
            <span style={{ color: "lightblue" }}> build </span>
            {`--ast`}
          </div>
        </div>
        {FILE_SYS_ACCESS ? (
          <div className={styles.watch}>
            <Button onClick={selectAstFiles}>select files</Button>
            <div className={styles.status}>
              {astFiles.length > 0 ? (
                <>
                  <Spinner size={16} className={styles.spinner} />
                  <div>watching {astFiles.length} files</div>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <input
            type="file"
            name="ast"
            // @ts-ignore
            webkitdirectory=""
            multiple
            onChange={onChange}
          />
        )}
      </div>
      <ul className={styles.abiList}>
        {astFiles.map((file, i) => (
          <li key={i}>{file.path}</li>
        ))}
      </ul>
    </div>
  )
}

export default AstForm
