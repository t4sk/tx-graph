import { Point, Rect, Mid } from "./types"

export function isInside(p: Point, rect: Rect): boolean {
  return (
    p.x >= rect.x &&
    p.x <= rect.x + rect.width &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.height
  )
}

export function getMidPoints(rect: Rect): Mid {
  const mw = rect.width >> 1
  const mh = rect.height >> 1

  return {
    top: {
      x: rect.x + mw,
      y: rect.y,
    },
    bottom: {
      x: rect.x + mw,
      y: rect.y + rect.height,
    },
    left: {
      x: rect.x,
      y: rect.y + mh,
    },
    right: {
      x: rect.x + rect.width,
      y: rect.y + mh,
    },
    center: {
      x: rect.x + mw,
      y: rect.y + mh,
    },
  }
}

export function box(points: Point[], xPad: number = 0, yPad: number = 0): Rect {
  let xMin = points[0].x
  let xMax = points[0].x
  let yMin = points[0].y
  let yMax = points[0].y

  for (let i = 1; i < points.length; i++) {
    const p = points[i]
    if (p.x < xMin) {
      xMin = p.x
    }
    if (p.y < yMin) {
      yMin = p.y
    }
    if (p.x > xMax) {
      xMax = p.x
    }
    if (p.y > yMax) {
      yMax = p.y
    }
  }

  return {
    x: xMin - xPad,
    y: yMin - yPad,
    width: xMax - xMin + 2 * xPad,
    height: yMax - yMin + 2 * yPad,
  }
}
