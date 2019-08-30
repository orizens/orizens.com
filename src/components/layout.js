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
      <footer className="footer has-text-centered is-flex">
        © {new Date().getFullYear()}, Built with
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
        ,
        {[
          { icon: "twitter", href: `//twitter.com/${social.twitter}` },
          { icon: "github", href: `//github.com/${social.github}` },
          { icon: "linkedin", href: `//linkedin.com/in/${social.linkedin}` },
          {
            icon: "code-fork",
            href: `//www.npmjs.com/~${social.npm}`,
            tooltip: "npm pacakges",
          },
          {
            icon: "book",
            href: `//www.apress.com/us/book/9781484226193`,
            tooltip: "My Angular & NgRx Reactive Programming Book",
          },
        ].map(({ icon, href, text, tooltip }) => (
          <a
            key={`footer-link-${href}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={tooltip || icon}
          >
            {icon && <span className={`fa fa-${icon} is-size-2`}></span>}
            {text && text}
          </a>
        ))}
      </footer>
    </div>
  )
}
