import React, { useEffect, useState } from "react";
import "./App.css";
import { LoadingOverlay } from "./loading-overlay/LoadingOverlay";
import { LanguageSwitchButton } from "./lang/LanguageSwitchButton";
import { SoundsContainer } from "./sound/SoundsContainer";
import { NoteAddForm } from "./form/NoteAddForm";
import { List } from "./list/List";
import { Note } from "./types";
import { useRequest, isResponseError } from "./network/useRequest";
import { NetworkHandler } from "./network/NetworkHandler";
import { LanguageProvider } from "./lang/LanguageContext";

// todo: get data on initial render
export const App: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const { makeRequest, response, isLoading } = useRequest(() => NetworkHandler.getNotes());

    useEffect(() => {
        makeRequest();
    }, []);

    useEffect(() => {
        if (response && !isResponseError(response)) {
            setNotes(response);
        }
    }, [response]);

    return (
        <LanguageProvider>
            <div className="container root-container">
                <div className="row header">
                    <h2>Bob&apos;s admin</h2>
                    <LanguageSwitchButton />
                </div>

                <div className="row content">
                    <div className="column column-60 left-column">
                        <List notes={notes} setNotes={setNotes} />
                    </div>
                    <div className="column column-40 right-column">
                        <NoteAddForm setNotes={setNotes} />
                    </div>
                </div>
                <LoadingOverlay isVisible={isLoading} />
                <SoundsContainer />
            </div>
        </LanguageProvider>
    );
};
