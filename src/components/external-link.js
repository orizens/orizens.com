import React from "react"

export function ExternalLink({ children, href, title = null, className = "" }) {
  return (
    <a
      href={`https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`${className}`}
    >
      {children}
    </a>
  )
}
