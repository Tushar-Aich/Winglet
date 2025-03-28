import { Navigate, Outlet } from "react-router-dom"

const Protection1 = () => {
    const emailSent = localStorage.getItem('emailSent')
  return emailSent ? <Outlet /> : <Navigate to="/send-otp" replace/>
}
export default Protection1