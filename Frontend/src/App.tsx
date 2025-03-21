import Footer from "./components/Footer"
import NavBar from "./components/NavBar"
import { Outlet } from "react-router-dom"


const Page = () => {

  return (
    <>
    <NavBar />
    <Outlet />
    <Footer />
    </>
  )
}

export default Page
