"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("ar");

  useEffect(() => {
    const savedLang = Cookies.get("NEXT_LOCALE") || "ar";
    setCurrentLang(savedLang);
    document.documentElement.lang = savedLang;
    document.documentElement.dir = languages.find(l => l.code === savedLang)?.dir || "rtl";
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const newLang = languages.find(l => l.code === langCode);
    if (!newLang) return;

    Cookies.set("NEXT_LOCALE", langCode, { path: "/" });
    document.documentElement.lang = langCode;
    document.documentElement.dir = newLang.dir;
    setCurrentLang(langCode);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">تغيير اللغة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLang === lang.code ? "bg-primary/10" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}