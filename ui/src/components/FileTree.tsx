import React, { useMemo } from "react"
import { assert } from "../utils"
import Folder from "./svg/Folder"
import FolderOpen from "./svg/FolderOpen"
import styles from "./FileTree.module.css"

export type FileType = "folder" | "file"

export type File = {
  type: FileType
  path: string
  depth: number
  name: string
  data: string | null
}

export type Tree = {
  type: FileType
  depth: number
  name: string
  path: string
  data: string | null
  children: Map<string, Tree> | null
}

function build(files: File[]): Tree | null {
  try {
    const q = [...files]

    if (q.filter((f) => f.depth == 0).length == 0) {
      q.push({
        type: "folder",
        path: "/",
        depth: 0,
        name: "",
        data: null,
      })
    } else {
      assert(q.filter((f) => f.depth == 0).length == 1, "invalid file root")
    }

    // Sort lowest to highest
    // Sort by depth, folder, file and then name
    q.sort((a, b) => {
      if (a.depth != b.depth) {
        return a.depth - b.depth
      }
      if (a.type == b.type) {
        return a.name < b.name ? -1 : 1
      }
      return a.type == "folder" ? -1 : 1
    })

    const root: Tree = {
      type: q[0].type,
      depth: 0,
      name: q[0].name,
      path: q[0].path,
      data: q[0].data,
      children: q[0].type == "folder" ? new Map() : null,
    }
    const map: Map<string, Tree> = new Map()
    map.set(root.path, root)

    let i = 1
    while (i < q.length) {
      const f = q[i]
      const t: Tree = {
        type: f.type,
        depth: f.depth,
        name: f.name,
        path: f.path,
        data: f.data,
        children: f.type == "folder" ? new Map() : null,
      }

      let parent = t.path.split("/").slice(0, -1).join("/")
      if (parent == "") {
        parent = "/"
      }

      // Create missing parents
      if (!map.has(parent)) {
        const parts = parent.split("/")
        let curr = ""
        let top: Tree = root
        for (const p of parts) {
          curr = curr ? `${curr}/${p}` : p
          if (!map.has(curr)) {
            const folder: Tree = {
              type: "folder",
              depth: top.depth + 1,
              name: p,
              path: curr,
              data: null,
              children: new Map(),
            }
            // @ts-ignore
            top.children.set(folder.name, folder)
            map.set(curr, folder)
          }
          top = map.get(curr)!
        }
      }

      // @ts-ignore
      map.get(parent).children.set(t.name, t)
      if (t.type == "folder") {
        map.set(f.path, t)
      }
      i++
    }

    return root
  } catch (e) {
    console.log("build tree error:", e)
  }
  return null
}

const Entry: React.FC<{
  curr: {
    path: string
    name: string
    data: string | null
  } | null
  tree: Tree
  open: boolean
  skip: boolean
  state: { [key: string]: boolean }
  toggle: (tree: Tree) => void
}> = ({ curr, tree, open, skip, state, toggle }) => {
  return (
    <div
      className={`${styles.entry} ${tree.path == curr?.path ? styles.curr : ""}`}
    >
      {!skip ? (
        <div className={styles.entryRow} onClick={() => toggle(tree)}>
          {tree.type == "folder" ? (
            open ? (
              <FolderOpen size={16} className={styles.icon} />
            ) : (
              <Folder size={16} className={styles.icon} />
            )
          ) : null}
          <span className={styles.name}>{tree.name}</span>
        </div>
      ) : null}
      <div className={styles.entry} style={{ paddingLeft: skip ? 0 : 12 }}>
        {open && tree.children
          ? Array.from(tree.children).map(([k, c]) => (
              <Entry
                key={k}
                curr={curr}
                tree={c}
                open={!!state[c.path]}
                skip={false}
                state={state}
                toggle={toggle}
              />
            ))
          : null}
      </div>
    </div>
  )
}

const FileTree: React.FC<{
  curr: {
    path: string
    name: string
    data: string | null
  } | null
  files: File[]
  open: { [key: string]: boolean }
  toggle: (path: string) => void
  onClickFile?: (file: {
    path: string
    name: string
    data: string | null
  }) => void
}> = ({ curr, files, open, toggle, onClickFile }) => {
  const root = useMemo(() => build(files), [files.length])

  if (!root || !root.children) {
    return null
  }

  const _toggle = (tree: Tree) => {
    if (tree.type == "folder") {
      toggle(tree.path == root.path ? "/" : tree.path)
    } else {
      if (onClickFile) {
        onClickFile({
          path: tree.path,
          name: tree.name,
          data: tree.data,
        })
      }
    }
  }

  return (
    <div className={styles.component}>
      <Entry
        curr={curr}
        tree={root}
        open={true}
        skip={true}
        state={open}
        toggle={_toggle}
      />
    </div>
  )
}

export default FileTree
