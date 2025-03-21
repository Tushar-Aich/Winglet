import { useEffect, useState } from "react"
import { Link, NavLink } from 'react-router-dom'
import ThemeToggler from "./Theme-Toggler"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState<Boolean>(false)
    const [isMenuOpened, setIsMenuOpened] = useState<Boolean>(false)

    useEffect(() => {
        const HandleScroll = () => {
            if(window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', HandleScroll)

        return () => {
            window.removeEventListener('scroll', HandleScroll)
        }
    })

    const navItems = [
        { name: "Home", slug: "/"},
        { name: "Features", slug: "/features"},
        { name: "Testimonials", slug: "/testimonials"},
        { name: "FAQ", slug: "/faq"}
    ]

  return (
    <>
    <header className={`w-full z-50 fixed top-0 left-0 ${isScrolled ? "blur-sm shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
                <Link to="/">
                    <img src="./Transparent-logo.jpg" alt="Winglet Logo" className="h-9 w-9 md:h-10 md:w-10 rounded-full" />
                </Link>
                <Link to="/" className="font-serif text-xl md:text-2xl font-semibold text-[#2C2F33] dark:text-[#F7F9FC]">Winglet</Link>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
                {navItems.map((item, idx) => (
                    <NavLink
                    key={idx}
                    to={item.slug}
                    className={({isActive}) =>
                      `text-sm font-medium transition-colors ${isActive ? "dark:text-[#FFB199] text-gray-500" : ""} `
                    }
                    >
                      {item.name}
                    </NavLink>
                ))}
                <ThemeToggler />
                <Button
                    variant="outline"
                    className="bg-[#17C3B2] text-[#2C2F33] hover:bg-[#1DA1F2] border-[#D1D3D8] dark:bg-[#1DA1F2] dark:text-[#F7F9FC] dark:hover:bg-[#8A3FFC] dark:border-[#D1D3D8]"
                >
                    Log in
                </Button>
                <Button
                    variant="outline"
                    className="bg-[#FF6B6B] text-[#F7F9FC] hover:bg-[#FFB199] shadow-sm dark:bg-[#FF6B6B] dark:text-[#F7F9FC] dark:hover:bg-[#FFB199]"
                >
                    Sign up
                </Button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
                <ThemeToggler />
                <button
                    className="focus:outline-none bg-transparent hover:bg-transparent cursor-pointer"
                    onClick={() => setIsMenuOpened(!isMenuOpened)}
                >
                    {isMenuOpened ? (
                        <X className="h-6 w-6 text-black dark:text-gray-300" />
                    ) : (
                        <Menu className="h-6 w-6 text-black dark:text-gray-300" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpened && (
                <div className="md:hidden absolute top-full left-0 right-0 glass-morphism p-4 shadow-subtle animate-fade-in">
                    <nav className="flex flex-col space-y-4 py-2">
                        {navItems.map((item, idx) => (
                            <NavLink
                            key={idx}
                            to={item.slug}
                            className={({isActive}) =>
                              `text-sm font-medium px-3 py-2 transition-colors ${isActive ? "dark:text-[#FFB199] text-gray-500" : ""} `
                            }
                            onClick={() => setIsMenuOpened(false)}
                            >
                              {item.name}
                            </NavLink>
                        ))}
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 pt-2 border-t border-(--winglet-pink)/10">
                            <Button
                                variant="outline"
                                className="bg-[#17C3B2] text-[#2C2F33] hover:bg-[#1DA1F2] border-[#D1D3D8] dark:bg-[#1DA1F2] dark:text-[#F7F9FC] dark:hover:bg-[#8A3FFC] dark:border-[#D1D3D8] w-full sm:w-[50%]"
                            >
                                Log in
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-[#FF6B6B] text-[#F7F9FC] hover:bg-[#FFB199] shadow-sm dark:bg-[#FF6B6B] dark:text-[#F7F9FC] dark:hover:bg-[#FFB199] w-full sm:w-[50%]"
                            >
                                Sign up
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    </header>
    </>
  )
}

export default NavBar