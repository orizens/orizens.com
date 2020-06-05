import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Logger } from "../components/logger"
import { Pagination } from "../components/pagination"
import { PostExcerpt } from "../components/post-excerpt"
import Search from "../components/search"

class BlogIndex extends React.Component {
  render() {
    // models/page-context.ts
    const { data, pageContext } = this.props
    const siteTitle = data.site.siteMetadata.title
    // const posts = data.allMarkdownRemark.edges
    const { group, index, pageCount } = pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <Logger content={{ data, pageContext }} />
        <Search />
        <Pagination
          {...pageContext}
          header={`Blog Page ${index} of ${pageCount}`}
        />
        {group.map(({ node: { excerpt, fields, frontmatter } }) => (
          <PostExcerpt
            {...fields}
            {...frontmatter}
            excerpt={excerpt}
            key={frontmatter.id}
          />
        ))}
        <Pagination {...pageContext} />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            image {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
