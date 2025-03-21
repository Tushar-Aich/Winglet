import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from 'next-themes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home, FAQ, Features, Testimonials } from "./pages/index.ts"
import App from './App.tsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home />},
      { path: "faq", element: <FAQ />},
      { path: "features", element: <Features />},
      { path: "testimonials", element: <Testimonials />},
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme='system' enableSystem >
      <RouterProvider router={route} />
    </ThemeProvider>
  </StrictMode>,
)
