import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/Sign-in.tsx";
import SendOTP from "./pages/SendOTP.tsx";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail.tsx";
import VerifyOTP from "./pages/VerifyOTP.tsx";
import SignUp from "./pages/SignUp.tsx";
import Protection1 from "./components/Protection1.tsx";
import Protection2 from "./components/Protection2.tsx";
import Home from "./pages/Home.tsx";
import Profile from './pages/Profile.tsx'

const routes = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "/home/profile", element: <Profile /> },
    ],
  },
  { path: "/", element: <SignIn /> },
  { path: "/send-otp", element: <SendOTP /> },
  { path: "/forgot-password-email", element: <ForgotPasswordEmail /> },
  {
    element: <Protection1 />,
    children: [{ path: "/verify-otp", element: <VerifyOTP /> }],
  },
  {
    element: <Protection2 />,
    children: [{ path: "/sign-up", element: <SignUp /> }],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Sonner />
            <RouterProvider router={routes} />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
