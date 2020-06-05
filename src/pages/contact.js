import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"
import { Skills } from "../components/skills"
import Packages from "../components/packages"
import Bio from "../components/bio"

// import { rhythm } from "../utils/typography"
const SUBMIT_PARAM = "success"
export default function ContactPage({ data, location }) {
  const {
    avatar,
    site: { siteMetadata },
  } = data
  const { title, author } = siteMetadata
  const { search } = location
  const [formSubmitted, setFormSubmitted] = useState(false)
  // const posts = data.allMarkdownRemark.edges
  useEffect(() => {
    const timer = setTimeout(() => {
      const submitted = search.includes(SUBMIT_PARAM)
      if (submitted) {
        setFormSubmitted(true)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout location={location} title={title} footer={<Packages />}>
      <SEO title="All posts" />
      <section className="has-text-centered">
        <Image
          className="profile"
          fixed={avatar.childImageSharp.fixed}
          alt={author}
        />
      </section>
      <article>
        <header className="has-text-centered space-vertical">
          <h1 className="title is-1">Contact Me</h1>
          <h2 className="subtitle is-2">
            Consulting &amp; Development
            <br />
            (Javascript, Angular, React)
          </h2>
          <p>Remote development &amp; in house contractors for development</p>
        </header>
        <section className="is-size-4">
          {formSubmitted && (
            <h2 className="title is-2">
              Thank you for contacting me. I'll get back to you as soon as I
              can.
            </h2>
          )}
          <form
            name="Contact Form"
            method="POST"
            action={`/contact?${SUBMIT_PARAM}`}
            data-netlify="true"
            className="content is-medium is-rounded-1"
          >
            <input type="hidden" name="form-name" value="Contact Form" />
            <div className="field">
              <label className="label">Name</label>
              <div className="control has-icons-right">
                <input
                  className="input is-success"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                />
                <span className="icon is-small is-right">
                  <i className="las la-exclamation-circle"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input is-success"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email To Reach You"
                  required
                />
                <span className="icon is-small is-left">
                  <i className="las la-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="las la-exclamation-circle"></i>
                </span>
              </div>
              {/* <p className="help is-danger">This email is invalid</p> */}
            </div>

            <div className="field">
              <label className="label">Message</label>
              <div className="control has-icons-right">
                <textarea
                  name="message"
                  id="message"
                  className="textarea is-success"
                  placeholder="Textarea"
                  required
                ></textarea>
                <span className="icon is-small is-right">
                  <i className="las la-exclamation-circle"></i>
                </span>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Submit
                </button>
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
