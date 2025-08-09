import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'Yoyodex', description: 'Ninjas, clans et kekkei genkai' }

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Yoyodex</Link>
            <nav className="flex items-center gap-4">
              <Link className="hover:underline" href="/">Ninjas</Link>
              <Link className="hover:underline" href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        <footer className="mt-auto border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600">© Yoyodex</div>
        </footer>
      </body>
    </html>
  )
}
