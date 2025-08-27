"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "../../shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shared/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "light" && (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          )}
          {theme === "dark" && (
            <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          )}
          {theme === "system" && (
            <Monitor className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          )}
          {!theme && (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
