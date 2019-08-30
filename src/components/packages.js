import React from "react"
import { Logger } from "./logger"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const packages = [
  {
    className: "package1",
    url: "https://goo.gl/RJgihR",
    image: "premium",
  },
  {
    className: "package2",
    url: "https://goo.gl/7zg4y9",
    image: "reactive",
  },
  {
    className: "package3",
    url: "https://goo.gl/6iAYIi",
    image: "reinvented",
  },
]

const Packages = () => {
  const data = useStaticQuery(graphql`
    query PackagesQuery {
      premium: file(absolutePath: { regex: "/package-premium.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      reactive: file(absolutePath: { regex: "/package-reactive.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      reinvented: file(absolutePath: { regex: "/package-reinvented.*.png/" }) {
        childImageSharp {
          fixed(width: 370, height: 180) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  return (
    <article class="section">
      <h2 class="title is-3 has-text-centered">My Consulting Packages</h2>
      <h3 class="subtitle has-text-centered">
        I offer code reviews (Angular, NgRx, React, Javascript), workshops,
        Consulting and Development. Feel free to reach out thru the below forms.
      </h3>
      <section className="columns space-vertical">
        {packages.map(({ className, url, image }) => (
          <section key={url} className="column">
            <a href={url} className={`package ${className}`}>
              <Image fixed={data[image].childImageSharp.fixed} alt={image} />
            </a>
          </section>
        ))}
      </section>
    </article>
  )
}

export default Packages
