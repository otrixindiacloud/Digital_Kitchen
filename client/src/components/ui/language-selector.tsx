import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePOS, Language } from "@/store/posStore";
import { t } from "@/lib/i18n";

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦"
  }
];

interface LanguageSelectorProps {
  variant?: "default" | "compact";
  className?: string;
}

export function LanguageSelector({ variant = "default", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = usePOS();

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Store preference in localStorage for persistence
    localStorage.setItem('preferred-language', newLanguage);
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 px-0 ${className}`}
            title="Change Language"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-3 ${
                language === lang.code ? "bg-accent" : ""
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
              </div>
              {language === lang.code && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === lang.code ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{lang.name}</span>
              <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
            </div>
            {language === lang.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
