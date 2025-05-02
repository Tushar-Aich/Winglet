import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";


const App = React.lazy(() => import("./App.tsx"))
const SignIn = React.lazy(() => import("./pages/Sign-in.tsx"))
const SendOTP = React.lazy(() => import("./pages/SendOTP.tsx"))
const ForgotPasswordEmail = React.lazy(() => import("./pages/ForgotPasswordEmail.tsx"))
const SignUp = React.lazy(() => import("./pages/SignUp.tsx"))
const Protection1 = React.lazy(() => import("./components/Protection1.tsx"))
const Protection2 = React.lazy(() => import("./components/Protection2.tsx"))
const Home = React.lazy(() => import("./pages/Home.tsx"))
const Profile = React.lazy(() => import("./pages/Profile.tsx"))
const UserChats = React.lazy(() => import("./pages/UserChats.tsx"))
const Tweets = React.lazy(() => import("./pages/Tweets.tsx"))
const VerifyOTP = React.lazy(() => import("./pages/VerifyOTP.tsx"))
const UserLikes = React.lazy(() => import("./pages/UserLikes.tsx"))
const Search = React.lazy(() => import("./pages/search.tsx"))
const routes = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "/home/profile/:userId", element: <Profile />, children: [
        { path: "/home/profile/:userId/tweets", element: <UserChats /> },
        { path: "/home/profile/:userId/likes", element: <UserLikes /> },
      ] },
      { path: "/home/tweets/:tweetId", element: <Tweets /> },
      { path: "/home/search", element: <Search /> }
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
            <Suspense fallback={<div>loading...</div>}>
              <Sonner />
              <RouterProvider router={routes} />
            </Suspense>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
