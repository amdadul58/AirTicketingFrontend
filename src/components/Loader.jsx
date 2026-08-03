export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-450">
      <div className="w-8 h-8 border-2 border-navy-900/20 border-t-amber-500 rounded-full animate-spin" />
      <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
    </div>
  )
}
