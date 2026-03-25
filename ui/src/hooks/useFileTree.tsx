import { useState } from "react"

type File = {
  name: string
  ext: string | null
  data: string | null
}

type State = {
  file: File | null
  open: { [key: string]: boolean }
  // Show file tree
  tree: boolean
}

const STATE: State = {
  file: null,
  open: {},
  tree: true,
}

export default function useFileTree() {
  const [state, setState] = useState<State>(STATE)

  const set = (file: File) => {
    setState({
      ...state,
      file,
    })
  }

  const toggle = (path: string) => {
    if (path == "/") {
      setState({
        ...state,
        tree: !state.tree,
      })
    } else {
      setState({
        ...state,
        open: {
          ...state.open,
          [path]: !state.open[path],
        },
      })
    }
  }

  const reset = () => {
    setState(STATE)
  }

  return {
    state,
    set,
    toggle,
    reset,
  }
}
