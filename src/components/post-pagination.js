import React from "react"
import { Link } from "gatsby"

export const PostPagination = ({ previous, next }) => (
  <nav
    className="pagination is-centered space-vertical"
    role="navigation"
    aria-label="pagination"
  >
    {next && (
      <Link
        to={next.frontmatter.permalink}
        rel="next"
        className="pagination-previous button is-success is-outlined"
      >
        <span className="fa fa-angle-left"></span> Next
      </Link>
    )}
    {previous && (
      <Link
        to={previous.frontmatter.permalink}
        rel="prev"
        className="pagination-next button is-success is-outlined"
      >
        Previous <span className="fa fa-angle-right"></span>
      </Link>
    )}
  </nav>
)
