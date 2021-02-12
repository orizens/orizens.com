import React from "react"
import { ExternalLink } from "../components/external-link"
import algoliasearch from "algoliasearch/lite"
import { connectSearchBox } from "react-instantsearch-dom"

import {
  InstantSearch,
  // SearchBox,
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
          <div className="has-text-primary is-size-5">{hit.title}</div>
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

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <div className="is-justify-center is-flex">
    <form
      noValidate
      action=""
      role="search"
      className="ais-SearchBox-form is-flex is-primary"
    >
      <input
        type="search"
        className="ais-SearchBox-input input is-rounded zindex-1"
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
      />
      <button
        className="button is-danger is-rounded btn-clear-search"
        onClick={() => refine("")}
      >
        <i className="las la-times" />
      </button>
      {isSearchStalled ? "My search is stalled" : ""}
    </form>
  </div>
)

const OrizensSearchBox = connectSearchBox(SearchBox)
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
          <OrizensSearchBox />
          <div class="panel">
            <Snippet attribute="description" hit={Hit} />
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
