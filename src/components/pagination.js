import React from "react"
import { Link } from "gatsby"

export const Pagination = ({ index, first, pageCount, header }) => {
  const hasNextPage = index < pageCount
  const previousIndex = index + 1
  const nextIndex = index - 1 === 1 ? "" : index - 1

  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <Link
        to={`/${nextIndex}`}
        className={`pagination-previous button is-success is-outlined ${
          nextIndex === 0 ? "is-invisible" : ""
        }`}
      >
        <span className="fa fa-angle-left"></span> Next
      </Link>
      {hasNextPage && (
        <Link
          to={`/${previousIndex}`}
          className="pagination-next button is-success is-outlined"
        >
          Previous <span className="fa fa-angle-right"></span>
        </Link>
      )}
      {header && (
        <ul className="pagination-list">
          <li>{header}</li>
        </ul>
      )}
    </nav>
  )
}
