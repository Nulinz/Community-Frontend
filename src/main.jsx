import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MainProvider } from './context/MainContext.jsx'
import TitleProvider from './context/AdminTitle.jsx'



createRoot(document.getElementById('root')).render(
            <TitleProvider>
            <MainProvider>

                    <App />
            </MainProvider>
            </TitleProvider>
)
