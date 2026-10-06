import { Mail, Phone } from 'lucide-react'

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">Contact us</h1>
        <p className="mt-4 text-base text-muted-strong">Have questions? We're here to help.</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6 flex items-start gap-3">
          <Mail className="h-5 w-5 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-strong">support@ridex.com</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6 flex items-start gap-3">
          <Phone className="h-5 w-5 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-muted-strong">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  )
}