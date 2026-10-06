import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ApplicationRoot from './components/ApplicationRoot.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationRoot />
  </StrictMode>,
)
