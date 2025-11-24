"use client"

// --- UI Primitives ---
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/app/components/tiptap/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/app/components/tiptap/tiptap-icons/sun-icon"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  // localStorage에서 저장된 테마 설정 불러오기, 없으면 라이트 모드(기본값)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved === "dark") return true
      if (saved === "light") return false
      // 저장된 값이 없으면 라이트 모드(기본값)
      return false
    }
    return false
  })

  useEffect(() => {
    // 초기 로드 시 localStorage에서 테마 설정 적용
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
      // 기본값을 라이트 모드로 설정
      if (!saved) {
        localStorage.setItem("theme", "light")
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
    // 테마 변경 시 localStorage에 저장
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode((isDark) => !isDark)

  return (
    <Button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      data-style="ghost"
    >
      {isDarkMode ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
