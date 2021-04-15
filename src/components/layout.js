import React from "react"

import { rhythm } from "../utils/typography"
import "../styles/index.sass"
import Navbar from "./navbar"
import Socials from "./socials"
import Bio from "./bio"

export default function Layout(props) {
  const { location, children, footer } = props
  // const rootPath = `${__PATH_PREFIX__}/`
  // if (location.pathname === rootPath) {
  const isInValidToShow = ["/about", "/contact"].some(
    route => route === location.pathname
  )

  return (
    <div>
      <header>
        <Navbar path={location.pathname} />
        {!isInValidToShow && <Bio />}
      </header>
      <main
        className="section m-auto mih-80"
        style={{
          maxWidth: rhythm(35),
        }}
      >
        {children}
      </main>
      {footer && footer}
      <footer className="content footer has-text-centered is-flex is-aligned mb-0">
        <span className="mr-1"> © {new Date().getFullYear()}, Built with </span>
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
        , follow me at: <Socials />
      </footer>
    </div>
  )
}
