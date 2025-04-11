"use client"
import { useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { Globe } from "lucide-react";

const COOKIE_NAME = "googtrans";

interface LanguageDescriptor {
  name: string;
  title: string;
}

declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[];
      defaultLanguage: string;
    };
  }
}

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [languageConfig, setLanguageConfig] = useState<any>();
  const [onOpen, setOnOpen] = useState<boolean>(false)

  useEffect(() => {
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];
  
    console.log("Existing Cookie Value:", existingLanguageCookieValue);
  
    let languageValue;
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
  
    console.log("Extracted Language Value:", languageValue);
  
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
  
    console.log("Final Language Value:", languageValue);
  
    if (languageValue) {
      setCurrentLanguage(languageValue);
    }
  
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, [currentLanguage]);
  

  if (!currentLanguage || !languageConfig) {
    return null;
  }

  const switchLanguage = (lang: string) => {

    destroyCookie(null, COOKIE_NAME);

    setCookie(null, COOKIE_NAME, "/auto/" + lang,{
      domain: ".cloudworkstations.dev",
      path: "/",
    })
    setCurrentLanguage(lang);
    window.location.reload();
  };

  const handleChange = (lang: string) => () => {
    switchLanguage(lang)
  }

  return (
    <div className="text-center text-white bg-white notranslate relative w-40 p-4 z-10" onMouseOver={() => setOnOpen(true)} onMouseOut={() => setOnOpen(false)}>
      <div className="absolute top-0 flex flex-col bg-slate-100 transition-all duration-200 shadow-sm p-2 min-w-40 cursor-pointer rounded-lg text-slate-800 ">
        {languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
          <div key={i}>
            {currentLanguage === ld.name ||
              (currentLanguage === "auto" &&
                languageConfig.defaultLanguage === ld) ? (
              <span key={`l_s_${ld}`} className="flex items-center backdrop-blur-md mx-3 text-gray-800  font-lightly" >
                <Globe className="w-4 mr-2" />
                {ld.title}
              </span>
            ) : (

              <div
                key={`l_s_${ld}`}
                onClick={handleChange(ld.name)}
                className={`mx-3 transition-all duration-200 h-full backdrop-blur-md  text-gray-500 py-2 hover:text-gray-700  cursor-pointer
                    
                    `}
              >

                {ld.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };


