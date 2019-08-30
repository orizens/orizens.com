import React from "react"

export const Logger = ({ content }) => {
  return (
    process.env.NODE_ENV !== `production` && (
      <button onClick={() => console.log(content)}>log</button>
    )
  )
}
