import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils";
import { Bell, Home, Mail, Search, Bird } from "lucide-react";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function App() {
  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <Search className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Filet",
      href: "/ai",
      icon: (
        <Bird className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Notification",
      href: "/notification",
      icon: (
        <Bell className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inbox",
      href: "/inbox",
      icon: (
        <Mail className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <>
    <div
      className={cn(
        "flex w-full flex-1 flex-row overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 absolute left-0 top-0 ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 mr-0.5">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? (
              <div className="flex gap-2 items-center">
                <img
                  src="./Transparent-logo.jpg"
                  alt=""
                  className="h-5 w-5 rounded-full"
                />
                <h1 className="font-bold text-lg">Winglet</h1>
              </div>
            ) : (
              <img
                src="./Transparent-logo.jpg"
                alt=""
                className="h-5 w-5 rounded-full"
              />
            )}
            <div className="mt-12 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: useSelector(
                  (state: RootState) => state.user.user?.userName as string
                )!,
                href: "/profile",
                icon: (
                  <img
                    src={
                      useSelector(
                        (state: RootState) => state.user.user?.avatar as string
                      )!
                    }
                    className="h-5 w-5 shrink-0 rounded-full"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Outlet />
    </div>
    </>
  )
}

export default App
