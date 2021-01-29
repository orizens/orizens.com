import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"
import navItems from "./navbar-items"
import Theme from "./theme"

export default function Navbar({ path }) {
  const data = useStaticQuery(graphql`
    query LogoQuery {
      logo: file(absolutePath: { regex: "/enso-white.png/" }) {
        childImageSharp {
          fixed(width: 30, height: 30) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  const [navbarOpened, setNavbar] = useState(false)
  const toggleNavbar = () => {
    setNavbar(!navbarOpened)
  }
  const getActiveClassName = (link) => {
    return navItems.every((item) => item.link !== path) &&
      link !== path &&
      link === "/"
      ? "has-background-success"
      : ""
  }

  return (
    <nav
      className="navbar is-dark is-fixed-top is-spaced is-flex"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand flex-1">
        <a className="is-flex is-aligned" href="/">
          <Image fixed={data.logo.childImageSharp.fixed} />
          <span className="is-size-3">rizens</span>
        </a>
      </div>

      <div className={`navbar-menu flex-2 ${navbarOpened ? "is-active" : ""}`}>
        <div className="navbar-start flex-1 is-justify-center">
          {navItems.map((item) => (
            <Link
              key={`navbar-${item.link}`}
              className={`navbar-item space-sides-1 is-rounded-1  ${getActiveClassName(
                item.link
              )}`}
              to={item.link}
              activeClassName="has-background-success"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="navbar-item is-paddingless is-flex is-aligned is-justify-end flex-1">
        <Theme />
      </div>
      <button
        style={{ marginTop: "4px" }}
        className="navbar-burger burger has-text-white-bis"
        aria-label="menu"
        aria-expanded="false"
        onClick={toggleNavbar}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </nav>
  )
}
