"use client"

import Link from "next/link"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Settings, LogOut } from "lucide-react"

export function Navbar() {
  const [progress, setProgress] = useState(45) // Example progress value

  return (
    <nav className="w-full p-4 flex items-center justify-between bg-secondary/50 backdrop-blur-sm">
      <div className="flex items-center">
        <Link href="/">
          <div className="text-primary font-bold text-2xl flex items-center">
            <span className="mr-2">👑</span> PyQuest
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">XP</span>
          <Progress value={progress} className="w-24 h-2" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:brightness-110 transition-all">
              <span className="sr-only">User profile</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Profile & Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="h-4 w-4">📊</span>
                <span>Progress Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/logout" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
