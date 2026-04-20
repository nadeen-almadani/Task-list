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

  const initiallist:Task[]=[
    {
      id:uuidv4(),
      title:"task1",
      details:"details of task1",
      completed:false,
      file:null
    },
    {
      id:uuidv4(),
      title:"task2",
      details:"details of task2",
      completed:false,
      file:null
    },
    {
      id:uuidv4(),
      title:"task3",
      details:"details of task3",
      completed:false,
      file:null
    }
  ];
export default function Home() {
 const [open, setOpen] =useState(false);
const [message,setmessage]=useState("");


const [tasklist, settasklist] = useState<Task[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  if(typeof window === "undefined") return;
  const data = localStorage.getItem("tasks");

  if (data && JSON.parse(data).length > 0) {
    settasklist(JSON.parse(data));
  } else {
    settasklist(initiallist);
    localStorage.setItem("tasks", JSON.stringify(initiallist));
  }

  setIsLoaded(true);
}, []);

 function showhidetoast(message:string){

  setOpen(true);
  setmessage(message)
  setTimeout(()=>{
    setOpen(false)
  },2000)
 }
 
 if(!isLoaded) return null;

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
