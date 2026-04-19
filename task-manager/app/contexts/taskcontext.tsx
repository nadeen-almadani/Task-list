
import { createContext } from "react";

type Task={
    id:string;
    title:string;
    details:string;
    completed:boolean;
    file:any;
};
type TasksContextType={
    tasklist:Task[];
    settasklist:React.Dispatch<React.SetStateAction<Task[]>>;
};

export const Taskscontext=createContext<TasksContextType |null>(null)