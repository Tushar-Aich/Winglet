import { Button } from "@/components/ui/button"
import { RootState } from "@/store/store"
import { ArrowLeft } from "lucide-react"
import { useSelector } from "react-redux"
import { NavLink, Outlet, useNavigate } from "react-router-dom"

const Update = () => {
    const navigate = useNavigate()
    const rootUser = useSelector((state: RootState) => state.user.user);

    const links = [
        {
            name: "Avatar",
            slug: "/update/avatar"
        },
        {
            name: "Cover Image",
            slug: "/update/coverImage"
        },
        {
            name: "Bio",
            slug: "/update/bio"
        },
        {
            name: "Birth Date",
            slug: "/update/birth-date"
        },
        {
            name: "Password",
            slug: "/update/password"
        },
    ]
  return (
    <div className="overflow-auto">
        <Button
            variant="ghost"
            className="p-4 rounded-lg border-muted-foreground border-2 relative top-3 left-2 cursor-pointer"
            onClick={() => navigate(`/home/profile/${rootUser?._id}`)}
        >
            <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
        </Button>
        <div className="flex justify-between items-center mt-4 border-b-1 border-black dark:border-white relative px-1">
            {links.map((link, idx) => (
              <NavLink key={idx} to={link.slug} className={({isActive}) => `w-auto sm:w-[20%] flex justify-center text-zinc-800 dark:text-gray-300 font-bold text-md ${isActive ? "border-b-4 border-b-blue-400 text-black dark:text-white" : ""}`}>
                {link.name}
              </NavLink>
            ))}
        </div>
        <Outlet />
    </div>
  )
}

export default Update