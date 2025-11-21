import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DynamicContext } from './contexts/DynamicContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContext>
      <App />
    </DynamicContext>
  </StrictMode>,
)
