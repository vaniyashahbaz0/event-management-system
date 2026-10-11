import { useEffect, useRef, useState } from 'react'

// Keeps local text for a controlled input and commits it after `delay` ms of
// inactivity. External changes to `value` (back button, reset) replace the text.
export default function useDebouncedInput(value, onCommit, delay = 500) {
  const [text, setText] = useState(value)
  const committed = useRef(value)

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value
      setText(value)
    }
  }, [value])

  useEffect(() => {
    if (text === committed.current) return undefined
    const timer = setTimeout(() => {
      committed.current = text
      onCommit(text)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, onCommit, delay])

  return [text, setText]
}
