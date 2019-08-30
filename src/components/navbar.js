import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"
import navItems from "./navbar-items"

export default function Navbar({ path }) {
  const data = useStaticQuery(graphql`
    query LogoQuery {
      logo: file(absolutePath: { regex: "/enso-white.png/" }) {
        childImageSharp {
          fixed(width: 60, height: 60) {
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
  const getActiveClassName = link => {
    return navItems.every(item => item.link !== path) &&
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
      <div className="navbar-brand" style={{ flex: 1 }}>
        <a className="is-flex" href="/" style={{ alignItems: "center" }}>
          <Image fixed={data.logo.childImageSharp.fixed} />
          <span className="is-size-3 has-text-white">rizens</span>
        </a>
      </div>

      <div
        id="navbarBasic"
        className={`navbar-menu ${navbarOpened ? "is-active" : ""}`}
      >
        <div className="navbar-start">
          {navItems.map(item => (
            <Link
              key={`navbar-${item.link}`}
              className={`navbar-item space-sides-1 ${getActiveClassName(
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
      <button
        style={{ marginTop: "4px" }}
        className="navbar-burger burger has-text-white-bis"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasic"
        onClick={() => toggleNavbar()}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </nav>
  )
}
