import { Github, Instagram, Linkedin, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {

  const productLinks = [
    { name: "features", slug: "#" },
    { name: "pricing", slug: "#" },
    { name: "api", slug: "#" },
    { name: "integrations", slug: "#" },
    { name: "documentation", slug: "#" },
  ]
  const companyLinks = [
    { name: "about", slug: "#" },
    { name: "blogs", slug: "#" },
    { name: "carrers", slug: "#" },
    { name: "press", slug: "#" },
    { name: "contact", slug: "#" },
  ]
  const legalLinks = [
    { name: "terms", slug: "#" },
    { name: "privacy", slug: "#" },
    { name: "cookies", slug: "#" },
    { name: "licences", slug: "#" },
    { name: "settings", slug: "#" },
  ]

  return (
    <footer id="about" className="bg-winglet-light-gray dark:bg-[#1A0E15]/20 pt-16 pb-8">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="lg:cols-span-1">
            {/* Icon and name */}
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="./Transparent-logo.jpg" alt="Logo" className="h-8 w-8 rounded-full" />
              <span className="font-serif text-xl font-semibold">Winglet</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              open your wings, connect with world. A modern social media latformfocused on authentic connections.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://github.com/Tushar-Aich" className="text-muted-foreground hover:text-[#1A0E15] hover:dark:text-white transition-colors">
                <Github className="h-6 w-6"/>
              </a>
              <a href="https://x.com/Tushar22848" className="text-muted-foreground hover:text-[#1A0E15] hover:dark:text-white transition-colors">
                <Twitter className="h-6 w-6"/>
              </a>
              <a href="https://linkedin.com/in/tushar-aich-30a27a35" className="text-muted-foreground hover:text-[#1A0E15] hover:dark:text-white transition-colors">
                <Linkedin className="h-6 w-6"/>
              </a>
              <a href="https://instagram.com/orewa_tushar07" className="text-muted-foreground hover:text-[#1A0E15] hover:dark:text-white transition-colors">
                <Instagram className="h-6 w-6"/>
              </a>
            </div>
          </div>
          {/* Product */}
          <div>
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              {productLinks.map((item, idx) => (
                <li key={idx}> 
                  <Link to={item.slug} className="hover:text-black hover:dark:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              {companyLinks.map((item, idx) => (
                <li key={idx}> 
                  <Link to={item.slug} className="hover:text-black hover:dark:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              {legalLinks.map((item, idx) => (
                <li key={idx}> 
                  <Link to={item.slug} className="hover:text-black hover:dark:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-winglet-pink/10 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Winglet. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="#" className="hover:text-black hover:dark:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-black hover:dark:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-black hover:dark:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer