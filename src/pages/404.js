import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const urlCleanups = [
  path => path.replace("/wp", ""),
  path => path.replace("/topics/", "/blog/"),
]
const sanitizePath = path => path.replace("/blog/", "").replace(/-|\//gm, " ")
export default function NotFoundPage({ location, location: { pathname } }) {
  const data = useStaticQuery(graphql`
    query LogoDataQuery {
      site {
        siteMetadata {
          title
        }
      }
      logo: file(absolutePath: { regex: "/enso-white.png/" }) {
        childImageSharp {
          fixed(width: 300, height: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  const siteTitle = data.site.siteMetadata.title
  const suggestedRoute = urlCleanups.reduce((acc, fn) => fn(acc), pathname)
  const hasSuggestedRoute = suggestedRoute !== pathname
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <article className="not-found-page is-flex is-justify-center columns is-aligned">
        <h1 className="push-right" onClick={() => console.log(data)}>
          Nothing Is Here
        </h1>
        <Image
          fixed={data.logo.childImageSharp.fixed}
          className="transition-floating space-vertical"
        />
        {hasSuggestedRoute && (
          <p>
            <Link to={suggestedRoute}>But Try This Link</Link>
          </p>
        )}
      </article>
      {hasSuggestedRoute && (
        <p className="section">
          You probablt tried to read about: {sanitizePath(suggestedRoute)}
        </p>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
