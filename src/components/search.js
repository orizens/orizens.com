import React from "react"

export default function Search() {
  const [query, setQuery] = React.useState(null)

  const handleSearch = ev => {
    ev.preventDefault()
    setQuery(ev.target.value)
  }
  return (
    <form onSubmit={handleSearch}>
      <div className="field">
        <div className="control">
          <input
            className="input is-primary"
            type="text"
            placeholder="Primary input"
          />
        </div>
      </div>
    </form>
  )
}
