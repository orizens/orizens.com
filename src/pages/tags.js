import React from "react"
import PropTypes from "prop-types"
// Components
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Logger } from "../components/logger"

const TagsPage = ({
  location,
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <Layout location={location} title="All Orizens Article Tags">
    <SEO title="All posts" />
    <Bio />
    <Logger content={group} />
    <section>
      {group.map(tag => (
        <Link
          to={`/tags/${tag.fieldValue.toLowerCase()}/`}
          key={tag.fieldValue}
        >
          <span
            className="tag is-success is-size-6"
            style={{ marginRight: ".5rem", marginTop: ".5rem" }}
          >
            {tag.fieldValue} ({tag.totalCount})
          </span>
        </Link>
      ))}
    </section>
  </Layout>
)
TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}
export default TagsPage
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
