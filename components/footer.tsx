import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-secondary/50 p-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-bold text-primary">PyQuest</h3>
          <p className="text-sm">Learn Python through adventure</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2 text-sm">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5" />
          </Link>
          <p className="text-xs">© {new Date().getFullYear()} PyQuest</p>
        </div>
      </div>
    </footer>
  )
}
