/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"
import Socials from "./socials"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-2021.jpg/" }) {
        childImageSharp {
          fixed(width: 75, height: 75) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          occupation
        }
      }
    }
  `)

  const { author, occupation } = data.site.siteMetadata
  return (
    <div
      style={{
        marginBottom: rhythm(1),
      }}
      className="is-flex is-dark is-justify-center navbar px-2 pb-1 pt-5 is-navbar-bg zindex-1"
    >
      <Link
        to="/about"
        title="Read More About Me..."
        className="link-hover-no-line"
      >
        <Image
          className="profile profile-small"
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            minWidth: 75,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      </Link>
      <p className="is-aligned">
        Written by{" "}
        <Link to="/about" className="link-hover-no-line">
          {author}
        </Link>
        , {occupation}, follow me on <Socials size="4" />
      </p>
    </div>
  )
}

export default Bio
