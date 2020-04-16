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
    debugger
    const body = document.querySelector("body")
    body.classList.remove(DARK_CLASSNAME)
    storageValue && body.classList.add(storageValue)
  }, [storageValue])

  return (
    <button
      className={`button is-warning ${storageValue ? "" : "is-outlined"}`}
      onClick={toggleTheme}
    >
      <span className="icon is-small">
        <i className="las la-adjust"></i>
      </span>
    </button>
  )
}
