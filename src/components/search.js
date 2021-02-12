import React from "react"
import { ExternalLink } from "../components/external-link"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom"

const searchClient = algoliasearch(
  "OHCG2E3NIE",
  "1d6a1b6eac52dac38869d0f5a6ac930f"
)

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
      {/* <InstantSearch indexName="orizens" searchClient={searchClient}>
        <SearchBox />
        <Hits />
      </InstantSearch> */}
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
