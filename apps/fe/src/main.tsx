import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import { DynamicContext } from './contexts/DynamicContext.tsx'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContext>
      <App />
    </DynamicContext>
    <ToastContainer />
  </StrictMode>,
)
