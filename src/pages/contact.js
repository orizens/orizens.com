import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"
import { Skills } from "../components/skills"
import Packages from "../components/packages"
import Bio from "../components/bio"

// import { rhythm } from "../utils/typography"

class ContactPage extends React.Component {
  render() {
    const {
      avatar,
      site: { siteMetadata },
    } = this.props.data
    const { title, author } = siteMetadata
    // const posts = data.allMarkdownRemark.edges

    return (
      <Layout
        location={this.props.location}
        title={title}
        footer={<Packages />}
      >
        <SEO title="All posts" />
        <section className="has-text-centered">
          <Image
            fixed={avatar.childImageSharp.fixed}
            alt={author}
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              minWidth: 50,
              borderRadius: `100%`,
            }}
            imgStyle={{
              borderRadius: `50%`,
            }}
          />
        </section>
        <article>
          <header className="has-text-centered space-vertical">
            <h1 className="title is-1">Contact Me</h1>
            <h2 className="subtitle is-2">
              Consulting &amp; Development (Angular, React)
            </h2>
            <p>Remote development &amp; in house contractors for development</p>
          </header>
          <section className="is-size-4">
            <form
              method="post"
              netlify-honeypot="bot-field"
              data-netlify="true"
            >
              <div className="field">
                <label className="label">Name</label>
                <div className="control has-icons-right">
                  <input
                    className="input is-success"
                    type="text"
                    placeholder="Your Name"
                  />
                  <span className="icon is-small is-right">
                    <i className="fa fa-exclamation-circle"></i>
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input is-success"
                    type="email"
                    placeholder="Email To Reach You"
                    value=""
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-envelope"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fa fa-exclamation-circle"></i>
                  </span>
                </div>
                {/* <p className="help is-danger">This email is invalid</p> */}
              </div>

              <div className="field">
                <label className="label">Message</label>
                <div className="control has-icons-right">
                  <textarea
                    className="textarea is-success"
                    placeholder="Textarea"
                  ></textarea>
                  <span className="icon is-small is-right">
                    <i className="fa fa-exclamation-circle"></i>
                  </span>
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link">Submit</button>
                </div>
              </div>
            </form>
          </section>
          <Bio />
          <Skills />
        </article>
      </Layout>
    )
  }
}

export default ContactPage

export const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-picture.jpg/" }) {
      childImageSharp {
        fixed(width: 200, height: 200) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    book: file(absolutePath: { regex: "/9781484226193.png/" }) {
      childImageSharp {
        fixed(width: 200, height: 285) {
          src
          srcSet
          height
          width
        }
      }
    }
    site {
      siteMetadata {
        author
        occupation
        title
        publications {
          angular
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
