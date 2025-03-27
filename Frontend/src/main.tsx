import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './pages/Sign-in.tsx'

const routes = createBrowserRouter([
  {
    path: "/app",
    element: <App />,
    children: [

    ]
  },
  { path: "/", element: <SignIn /> }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
      <RouterProvider router={routes} />
    </ThemeProvider>
  </StrictMode>,
)
