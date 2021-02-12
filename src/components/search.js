import React from "react"
import { ExternalLink } from "../components/external-link"
import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  SearchBox,
  Snippet,
  Hits,
} from "react-instantsearch-dom"
const filterResult =
  "Front End Engineer, React Consultant, Software Architect, Javascript, Angular and much more"
const Hit = ({ hit }) =>
  hit.description === filterResult ? null : (
    <a href={hit.url} className="m-auto ">
      <article className="has-background-white-bis has-text-centered mt-3 is-flex-column section">
        <h2 className="space-bottom-3">
          <a href={hit.url} className="m-auto ">
            {hit.title}
          </a>
          <div class="media section is-flex-column">
            <figure className="is-rounded-1 overflow-hidden">
              <img src={hit.image} />
            </figure>
            <Snippet
              hit={hit}
              attribute="description"
              className="subtitle media-content"
            />
          </div>
        </h2>
      </article>
    </a>
  )

const searchClient = algoliasearch(
  "OHCG2E3NIE",
  "1d6a1b6eac52dac38869d0f5a6ac930f"
)
const orizensIndex = "netlify_9242e31d-4a5c-41c7-8c4d-86a46f4b0c49_master_all"
export default function Search({ section = "blog" }) {
  // const [query, setQuery] = React.useState(null)

  // const handleSearch = ev => {
  //   ev.preventDefault()
  //   setQuery(ev.target.value)
  // }
  return (
    <>
      <div className="is-flex-column is-justify-center">
        {/* <ExternalLink
          href={`www.google.com/search?q=site:orizens.com/${section}`}
          target="_blank"
        >
          search orizens.com/{section} with Google
        </ExternalLink> */}
        <InstantSearch indexName={orizensIndex} searchClient={searchClient}>
          <SearchBox className="is-justify-center is-flex" />
          <div class="panel">
            <Snippet
              attribute="description"
              hit={Hit}
              // Optional parameters
            />
          </div>
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </div>
    </>
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
