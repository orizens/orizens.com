import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import Image from "gatsby-image"

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
        style={{
          marginBottom: rhythm(1 / 2),
        }}
      >
        <h2 className="is-size-3 space-bottom-3">
          <Link to={permalink}>{title || slug}</Link>
        </h2>
        <small className="subtitle">{new Date(date).toDateString()}</small>
      </header>
      <section>
        {image && (
          <Link to={permalink}>
            <Image
              className="image"
              fluid={image.childImageSharp.fluid}
              style={{ height: "8rem" }}
            />
          </Link>
        )}
        <p
          className="content"
          dangerouslySetInnerHTML={{
            __html: description || excerpt,
          }}
        />
        <div className="tags">
          {tags &&
            tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
        </div>
      </section>
    </section>
  </article>
)
