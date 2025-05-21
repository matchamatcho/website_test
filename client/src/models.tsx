// src/types/todo.ts
export type IUser = {
    id: string;
    photoURL: string | null | undefined;
};

export type ITodo = {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    checked: boolean;
    removed: boolean;
    author: IUser;
    comments: string[];
};
