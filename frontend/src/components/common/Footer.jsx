export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-ink"></span>
            <span className="text-lg font-medium tracking-tight">RideX</span>
          </div>
          <p className="text-sm text-muted">© {new Date().getFullYear()} RideX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}