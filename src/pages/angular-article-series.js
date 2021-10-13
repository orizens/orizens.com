import React from "react"
// import { graphql, Link, useStaticQuery } from "gatsby"
import { graphql } from "gatsby"
// import Image from "gatsby-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Logger } from "../components/logger"

export default function AngularArticlesSeries({ data, location }) {
  // const data = useStaticQuery(graphql`
  //   query AngularArticlesQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)
  // articles: file(absolutePath: { regex: "/angular-article-series/" }) {
  // allMarkdownRemark(filter: {frontmatter: {id: {eq: 1109}}}) {
  //   nodes {
  //     html
  //   }
  // }
  // }

  return (
    <Layout location={location}>
      <Seo title="Angular Article Series" />
      <Logger content={data} />
      <article className="content angular-article-series">
        <div
          dangerouslySetInnerHTML={{
            __html: data.allMarkdownRemark.nodes[0].html,
          }}
        ></div>
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { frontmatter: { id: { eq: 1109 } } }) {
      nodes {
        html
      }
    }
  }
`
