import "./sentry.ts"
import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

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
const AITweetGeneratorPage = React.lazy(() => import("./pages/AITweetGeneratorPage.tsx"));
const Tweets = React.lazy(() => import("./pages/Tweets.tsx"))
const VerifyOTP = React.lazy(() => import("./pages/VerifyOTP.tsx"))
const UserLikes = React.lazy(() => import("./pages/UserLikes.tsx"))
const Search = React.lazy(() => import("./pages/search.tsx"))
const Update = React.lazy(() => import("./pages/Update.tsx"))
const Avatar = React.lazy(() => import("./pages/UpdateAvatar.tsx"))
const CoverImage = React.lazy(() => import ("./pages/UpdateCoverImage.tsx"))
const Bio = React.lazy(() => import("./pages/updateBio.tsx"))
const BirthDate = React.lazy(() => import("./pages/BirthDate.tsx"))
// const VoiceClone = React.lazy(() => import("./pages/voiceClone.tsx"))


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
  // { path: "/voice-clone", element: <VoiceClone /> },
  {
    path: "/update", element: <Update />, children: [
      { path: "/update/avatar", element: <Avatar /> },
      { path: "/update/coverImage", element: <CoverImage /> },
      { path: "/update/bio", element: <Bio /> },
      { path: "/update/birth-date", element: <BirthDate /> }
    ]
  }
]);

const queryClient = new QueryClient()

// Using a safer pattern for root creation that handles HMR better
let root: ReturnType<typeof createRoot>;

function render() {
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error("Root element not found");
  }
  
  // This prevents multiple root creations during HMR
  if (!root) {
    root = createRoot(container);
  }
  
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <Suspense fallback={<div>loading...</div>}>
                <Sonner />
                <RouterProvider router={routes} />
                <ReactQueryDevtools initialIsOpen={false} position={"right"} />
              </Suspense>
            </ThemeProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}

render();
