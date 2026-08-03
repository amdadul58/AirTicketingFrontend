export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-6 font-mono text-sm">
      <button className="btn btn-outline !px-3 !py-1.5" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ‹ Prev
      </button>
      <span className="text-slate-450">Page {page} / {totalPages}</span>
      <button className="btn btn-outline !px-3 !py-1.5" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next ›
      </button>
    </div>
  )
}
