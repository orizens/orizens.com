import React from "react"

export function Icon({ name, prefix = "las", className }) {
  return <i className={`${prefix} la-${name} mr-1 ${className}`} />
}
