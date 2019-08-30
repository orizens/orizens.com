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

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-picture.jpg/" }) {
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
          social {
            twitter
            github
            npm
            linkedin
          }
        }
      }
    }
  `)

  const { author, social, occupation } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(1),
      }}
    >
      <Image
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
      <p>
        Written by{" "}
        <Link to="/about">
          <strong>{author}</strong>
        </Link>
        , {occupation}
        {` `}
        <a href={`//twitter.com/${social.twitter}`}>
          follow me on <span className="fa fa-twitter is-size-4"></span>
        </a>
        ,{" "}
        <a href={`//github.com/${social.github}`}>
          <span className="fa fa-github is-size-4"></span>
        </a>
        ,{" "}
        <a href={`//linkedin.com/in/${social.linkedin}`}>
          <span className="fa fa-linkedin is-size-4"></span>
        </a>
        , <a href={`//www.npmjs.com/~${social.npm}`}>open source</a>,{" "}
        <a href={`//www.apress.com/us/book/9781484226193`}>author</a>
      </p>
    </div>
  )
}

export default Bio
