import React, { useState, useCallback } from "react";
import { Grade } from "./Grade";
import { POSITIVE_SOUND_ID, NEGATIVE_SOUND_ID } from "../sound/SoundsContainer";

import "./GradesInput.css";
import { TranslateText } from "../lang/TranslateText";

export const useGrades: () => { grades: number[]; addGrade: (index: number) => void; deleteGrade: (index: number) => void; } = () => {
    const [grades, setGrades] = useState<number[]>([]);

    const addGrade = (grade: number) => {
        setGrades([...grades, grade]);
    };
    const deleteGrade = (index: number) => {
        const newGrades = [...grades.slice(0, index), ...grades.slice(index + 1)];
        setGrades(newGrades);
    };

    return { grades, addGrade, deleteGrade };
};

type GradesInputProps = {
    grades: number[];
    addGrade: (grade: number) => void;
    deleteGrade: (index: number) => void;
};

// todo: implement the logic of adding new grades and removal on click
// validate so the value entered is >0.1 and <10. Numbers have to contain max two digits after coma
// Just disable button if grade is invalid
export const GradesInput: React.FC<GradesInputProps> = ({ grades, addGrade, deleteGrade }) => {
    const [disabled, setDisabled] = useState(false);
    const [gradeValue, setGradeValue] = useState<string>("");
    const positiveSound: HTMLAudioElement = document.getElementById(POSITIVE_SOUND_ID) as HTMLAudioElement;
    const negativeSound: HTMLAudioElement = document.getElementById(NEGATIVE_SOUND_ID) as HTMLAudioElement;

    const gradeInputCheck = useCallback((): void => {
        const input = document.getElementById("grades-field") as HTMLInputElement;
        if (Number(input.value) > 10) {
            setDisabled(true);
            return;
        }
        if (Number(input.value) < 0.1) {
            setDisabled(true);
            return;
        }
        if (input.value.includes(".")) {
            if (input.value.split(".")[1].length > 2) {
                setDisabled(true);
                return;
            }
        }
        setDisabled(false);
        setGradeValue(input.value);
    }, []);

    const onGradeRemove = useCallback((index: number): void => {
        deleteGrade(index);
        negativeSound.play();
        console.log(">>>", "Remove grade on index", index);
    }, [deleteGrade, grades]);

    const onGradeAdd = useCallback(() => {
        const gradeInput = document.getElementById("grades-field") as HTMLInputElement;
        if (!grades.includes(Number(gradeValue))) {
            addGrade(Number(gradeValue));
            gradeInput.value = "";
            positiveSound.play();
        } else {
            console.log("there is already a grade");
        }
    }, [gradeValue]);

    return (
        <div>
            <div className="grades-input-container">
                <input
                    id="grades-field"
                    data-test="add-grade-input"
                    className="grades-input"
                    type="number"
                    min={0.1}
                    max={10}
                    placeholder="10"
                    onChange={gradeInputCheck}
                />
                <button data-test="add-grade-button" onClick={onGradeAdd} disabled={disabled}>
                    <TranslateText translationKey="form.button.addGrade" />
                </button>
            </div>
            <div className="grades-list">
                {grades.map((grade, index) =>
                    <Grade key={Math.random()} value={grade} index={index} onRemove={onGradeRemove} />,
                )}
            </div>
        </div>
    );
};
