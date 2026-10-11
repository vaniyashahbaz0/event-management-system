export default function CategoryChips({ categories, selected, onSelect }) {
  const options = [{ label: 'All', value: '' }, ...categories.map((c) => ({ label: c, value: c }))]

  return (
    <div className="chips" role="group" aria-label="Browse by category">
      {options.map(({ label, value }) => (
        <button
          key={label}
          type="button"
          className={value === selected ? 'chip chip-active' : 'chip'}
          aria-pressed={value === selected}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
