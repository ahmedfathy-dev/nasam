import { useState } from 'react'
import DashboardLayout from './DashboardLayout'
import LoginPage from './LoginPage'

function ApplicationRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    window.localStorage.getItem('nasam-authenticated') === 'true'
    || window.sessionStorage.getItem('nasam-authenticated') === 'true',
  )

  function handleLogin(rememberMe: boolean) {
    const selectedStorage = rememberMe ? window.localStorage : window.sessionStorage
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage
    otherStorage.removeItem('nasam-authenticated')
    selectedStorage.setItem('nasam-authenticated', 'true')
    setIsAuthenticated(true)
  }

  function handleLogout() {
    window.localStorage.removeItem('nasam-authenticated')
    window.sessionStorage.removeItem('nasam-authenticated')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />

  return <DashboardLayout onLogout={handleLogout} />
}

export default ApplicationRoot