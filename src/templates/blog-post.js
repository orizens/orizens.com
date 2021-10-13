import React from "react"
import { graphql } from "gatsby"
import Image from "gatsby-image"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { Disqus } from "gatsby-plugin-disqus"
import Packages from "../components/packages"
import { Logger } from "../components/logger"
import { Tags } from "../components/tags"
import { PostPagination } from "../components/post-pagination"
import Search from "../components/search"

class BlogPostTemplate extends React.Component {
  render() {
    const { frontmatter, html, excerpt } = this.props.data.markdownRemark
    const {
      title: siteTitle,
      disqus,
      siteUrl,
    } = this.props.data.site.siteMetadata
    const { location, pageContext } = this.props
    const { next, previous } = pageContext
    const {
      title,
      description,
      date,
      image,
      dsq_thread_id,
      id,
      permalink,
      tags,
    } = frontmatter
    const disqusConfig = {
      url: `${siteUrl}${permalink}`,
      identifier: Array.isArray(dsq_thread_id) ? dsq_thread_id.join("") : id,
      title: title,
    }

    return (
      <Layout location={location} title={siteTitle} footer={<Packages />}>
        <Seo title={title} description={description || excerpt} image={image} />
        <Logger content={pageContext} />
        <Search />
        <article className="blog-post">
          <PostPagination previous={previous} next={next} />
          <header className="title has-text-centered">
            <h1 className="has-text-success has-text-weight-semibold">
              {title}
            </h1>
            <p
              className="content"
              style={{
                ...scale(-1 / 5),
                marginBottom: rhythm(1),
                marginLeft: 0,
              }}
            >
              {date}
            </p>
            <Tags tags={tags} />
            {image && (
              <Image
                className="image is-rounded-1"
                fluid={image.childImageSharp.fluid}
                style={{ height: "25rem" }}
              />
            )}
          </header>
          <section
            className="content is-medium is-rounded-1 backdrop-blur-5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <Bio />
        </article>
        <Disqus shortname={disqus} config={disqusConfig} />
        <PostPagination previous={previous} next={next} />
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        disqus
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        dsq_thread_id
        permalink
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tags
      }
    }
  }
`
