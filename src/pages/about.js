import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"
import { Link } from "gatsby"
import { Skills } from "../components/skills"
import Packages from "../components/packages"
import Socials from "../components/socials"

// import { rhythm } from "../utils/typography"

class AboutPage extends React.Component {
  render() {
    const {
      avatar,
      book,
      site: { siteMetadata },
    } = this.props.data
    const {
      title,
      author,
      occupation,
      publications: { angular },
    } = siteMetadata
    // const posts = data.allMarkdownRemark.edges

    return (
      <Layout
        location={this.props.location}
        title={title}
        footer={<Packages />}
      >
        <SEO title="All posts" />
        {/* <Bio />I have written {posts.length} Posts so far */}
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
            <h1 className="title is-1">{author}</h1>
            <h2 className="subtitle is-2">{occupation}</h2>
          </header>
          <section className="has-text-centered">
            <Socials size="1" />
          </section>
          <section className="is-size-4">
            <p>
              Hi - I'm {author}. I'm a software engineer, focusing on front end
              &amp; software architecture. <br />I graduated with a{" "}
              <strong>BA in Computer Science &amp; Business Management</strong>{" "}
              from the Open University.
              <br />I earned Software Engineering &amp; Development by
              experimenting, experience, open source and reading a lot.
            </p>
            <p>
              I believe in producing easy maintainable code for applications.
              Today, I lead Orizens in consulting to companies and startups on
              how to approach code in their projects and keep it maintainable.
            </p>
            <p>
              Together with a dedicated &amp; professional team, we provide
              project bootstrapping and development remotely – while afterwards,
              we integrate it on site and guide the team on it.
            </p>
            <p>
              When consulting and developing, we follow 4 simple principles:
            </p>
            <div className="content">
              <ul>
                <li>seeing the code as a reactive system</li>
                <li>implementing best practices of software architecture</li>
                <li>creating modular &amp; testable code</li>
                <li>
                  keeping code and app structure organized to let other
                  developers easily understand and further extend it.
                </li>
                <li>Automating development with CI/CD (travis/circle ci)</li>
              </ul>
            </div>
            <h2 className="title" id="achievements">
              Achievements I'm Proud Of
            </h2>
            <p>I'm proficient with React, Angular and Javascript in general.</p>
            <p>
              My open source Angular App -{" "}
              <a
                href="//echoesplayer.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Echoes Player
              </a>
            </p>
            <p>
              My most popular npm module (Used By{" "}
              <a href="//google.com" target="_blank" rel="noopener noreferrer">
                Google
              </a>
              ,{" "}
              <a href="//amazon.com" target="_blank" rel="noopener noreferrer">
                Amazon
              </a>
              , <a href="//disney.com">Disney</a> and more)-
              <br />
              <a
                href="//www.npmjs.com/package/ngx-infinite-scroll"
                target="_blank"
                rel="noopener noreferrer"
              >
                ngx-infinite-scroll -{" "}
              </a>
              <img
                src="//img.shields.io/npm/dt/ngx-infinite-scroll.svg"
                alt="total npm downloads until today"
              />
              <img
                src="//img.shields.io/npm/dm/ngx-infinite-scroll.svg"
                alt="npm downloads a month"
              />
            </p>
            <p>
              I’m the author of{" "}
              <Link to="http://www.apress.com/us/book/9781484226193">
                "Reactive Programming with Angular and NgRx"
              </Link>
            </p>
          </section>

          <section className="has-text-centered space-vertical">
            <a href={angular} target="_blank" rel="noopener noreferrer">
              <Image fixed={book.childImageSharp.fixed} alt={author} />
            </a>
          </section>
          <Skills />
        </article>
      </Layout>
    )
  }
}

export default AboutPage

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
