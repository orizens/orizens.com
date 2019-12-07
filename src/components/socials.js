import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Socials({ size = 2 }) {
  const data = useStaticQuery(graphql`
    query SocialsQuery {
      site {
        siteMetadata {
          social {
            twitter
            github
            npm
            linkedin
          }
        }
      }
    }
  `)
  const { social } = data.site.siteMetadata

  return (
    <>
      {[
        { icon: "twitter", href: `//twitter.com/${social.twitter}` },
        { icon: "github", href: `//github.com/${social.github}` },
        { icon: "linkedin", href: `//linkedin.com/in/${social.linkedin}` },
        {
          icon: "code-fork",
          href: `//www.npmjs.com/~${social.npm}`,
          tooltip: "npm pacakges",
        },
        {
          icon: "book",
          href: `//www.apress.com/us/book/9781484226193`,
          tooltip: "My Angular & NgRx Reactive Programming Book",
        },
      ].map(({ icon, href, text, tooltip }) => (
        <a
          key={`footer-link-${href}`}
          href={href}
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
          title={tooltip || icon}
        >
          {icon && <span className={`fa fa-${icon} is-size-${size}`}></span>}
          {text && text}
        </a>
      ))}
    </>
  )
}
