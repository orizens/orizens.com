import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import Image from "gatsby-image"
import { Tags } from "./tags"

export const PostExcerpt = ({
  slug,
  permalink,
  title,
  date,
  image,
  excerpt,
  description,
  tags,
}) => (
  <article key={slug} className="space-vertical">
    <section className="section has-background-white-bis is-rounded-1">
      <header
        className="has-text-centered"
        style={{
          marginBottom: rhythm(1 / 2),
        }}
      >
        <h2 className="is-size-3 space-bottom-3">
          <Link to={permalink}>{title || slug}</Link>
        </h2>
        <small className="subtitle">{new Date(date).toDateString()}</small>
        <Tags tags={tags} />
      </header>
      <section>
        {image && (
          <Link to={permalink}>
            {image && (
              <Image
                className="image h-5 is-rounded-1"
                fluid={image.childImageSharp.fluid}
              />
            )}
          </Link>
        )}
        <p
          className="content is-mxless"
          dangerouslySetInnerHTML={{
            __html: description || excerpt,
          }}
        />
      </section>
    </section>
  </article>
)
