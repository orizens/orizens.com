import React from "react"
import { ExternalLink } from "./external-link"

const skills = [
  {
    icon: "laptop-code",
    label: "My Tech Stack",
    content: [
      { link: "//facebook.github.io/react/", label: "React (Typescript)" },
      { link: "//github.com/reactjs/redux", label: "Redux" },
      { link: "//angular.io", label: "Angular (Typescript)" },
      { link: "//github.com/ngrx", label: "NgRx" },
      { link: "//firebase.com/", label: "Firebase" },
      { link: "//sass-lang.com/", label: "Sass" },
    ],
  },
  {
    icon: "code",
    label: "Open Source",
    content: [
      {
        link: "//github.com/orizens/echoes-player",
        label: "Echoes Player App",
      },
      {
        link: "//npmjs.com/package/ngx-infinite-scroll",
        label: "Angular Infinite Scroll",
      },
      { link: "//npmjs.com/package/ngx-typeahead", label: "Angular Typeahead" },
      {
        link: "//npmjs.com/package/ngx-youtube-player",
        label: "Angular Youtube Player",
      },
      {
        link: "//github.com/orizens/ngrx-styleguide",
        label: "Angular NgRx Style Guide",
      },
      { link: "//github.com/orizens", label: "More Projects..." },
    ],
  },
]
export const Skills = () => {
  return (
    <article
      className="columns content is-medium is-rounded-1 is-marginless"
      id="skills"
    >
      {skills.map(({ icon, label, content }) => (
        <section className="column" key={`skill-${icon}`}>
          <h2>
            <i className={`las la-${icon}`}></i> {label}
          </h2>
          <div className="content">
            <ul className="list-unstyled">
              {content.map(link => (
                <li key={`skill-link-${link.label}`}>
                  <i className="las la-chevron-circle-right mr-1" />
                  <ExternalLink href={link.link}>{link.label}</ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </article>
  )
}
