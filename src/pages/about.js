import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "gatsby-image"
// import { rhythm } from "../utils/typography"
import { Link } from "gatsby"
import { Skills } from "../components/skills"
import Packages from "../components/packages"
import Socials from "../components/socials"
import { Icon } from "../components/icon"
import { ExternalLink } from "../components/external-link"

// import { rhythm } from "../utils/typography"

class AboutPage extends React.Component {
  render() {
    const {
      avatar,
      readm,
      echoes,
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
        <section className="has-text-centered pt-4">
          <Image
            className="profile"
            fixed={avatar.childImageSharp.fixed}
            alt={author}
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
          <section className="content is-size-4 is-medium is-rounded-1 mt-3 m-auto">
            <p className="m-auto">
              Hi - I'm {author}. I'm a Senior Software Engineer / Front End Tech
              Lead, focusing on{" "}
              <strong>Front End &amp; Software Architecture</strong>. <br />I
              graduated with a{" "}
              <strong>BA in Computer Science &amp; Business Management</strong>{" "}
              from the Open University.
            </p>
            <p className="m-auto">
              I earned Software Engineering &amp; Development skills by being{" "}
              <strong>self-driven</strong> and making things happen,
              experimenting, experience,
              <ExternalLink href="github.com/orizens" className="ml-1">
                open source
              </ExternalLink>{" "}
              some of my work,
              <Link to="/" className="ml-1 mr-1">
                writing
              </Link>
              about it and reading a lot.
            </p>
            <p className="m-auto">
              In my work, I incorporate a 3 point perspective to software
              architecture while looking at a challenge with depth and entirety.{" "}
              <br />
              With my experience - i'm able to lead teams into taking a unique
              perspective, look up and move forward.
              <br />I believe in producing easy{" "}
              <strong>maintainable code</strong> for applications. I consult to
              companies and startups on how to approach code in their projects,
              keep it maintainable and focusing on delivering a{" "}
              <strong>high quality</strong> and well tested code.
            </p>
            <p className="m-auto">
              When consulting and developing, I like to make a difference by
              following simple principles:
            </p>
            <div className="content">
              <ul className="list-unstyled">
                {[
                  <>
                    seeing the code as a live <strong>reactive system</strong>
                  </>,
                  <>
                    implementing best practices of software architecture,
                    creating <strong>modular &amp; testable code</strong>
                  </>,
                  <>
                    Understanding the big picture while{" "}
                    <strong>breaking down complex problems</strong> to smaller
                    challenges
                  </>,
                  <>
                    keeping code and app <strong>structure organized</strong> to
                    let other developers easily understand and further extend
                    it.
                  </>,
                  <>
                    <strong>Automating</strong> development with CI/CD
                    (travis/circle ci)
                  </>,
                ].map((text, index) => (
                  <li key={`princ-${index}`}>
                    <Icon name="chevron-circle-right" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="content is-medium is-rounded-1">
            <h2 className="title has-text-centered" id="achievements">
              <i className="las la-certificate mr-1" /> Achievements I'm Proud
              Of
            </h2>
            <p className="m-auto is-size-4">
              I'm proficient with React, Angular and Javascript in Front End
              Development.
            </p>
            <ul className="list-unstyled is-size-4">
              {[
                {
                  href: "readm.netlify.app",
                  linkText: "ReadM",
                  image: readm,
                  desc:
                    "Practice Reading With Real-Time Feedback App (React, Redux, Firebase, PWA)",
                },
                {
                  href: "echoesplayer.netlify.app",
                  linkText: "Echoes Player",
                  image: echoes,
                  desc:
                    "A YouTube™ Alternative Web App Media Player (Made With Angular, Open Source, PWA)",
                },
                {
                  href: "npmjs.com/package/ngx-infinite-scroll",
                  linkText: (
                    <>
                      ngx-infinite-scroll{" "}
                      <img
                        src="//img.shields.io/npm/dt/ngx-infinite-scroll.svg"
                        alt="total npm downloads until today"
                      />
                      <img
                        src="//img.shields.io/npm/dm/ngx-infinite-scroll.svg"
                        alt="npm downloads a month"
                        className="mr-1"
                      />
                    </>
                  ),
                  desc: (
                    <>
                      My most popular npm module (
                      <ExternalLink
                        href="twitter.com/orizens/status/1251531163266617345"
                        className="mr-1 has-text-danger"
                      >
                        Used
                      </ExternalLink>
                      By{" "}
                      {[
                        { href: "google.com", text: "Google" },
                        { href: "microsoft.com", text: "Microsoft" },
                        { href: "amazon.com", text: "Amazon" },
                        { href: "disney.com", text: "Disney" },
                      ].map(({ href, text }) => (
                        <>
                          <ExternalLink href={href} className="">
                            {text}
                          </ExternalLink>{" "}
                        </>
                      ))}
                      <span className="ml-1">and others</span>)
                    </>
                  ),
                },
              ].map(({ href, linkText, desc, image }) => (
                <li key={href} className="columns">
                  <section className="column">
                    <Icon name="chevron-circle-right" />
                    <ExternalLink
                      href={href}
                      title={`${href} ${linkText.length ? linkText : ""}`}
                      className="mr-1"
                    >
                      {linkText}
                    </ExternalLink>
                    {desc}
                  </section>
                  {image && (
                    <ExternalLink
                      href={href}
                      title={desc}
                      className="column is-half link-hover-no-line"
                    >
                      <img
                        {...image.childImageSharp.fluid}
                        className="shadow-sm"
                        alt={linkText}
                      />
                    </ExternalLink>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="has-text-centered space-vertical columns content is-medium is-rounded-1">
            <h2 className="column is-size-3 lh-4">
              <i className="las la-book-reader mr-1" /> I’m the author of{" "}
              <ExternalLink href="//www.apress.com/us/book/9781484226193">
                "Reactive Programming with Angular and NgRx"
              </ExternalLink>
              <aside className="is-size-6">
                (first book on Angular &amp; NgRx)
              </aside>
            </h2>
            <ExternalLink href={angular} className="column link-hover-no-line">
              <Image fixed={book.childImageSharp.fixed} alt={author} />
            </ExternalLink>
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
    avatar: file(absolutePath: { regex: "/profile-2021.jpg/" }) {
      childImageSharp {
        fixed(width: 200, height: 200) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    readm: file(absolutePath: { regex: "/readm.png/" }) {
      childImageSharp {
        fluid {
          src
          srcSet
          sizes
        }
      }
    }
    echoes: file(absolutePath: { regex: "/echoes.png/" }) {
      childImageSharp {
        fluid {
          src
          srcSet
          sizes
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
