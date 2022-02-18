import React from "react"
import PropTypes from "prop-types"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { Logger } from "../components/logger"
// import { Pagination } from "../components/pagination"
import { PostExcerpt } from "../components/post-excerpt"

// Components
import { Link, graphql } from "gatsby"
import { Icon } from "../components/icon"
const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  // const tagHeader = `${totalCount} post${
  //   totalCount === 1 ? "" : "s"
  // } tagged with "${tag}"`
  return (
    <Layout location={location} title={`Articles tagged with: ${tag}`}>
      <Seo title="All posts" />
      <Logger content={edges} />
      <Logger content={totalCount} />
      {/* <Pagination
        {...pageContext}
        header={`Blog Page ${index} of ${pageCount}`}
      /> */}
      <h1 className="is-size-2 space-bottom-3 has-text-weight-medium">
        <Link
          to="/tags"
          title="Back To All Tags Page"
          className="link-hover-no-line"
        >
          <Icon name="chevron-circle-left" />
        </Link>
        Articles tagged with: <span className="has-text-warning">{tag}</span>
      </h1>
      {edges.map(({ node: { excerpt, fields, frontmatter } }) => (
        <PostExcerpt
          {...fields}
          {...frontmatter}
          excerpt={excerpt}
          key={fields.slug}
        />
      ))}
      {/* <Pagination {...pageContext} /> */}
      <div>
        {/*
                  This links to a page that does not yet exist.
                  We'll come back to it!
                */}
        <Link to="/tags">All tags</Link>
      </div>
    </Layout>
  )
}
Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}
export default Tags
export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            permalink
            tags
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
