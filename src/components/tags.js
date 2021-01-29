import React from "react"
import { Link } from "gatsby"

export function Tags({ tags }) {
  return (
    <div className="tags is-justify-center">
      {tags &&
        tags.map(tag => (
          <Link to={`/tags/${tag}`} key={tag} className="tag is-warning">
            {tag}
          </Link>
        ))}
    </div>
  )
}
