import React from "react";
import { ListItem } from "./ListItem";
import { Note } from "../types";
import "./List.css";
import { TranslateText } from "../lang/TranslateText";

type ListProps = {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const List: React.FC<ListProps> = ({ notes, setNotes }) => {
    return (
        <table className="list">
            <thead>
                <tr>
                    <th><TranslateText translationKey="tableHeader.city" /></th>
                    <th><TranslateText translationKey="tableHeader.date" /></th>
                    <th><TranslateText translationKey="tableHeader.dish" /></th>
                    <th><TranslateText translationKey="tableHeader.grades" /></th>
                    <th style={{ width: "15rem" }}><TranslateText translationKey="tableHeader.actions" /></th>
                </tr>
            </thead>
            <tbody>
                {notes ? notes.map(note => <ListItem key={Math.random()} note={note} setNotes={setNotes} />) : null}
            </tbody>
        </table>
    );
};
