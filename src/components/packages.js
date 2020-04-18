import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import { ExternalLink } from "./external-link"

const packages = [
  {
    className: "package1",
    url: "goo.gl/RJgihR",
    image: "javascript",
  },
  {
    className: "package2",
    url: "goo.gl/7zg4y9",
    image: "react",
  },
  {
    className: "package3",
    url: "goo.gl/6iAYIi",
    image: "angular",
  },
]

const Packages = () => {
  const data = useStaticQuery(graphql`
    query PackagesQuery {
      javascript: file(absolutePath: { regex: "/package-js.*.png/" }) {
        childImageSharp {
          fluid {
            src
            srcSet
            sizes
          }
        }
      }
      react: file(absolutePath: { regex: "/package-react.*.png/" }) {
        childImageSharp {
          fluid {
            src
            srcSet
            sizes
          }
        }
      }
      angular: file(absolutePath: { regex: "/package-angular.*.png/" }) {
        childImageSharp {
          fluid {
            src
            srcSet
            sizes
          }
        }
      }
    }
  `)
  console.log(data["angular"].childImageSharp.fluid)
  return (
    <article className="content is-medium section pb-4" id="consulting">
      <h2 className="title is-3 has-text-centered">My Consulting Packages</h2>
      <p
        className="subtitle has-text-centered is-size-4"
        style={{ width: "50%", margin: "0 auto" }}
      >
        My consulting offerings include: Front End Development, Code reviews
        (Angular, NgRx, React, Redux, Javascript), workshops, Consulting and
        Development. Feel free to reach out thru the below forms or through the
        <Link to="/contact" className="ml-1">
          contact
        </Link>{" "}
        page.
      </p>
      <section className="columns space-vertical">
        {packages.map(({ className, url, image }) => (
          <section key={url} className="column has-text-centered">
            <ExternalLink
              href={url}
              className={`package ${className}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img {...data[image].childImageSharp.fluid} alt={image} />
            </ExternalLink>
          </section>
        ))}
      </section>
    </article>
  )
}

export default Packages
