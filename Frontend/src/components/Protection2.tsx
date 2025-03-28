import { Navigate, Outlet } from "react-router-dom"

const Protection2 = () => {
    const OTPmatched = localStorage.getItem('OTPmatched')
    return OTPmatched ? <Outlet /> : <Navigate to="/send-otp" replace/>
}

export default Protection2