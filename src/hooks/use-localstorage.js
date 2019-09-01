import { useState, useEffect } from "react"

export function useLocalStorage(storageKey, initialValue) {
  const [storageVal, setStorageValue] = useState(initialValue)

  useEffect(() => {
    const storageValue = localStorage.getItem(storageKey)
    if (storageValue) {
      setStorageValue(storageValue)
    }
  }, [setStorageValue])

  useEffect(() => {
    localStorage.setItem(storageKey, storageVal)
  }, [storageVal])

  return [storageVal, setStorageValue]
}
