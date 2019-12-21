import React, { useCallback, useEffect } from "react"
import { useLocalStorage } from "../hooks/use-localstorage"

const DARK_CLASSNAME = "dark-mode"
const THEME_KEY = "orizens-theme"

export default function Theme() {
  const [storageValue, setStorageValue] = useLocalStorage(THEME_KEY, "")

  const toggleTheme = useCallback(
    ({ currentTarget }) => {
      setStorageValue(!storageValue ? DARK_CLASSNAME : "")
      currentTarget.blur()
    },
    [storageValue]
  )

  useEffect(() => {
    const body = document.querySelector("body")
    body.classList.remove(DARK_CLASSNAME)
    storageValue && body.classList.add(storageValue)
  }, [storageValue])

  return (
    <button
      className={`button is-warning ${storageValue ? "" : "is-outlined"}`}
      onClick={toggleTheme}
    >
      <span class="icon is-small">
        <i className="fa fa-adjust"></i>
      </span>
    </button>
  )
}
