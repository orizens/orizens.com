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
      <footer className="footer has-text-centered is-flex is-aligned">
        © {new Date().getFullYear()}, Built with
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
        ,
        <Socials />
      </footer>
    </div>
  )
}
