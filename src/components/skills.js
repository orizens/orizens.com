import React from "react"

const skills = [
  {
    icon: "keyboard-o",
    label: "Our Tech Stack",
    content: [
      { link: "//angular.io", label: "Angular (Typescript)" },
      { link: "//github.com/ngrx", label: "NgRx" },
      { link: "//facebook.github.io/react/", label: "React" },
      { link: "//github.com/reactjs/redux", label: "Redux" },
      { link: "//sass-lang.com/", label: "Sass" },
    ],
  },
  {
    icon: "code-fork",
    label: "Open Source Projects",
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
    <article className="columns content">
      {skills.map(({ icon, label, content }) => (
        <section className="column" key={`skill-${icon}`}>
          <h2>
            <i className={`fa fa-${icon}`}></i> {label}
          </h2>
          <div className="content">
            <ul>
              {content.map(link => (
                <li key={`skill-link-${link.label}`}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </article>
  )
}
