import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class NotFoundPage extends React.Component {
  render() {
    const { data, location } = this.props
    const siteTitle = data.site.siteMetadata.title
    const isWpLink = location.pathname.includes("/wp")
    const suggestedRoute = isWpLink ? location.pathname.replace("/wp", "") : ""
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="404: Not Found" />
        <h1>The Page Not Found</h1>
        {suggestedRoute && (
          <p>
            <Link to={suggestedRoute}>Try This Link</Link>
          </p>
        )}
      </Layout>
    )
  }
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
