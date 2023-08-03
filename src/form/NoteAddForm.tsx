/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { GradesInput, useGrades } from "./GradesInput";
import { TranslateText } from "../lang/TranslateText";
import type { Note } from "../types";
import { useRequest, isResponseError } from "../network/useRequest";
import { NetworkHandler } from "../network/NetworkHandler";
import { LoadingOverlay } from "../loading-overlay/LoadingOverlay";
import { POSITIVE_SOUND_ID, NEGATIVE_SOUND_ID } from "../sound/SoundsContainer";
import "./NoteAddForm.css";

// todo: implement Note add form
//  - The only validation you should apply for it is check for all non-empty inputs (except the optional `Notes about dish/city`)
//  - Disable save button while request is pending

type NoteAddFormProps = {
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const NoteAddForm: React.FC<NoteAddFormProps> = ({ setNotes }) => {
    const [note, setNote] = useState<Note>({ id: "", city: "", date: "", favouriteDish: { name: "" }, grades: [] });
    const { grades, addGrade, deleteGrade } = useGrades();
    const { makeRequest, response, isLoading } = useRequest(() => NetworkHandler.addNote(note));
    const [hasError, setHasError] = useState(true);
    const positiveSound = document.getElementById(POSITIVE_SOUND_ID) as HTMLAudioElement;
    const negativeSound = document.getElementById(NEGATIVE_SOUND_ID) as HTMLAudioElement;
    const cityField = document.getElementById("city-name") as HTMLInputElement;
    const dateField = document.getElementById("visit-date") as HTMLInputElement;
    const nameField = document.getElementById("favourite-dish") as HTMLInputElement;
    const dishNoteField = document.getElementById("note-field") as HTMLInputElement;
    const gradeField = document.getElementById("grade-field") as HTMLInputElement;

    const checkForm = () => {
        if (cityField && dateField && nameField) {
            if (cityField.value === "" || dateField.value === "" || nameField.value === ""
            || grades.length === 0) {
                setHasError(true);
            } else {
                setHasError(false);
            }
        } else {
            setHasError(true);
        }
    };

    const handleCityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const cityInput = e.target.value;
        setNote({ ...note, city: cityInput });
    }, [note]);
    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNote({ ...note, date: e.target.value.split("-").reverse().join("/") });
    }, [note]);
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const nameInput = e.target.value;
        setNote({
            ...note,
            favouriteDish: {
                ...note.favouriteDish,
                name: nameInput,
            },
        });
    }, [note]);
    const handleDishNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nameInput = e.target.value;
        setNote({
            ...note,
            favouriteDish: {
                ...note.favouriteDish,
                note: nameInput,
            },
        });
    }, [note]);

    const saveNote = useCallback(() => {
        if (note.city.length > 0
            && note.date.length > 0
            && note.favouriteDish.name.length > 0
            && note.grades.length > 0) {
            setHasError(false);
            makeRequest();
            setHasError(true);
        } else {
            setHasError(false);
        }
        console.log(note);
    }, [note]);

    useEffect(() => {
        setNote({ ...note, grades: grades });
    }, [grades]);

    useEffect(() => {
        if (response && !isResponseError(response)) {
            positiveSound.play();
            setNotes(response);
            const inputs = document.querySelectorAll("input");
            inputs.forEach((input) => { input.value = ""; });
            dishNoteField.value = "";

            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i <= grades.length; i++) {
                grades.pop();
            }
            setNote({ id: "", city: "", date: "", favouriteDish: { name: "" }, grades: [] });
            setHasError(true);
        } else if (isResponseError(response)) {
            negativeSound.play();
        }
    }, [response]);

    useEffect(() => {
        checkForm();
    }, [note]);

    return (
        <div data-test="note-add-form">
            <h3 data-test="form-header">
                <TranslateText translationKey="form.header.add" />
            </h3>
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.city" />
            </label>
            <input
                data-test="form-city"
                type="text"
                placeholder="Kyiv"
                id="city-name"
                onChange={handleCityChange}
            />
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.favouriteDish" />
            </label>
            <input
                data-test="form-dish"
                type="text"
                placeholder="Chicken Kyiv"
                id="favourite-dish"
                onChange={handleNameChange}
            />
            <label htmlFor="note-field">
                <TranslateText translationKey="form.label.notes" />
            </label>
            <textarea
                data-test="form-dish-note"
                style={{ resize: "vertical" }}
                placeholder="Dear Slim, I wrote you but you still ain't callin'"
                id="note-field"
                onChange={handleDishNoteChange}
            />
            <label htmlFor="grades-field">
                <TranslateText translationKey="form.label.grades" />
            </label>
            <GradesInput grades={grades} addGrade={addGrade} deleteGrade={deleteGrade} />
            <label htmlFor="visit-date">
                <TranslateText translationKey="form.label.date" />
            </label>
            {/* NOTE! date has to be *saved* in format `DD/MM/YYYY` */}
            <input
                data-test="form-date"
                type="date"
                id="visit-date"
                onChange={handleDateChange}
            />
            <div className="submit-button-container">
                {isResponseError(response) ? (
                    <div className="form-error" data-test="form-error">
                        <TranslateText translationKey="form.error" />
                    </div>
                ) : null}
                <button
                    data-test="form-save-button"
                    className="button-primary disabled"
                    type="submit"
                    value="Save note"
                    disabled={hasError}
                    onClick={saveNote}
                >
                    <TranslateText translationKey="form.button.save" />
                </button>
            </div>
            <LoadingOverlay isVisible={isLoading} />
        </div>
    );
};
