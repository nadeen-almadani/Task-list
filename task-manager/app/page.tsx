"use client";
import { Taskscontext } from "./contexts/taskcontext";
import Tasklist from "./components/Tasklist";
import { v4 as uuidv4 } from 'uuid';
import { useState,useEffect } from 'react';
import Mysnackbar from "./components/mysnackbar";
import { Toastcontext } from "./contexts/taostcontext";

type Task = {
  id: string;
  title: string;
  details: string;
  completed: boolean;
  file: {
    data: string;
    name: string;
    type: string;
  } | null;
};

  
export default function Home() {
  const [tasklist, settasklist] = useState<Task[]>([]);
 const [open, setOpen] =useState(false);
const [message,setmessage]=useState("");





useEffect(() => {
  if (typeof window === "undefined") return;

  const data = localStorage.getItem("tasks");

  if (data && data !== "undefined") {
    settasklist(JSON.parse(data));
  } else {
    const initiallist = [
      {
        id: uuidv4(),
        title: "task1",
        details: "details of task1",
        completed: false,
        file: null,
      },
      {
        id: uuidv4(),
        title: "task2",
        details: "details of task2",
        completed: false,
        file: null,
      },
    ];

    settasklist(initiallist);
    localStorage.setItem("tasks", JSON.stringify(initiallist));
  }
}, []);


 function showhidetoast(message:string){

  setOpen(true);
  setmessage(message)
  setTimeout(()=>{
    setOpen(false)
  },2000)
 }
 

  return (
    

    <Toastcontext.Provider value={{showhidetoast}}>
       <div>
        <Mysnackbar  open={open} message={message}/>
       <Taskscontext.Provider value={{tasklist,settasklist}}>
         <Tasklist/>
       </Taskscontext.Provider>
      </div>
    </Toastcontext.Provider>
     
    
    
  );
}
