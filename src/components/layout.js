import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { rhythm } from "../utils/typography"
import "../styles/index.sass"
import Navbar from "./navbar"

export default function Layout(props) {
  const { location, children, footer } = props
  const data = useStaticQuery(graphql`
    query BioLayoutQuery {
      site {
        siteMetadata {
          author
          social {
            twitter
            github
            npm
          }
        }
      }
    }
  `)
  const { social } = data.site.siteMetadata

  // const rootPath = `${__PATH_PREFIX__}/`

  // if (location.pathname === rootPath) {
  return (
    <div>
      <header>
        <Navbar path={location.pathname} />
      </header>
      <main
        className="section space-top-2"
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(30),
        }}
      >
        {children}
      </main>
      {footer && footer}
      <footer className="footer has-text-centered">
        © {new Date().getFullYear()}, Built with
        {` `}
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
        ,
        <a
          href={`https://twitter.com/${social.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="fa fa-twitter is-size-2"></span>
        </a>
        ,
        <a
          href={`https://github.com/${social.github}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="fa fa-github is-size-2"></span>
        </a>
        ,{" "}
        <a
          href={`https://www.npmjs.com/~${social.npm}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          NPM
        </a>
        ,
        <a
          href={`//www.apress.com/us/book/9781484226193`}
          target="_blank"
          rel="noopener noreferrer"
        >
          My Book
        </a>
      </footer>
    </div>
  )
}
