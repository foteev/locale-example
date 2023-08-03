import React, { useState, useCallback, useMemo, useContext, createContext } from "react";
import { Language } from "../types";
import { TRANSLATIONS, TranslationKey } from "./translations";

// the context interface
// todo: hint: use this interface to represent the context and remove 'eslint-disable' on the next line
export interface LanguageState {
    currentLanguage: Language;
    toggleLanguage: () => void;
    getTranslatedValue: (key: string) => string;
}

interface LanguageProviderProps {
    children: React.ReactNode;
}

/*
 * todo: replace mock provider with real one
 * hint: TranslateText is used as component and main consumer of translation context
 * hint: LanguageSwitchButton is a component that uses the context to change the language
 */

export const LanguageContext = createContext<LanguageState | null>(null);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

    const toggleLanguage = useCallback(() => {
        currentLanguage === "en" ? setCurrentLanguage("es") : setCurrentLanguage("en");
    }, [currentLanguage]);

    const getTranslatedValue = useCallback(
        (key: TranslationKey) => TRANSLATIONS[currentLanguage][key], [currentLanguage]);

    const contextValue = useMemo(() => ({ currentLanguage, toggleLanguage, getTranslatedValue }),
        [currentLanguage, toggleLanguage, getTranslatedValue]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslationContex = (): LanguageState => {
    const languageState = useContext(LanguageContext);
    if (!languageState) {
        throw new Error("No language state!");
    }

    return languageState;
};
