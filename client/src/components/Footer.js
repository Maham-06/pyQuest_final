/*
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="w-full bg-secondary/50 p-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-bold text-primary">PyQuest</h3>
          <p className="text-sm">Learn Python through adventure</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2 text-sm">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <Link to="/help" className="hover:underline">
            Help
          </Link>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <p className="text-xs">© {new Date().getFullYear()} PyQuest</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
*/
import { Link } from "react-router-dom"
import { Github } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl mr-2">👑</span>
              <span className="font-bold text-lg text-primary">PyQuest</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn Python through interactive adventures</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex gap-4">
              <Link to="/about" className="text-sm hover:text-primary">
                About
              </Link>
              <Link to="/privacy" className="text-sm hover:text-primary">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm hover:text-primary">
                Terms
              </Link>
            </div>

            <a
              href="https://github.com/yourusername/pyquest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm hover:text-primary"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} PyQuest. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
