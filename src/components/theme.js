import React, { useCallback, useEffect } from "react"
import { useLocalStorage } from "../hooks/use-localstorage"

export const DARK_CLASSNAME = "dark-mode"
const THEME_KEY = "orizens-theme"

export default function Theme() {
  const [storageValue, setStorageValue] = useLocalStorage(
    THEME_KEY,
    DARK_CLASSNAME
  )

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
      className={`button is-relative is-rounded is-black is-dark-bg-theme ${
        storageValue ? "is-dark-active" : ""
      }`}
      onClick={toggleTheme}
    >
      <span className="icon is-large">
        <i className={`is-size-3 las la-${storageValue ? "moon" : "sun"}`}></i>
      </span>
    </button>
  )
}
