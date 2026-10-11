// Page numbers are 1-based. Shows first, last and a window around the current page.
function getPageItems(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const items = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(`gap-${p}`)
    items.push(p)
  })
  return items
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn btn-outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="pagination-gap">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={item === page ? 'btn page-btn' : 'btn btn-outline page-btn'}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" className="btn btn-outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  )
}
