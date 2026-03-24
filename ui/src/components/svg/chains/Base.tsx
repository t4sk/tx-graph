import React from "react"
import baseLogo from "../../../static/chains/base.png"

const Base: React.FC<{
  size: number
  color?: string
  className?: string
  onClick?: (e: React.MouseEvent) => void
}> = ({ size, className = "", onClick }) => {
  return (
    <img
      src={baseLogo}
      width={size}
      height={size}
      className={className}
      onClick={onClick}
      style={{ borderRadius: "50%" }}
      alt="Base"
    />
  )
}

export default Base
