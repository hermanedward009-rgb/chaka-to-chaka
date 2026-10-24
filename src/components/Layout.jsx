import { Outlet } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData.js'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

export default function Layout() {
  const { storageWarning } = useClubData()

  return (
    <div className="flex min-h-svh flex-col bg-ink text-sand">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-flare focus:px-4 focus:py-2 focus:text-on-flare"
      >
        Skip to content
      </a>
      <Header />
      {storageWarning && (
        <p className="bg-flare px-4 py-2 text-center text-sm font-semibold text-on-flare">{storageWarning}</p>
      )}
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
