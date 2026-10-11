import useDebouncedInput from '../hooks/useDebouncedInput'

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useDebouncedInput(value, onSearch)

  return (
    <input
      type="search"
      className="input"
      placeholder="Search events, artists or teams..."
      aria-label="Search events"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  )
}
