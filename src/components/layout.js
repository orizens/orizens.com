import React from "react"

import { rhythm } from "../utils/typography"
import "../styles/index.sass"
import Navbar from "./navbar"
import Socials from "./socials"

export default function Layout(props) {
  const { location, children, footer } = props
  // const rootPath = `${__PATH_PREFIX__}/`
  // if (location.pathname === rootPath) {
  return (
    <div>
      <header>
        <Navbar path={location.pathname} />
      </header>
      <main
        className="section pt-5 m-auto"
        style={{
          maxWidth: rhythm(30),
        }}
      >
        {children}
      </main>
      {footer && footer}
      <footer className="footer has-text-centered is-flex is-aligned">
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
