import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import { AppProvider } from './contexts/AppContext.tsx'
import { DynamicContext } from './contexts/DynamicContext.tsx'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <AppProvider>
      <DynamicContext>
        <App />
      </DynamicContext>
    </AppProvider>
    <ToastContainer />
  </StrictMode>,
)
