import React from "react"
import { ExternalLink } from "../components/external-link"

export default function Search({ section = "blog" }) {
  // const [query, setQuery] = React.useState(null)

  // const handleSearch = ev => {
  //   ev.preventDefault()
  //   setQuery(ev.target.value)
  // }
  return (
    <div className="is-flex is-justify-center">
      <ExternalLink
        href={`www.google.com/search?q=site:orizens.com/${section}`}
        target="_blank"
      >
        search orizens.com/{section} with Google
      </ExternalLink>
    </div>
    // <form onSubmit={handleSearch}>
    //   <div className="field">
    //     <div className="control">
    //       <input
    //         className="input is-primary"
    //         type="text"
    //         placeholder="Primary input"
    //       />
    //     </div>
    //   </div>
    // </form>
  )
}
