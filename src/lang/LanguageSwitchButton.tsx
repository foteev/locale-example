import React from "react";
import { Language } from "../types";
import { useTranslationContex } from "./LanguageContext";

import "./LanguageSwitch.css";

const langToFlagMap: Record<Language, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
};

// todo: toggles language on click
// no need of any fancy UX. Just toggle on click :)
export const LanguageSwitchButton: React.FC = () => {
    const { currentLanguage, toggleLanguage } = useTranslationContex();
    // const lang = "en";

    return (
        <div
            data-test="land-switch-button"
            data-lang={currentLanguage}
            className="lang-switch"
            onClick={toggleLanguage}
        >{langToFlagMap[currentLanguage]}
        </div>
    );
};
