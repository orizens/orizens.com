import React from "react"
import PropTypes from "prop-types"
// Components
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { Logger } from "../components/logger"
import Search from "../components/search"

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
    <Seo title="All posts" />
    <Logger content={group} />
    <Search section="tags" />
    <section className="content is-medium is-rounded-1">
      {group.map(({ fieldValue, totalCount }) => (
        <Link
          to={`/tags/${fieldValue.toLowerCase()}/`}
          key={fieldValue}
          className="link-hover-no-line"
        >
          <span
            className={`tag button is-outlined is-success is-size-6 tag-${fieldValue}`}
          >
            {fieldValue} ({totalCount})
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
