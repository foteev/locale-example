import React from "react";
import { TranslationKey } from "./translations";
import { useTranslationContex } from "./LanguageContext";

interface TranslateTextProps {
    translationKey: TranslationKey;
}

// todo: use LanguageContext to get translated value
export const TranslateText: React.FC<TranslateTextProps> = ({ translationKey }) => {
    const { getTranslatedValue } = useTranslationContex();

    const translated = getTranslatedValue(translationKey);

    return (
        <span data-test="translated-text" data-test-key={translationKey}>{translated}</span>
    );
};
