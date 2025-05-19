import { Button } from "@/components/ui/button"
import { RootState } from "@/store/store"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { AlignJustify, ArrowLeft } from "lucide-react"
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
            name: "Voice Clone",
            slug: "/update/voice"
        },
        {
            name: "Password",
            slug: "/update/password"
        },
        {
            name: "Settings",
            slug: "/setting"
        },
    ]
  return (
    <div>
        <Button
            variant="ghost"
            className="p-4 rounded-lg border-muted-foreground border-2 relative top-3 left-2 cursor-pointer hidden md:flex"
            onClick={() => navigate(`/home/profile/${rootUser?._id}`)}
        >
            <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
        </Button>
        <div className="flex md:hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="p-4 rounded-lg border-muted-foreground border-2 relative top-3 left-2 cursor-pointer"
                    >
                        <AlignJustify className="h-5 w-5 text-muted-foreground"/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="space-y-3 relative top-5 left-5 z-10 p-4">
                    {links.map((link, idx) => (
                      <NavLink key={idx} to={link.slug} className={({isActive}) => `w-auto md:w-[15%] flex justify-center text-zinc-800 dark:text-gray-300 font-bold text-md ${isActive ? "border-b-4 border-b-blue-400 text-black dark:text-white" : ""}`}>
                        {link.name}
                      </NavLink>
                    ))}
                    <Button
                    variant="ghost"
                    className="text-zinc-800 dark:text-gray-300 font-bold text-md -mt-2 text-center"
                    onClick={() => navigate(`/home/profile/${rootUser?._id}`)}
                    >Go Back <span><ArrowLeft className="h-5 w-5 text-muted-foreground" /></span></Button>
                </DialogContent>
            </Dialog>
        </div>
        <div className="hidden md:flex justify-between items-center mt-6 border-b-1 border-black dark:border-white relative px-1">
            {links.map((link, idx) => (
              <NavLink key={idx} to={link.slug} className={({isActive}) => `w-auto md:w-[15%] flex justify-center text-zinc-800 dark:text-gray-300 font-bold text-md ${isActive ? "border-b-4 border-b-blue-400 text-black dark:text-white" : ""}`}>
                {link.name}
              </NavLink>
            ))}
        </div>

        <Outlet />
    </div>
  )
}

export default Update