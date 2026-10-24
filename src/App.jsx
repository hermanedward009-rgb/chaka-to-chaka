import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard.jsx'
import DataTools from './components/DataTools.jsx'
import Layout from './components/Layout.jsx'
import LogoManager from './components/LogoManager.jsx'
import PasswordForm from './components/PasswordForm.jsx'
import SettingsForm from './components/SettingsForm.jsx'
import ClubProvider from './components/ClubProvider.jsx'
import AdminPage from './pages/AdminPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MatchesPage from './pages/MatchesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RequestMatchPage from './pages/RequestMatchPage.jsx'
import SquadPage from './pages/SquadPage.jsx'
import GalleryAdmin from './pages/admin/GalleryAdmin.jsx'
import MatchesAdmin from './pages/admin/MatchesAdmin.jsx'
import PlayersAdmin from './pages/admin/PlayersAdmin.jsx'

export default function App() {
  return (
    <ClubProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="squad" element={<SquadPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="request" element={<RequestMatchPage />} />
            <Route path="admin" element={<AdminPage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AdminDashboard />} />
              <Route path="players" element={<PlayersAdmin />} />
              <Route path="matches" element={<MatchesAdmin />} />
              <Route path="branding" element={<LogoManager />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="settings" element={<SettingsForm />} />
              <Route path="password" element={<PasswordForm />} />
              <Route path="data" element={<DataTools />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClubProvider>
  )
}
