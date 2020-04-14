import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const packages = [
  {
    className: "package1",
    url: "https://goo.gl/RJgihR",
    image: "javascript",
  },
  {
    className: "package2",
    url: "https://goo.gl/7zg4y9",
    image: "react",
  },
  {
    className: "package3",
    url: "https://goo.gl/6iAYIi",
    image: "angular",
  },
]

const Packages = () => {
  const data = useStaticQuery(graphql`
    query PackagesQuery {
      javascript: file(absolutePath: { regex: "/package-js.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      react: file(absolutePath: { regex: "/package-react.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      angular: file(absolutePath: { regex: "/package-angular.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  return (
    <article className="section pb-4" id="consulting">
      <h2 className="title is-3 has-text-centered">My Consulting Packages</h2>
      <h3
        className="subtitle has-text-centered"
        style={{ width: "50%", margin: "0 auto" }}
      >
        My consulting offerings include: Front End Development, Code reviews
        (Angular, NgRx, React, Redux, Javascript), workshops, Consulting and
        Development. Feel free to reach out thru the below forms or through the
        <a href="/contact"> contact</a> page.
      </h3>
      <section className="columns space-vertical">
        {packages.map(({ className, url, image }) => (
          <section key={url} className="column">
            <a
              href={url}
              className={`package ${className}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Image fixed={data[image].childImageSharp.fixed} alt={image} />
            </a>
          </section>
        ))}
      </section>
    </article>
  )
}

export default Packages
