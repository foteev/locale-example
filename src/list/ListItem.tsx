import React from "react";
import { ItemActions } from "./ItemActions";
import { Note } from "../types";

type ListItemProps = {
    note: Note;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const ListItem: React.FC<ListItemProps> = ({ note, setNotes }) => {
    // todo: pass item id here

    const id = note.id;
    return (
        <tr data-test="list-item" data-id={id}>
            <td data-test="list-item-city">{note.city}</td>
            <td data-test="list-item-date">{note.date}</td>
            <td data-test="list-item-dish">{note.favouriteDish.name}</td>
            <td data-test="list-item-grades">{note.grades.join(", ")}</td>
            <td data-test="list-item-actions"><ItemActions id={id} setNotes={setNotes} /></td>
        </tr>
    );
};
