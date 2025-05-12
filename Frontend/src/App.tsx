import { Link, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, Home, Mail, Search, Bird, User2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Container from "./components/Container";
import Logo from "./Assets/Transparent-logo.jpg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import Theme from "./components/Theme";
import { IconDoorExit } from "@tabler/icons-react";
import NotificationBell from "./components/NotificationBell";
import { requestPermission } from "./lib/requestPermission";

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  
  useEffect(() => {
    // Request notification permission when the app is loaded
    if (user?._id) {
      requestPermission().catch(err => 
        console.error("Error requesting notification permission:", err)
      );
    }
  }, [user]);

  const links = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Search",
      href: "/home/search",
      icon: (
        <Search className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Filet",
      href: "/home/filet",
      icon: (
        <Bird className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Notification",
      href: "/home/notification",
      icon: (
        <Bell className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inbox",
      href: "/home/inbox",
      icon: (
        <Mail className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  
  const Mobilelinks = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Search",
      href: "/home/search",
      icon: (
        <Search className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Notification",
      href: "/home/notification",
      icon: (
        <Bell className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inbox",
      href: "/home/inbox",
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
          "w-full flex-1 flex-row overflow-hidden border border-neutral-200 hidden md:flex bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 absolute left-0 top-0 ",
          "h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 mr-0.5">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto ml-2">
              {open ? (
                <div className="flex gap-2 items-center">
                  <img src={Logo} alt="" className="h-5 w-5 rounded-full" />
                  <h1 className="font-bold text-lg">Winglet</h1>
                </div>
              ) : (
                <img src={Logo} alt="" className="h-5 w-5 rounded-full" />
              )}
              <div className="mt-12 flex flex-col gap-2">
                {links.slice(0, 3).map((link, idx) => (
                  <SidebarLink key={idx} link={link} name={link.label}/>
                ))}
                <div className="flex gap-2 items-center cursor-pointer">
                  <div className="scale-125 cursor-pointer">
                    <NotificationBell />
                  </div>
                  {open && <span className="text-neutral-700 dark:text-neutral-200 text-sm cursor-pointer hover:translate-x-1 duration-200 -ml-0.5">Notifications</span>}
                </div>
                <div className="ml-0.5 -mt-1">
                  {links.slice(4).map((link, idx) => (
                    <SidebarLink key={idx + 3} link={link} name={link.label}/>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-2 mb-3">
              <Theme />
              <SidebarLink
                link={{
                  label: useSelector(
                    (state: RootState) => state.user.user?.userName as string
                  )!,
                  href: `/home/profile/${user?._id}`,
                  icon: (
                    <User2Icon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
                name="profile"
              />
              {open ? (
                <div className="flex gap-2 items-center">
                  <IconDoorExit stroke={2} className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer" />
                  <p className="text-sm">Logout</p>
                </div>
              ) : (
                <IconDoorExit stroke={2} className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer" />
              )}
            </div>
          </SidebarBody>
        </Sidebar>
        <Container>
          <Outlet />
        </Container>
      </div>
      <div className="flex flex-row md:hidden h-screen w-full z-20">
        <div className="absolute bottom-2 left-[50%] -translate-x-[50%]">
          <NavigationMenu className="bg-transparent inline-block z-20 px-0 sm:px-3 rounded-full border-1 border-black dark:border-gray-300 backdrop-blur-sm">
            <NavigationMenuList> 
              {Mobilelinks.slice(0, 2).map((link, idx) => (
                <NavigationMenuItem key={idx}>
                  <Link to={link.href} aria-label={`go to ${link.label} page`}>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent`}
                    >
                      {link.icon}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent p-2`}
                >
                  <div className="scale-125">
                    <NotificationBell />
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {Mobilelinks.slice(3).map((link, idx) => (
                <NavigationMenuItem key={idx + 3}>
                  <Link to={link.href} aria-label={`go to ${link.label} page`}>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent`}
                    >
                      {link.icon}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Link to={`/home/profile/${user?._id}`} aria-label="go to profile page">
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()}  bg-transparent overflow-hidden hover:bg-transparent`}>
                    <User2Icon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent overflow-hidden hover:bg-transparent`}>
                  <IconDoorExit stroke={2} className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer" />
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent overflow-hidden hover:bg-transparent`}>
                  <Theme />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Container>
          <Outlet />
        </Container>
      </div>
    </>
  );
}

export default App;
