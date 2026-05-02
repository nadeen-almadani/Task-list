
"use client";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import {useContext,useState,useEffect} from 'react';
import { Taskscontext } from '../contexts/taskcontext'; 
import { Toastcontext } from '../contexts/taostcontext';


 type Task ={
    id:string;
    title:string;
    details:string;
    completed:boolean;
    file:{
        data:string;
        name:string;
        type:string;
        
    } | null;
}


type subtask={
  title:string;
  completed:boolean;
}

type Taskprops={
  task:Task;
 onfilechange:(file:File,taskId:string) =>void;
 opendelete:(task:Task)=>void;
 openupdate:(task:Task)=>void;

}

export default function Task({task,opendelete,openupdate,onfilechange}:Taskprops){
  const context1=useContext(Taskscontext);
  if(!context1){
    throw new Error("Taskscontext must be used within provider");
  }
  const {tasklist,settasklist}=context1;
  const[subtasks,setsubtasks]=useState<subtask[]>([
    {title:"subtask 1",completed:false},
    {title:"subtask 2",completed:false}
  ]);
  const [newsubtask,setnewsubtask]=useState<string>("");
  const context=useContext(Toastcontext);
  if(!context){
    throw new Error("Toastcontext must be used within provider");
  }
  const {showhidetoast}=context;

   const handlechange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files)return ;
    const file=e.target.files[0];
    onfilechange(file,task.id);
   };
  
// show dialog for delete task
  function handleshowdialog(){
    opendelete(task)
  }

  
// subtask
  function togglesubtask(subindex:number){
   
    const updated=[...subtasks]
    updated[subindex].completed=!updated[subindex].completed
    setsubtasks(updated)
   
  }

  // add newsubtask
  function addsubtask(){
    if(newsubtask==="") return
    const updated=[...subtasks];
    updated.push({
      title:newsubtask,
      completed:false
    })
    setsubtasks(updated)
    setnewsubtask("")
  }

   function handlecheck(){
    if(task.completed){
     const updatedlist=tasklist.map((t:Task)=>{
      if(task.id===t.id){return {...t,completed:false}}
      return t;
     });
     settasklist(updatedlist);
     localStorage.setItem("tasks",JSON.stringify(updatedlist));
     showhidetoast("Task unchecked");
     return;
    }
    const alldone=subtasks.every(sub => sub.completed);
    if(!alldone){
      showhidetoast("completed all subtasks first");
      return;
    }
    const updatedlist=tasklist.map((t:Task)=>{
         if(task.id===t.id){
           return {...t,completed:true}
         }
         return t;
        }
        
      )
        
        settasklist(updatedlist)
        localStorage.setItem("tasks",JSON.stringify(updatedlist))
        showhidetoast("Task has been checked")
     
  }
  
   // show dialog for update task
  function handleshowupdatedialog(){
    openupdate(task);
  }

  
  
  return(
    
    
    <div>
     

    

  <Box   className="taskbox">

 <Grid container spacing={1}>
        <Grid size={8} padding="10px">
         <Typography variant="h5" style={{color:"#616161",textAlign:"left",textDecoration:task.completed ?"line-through" :"none"}} >
             {task.title}
           </Typography>

            <Typography variant="h6" style={{color:"#616161",textAlign:"left"}}>
             {task.details}
           </Typography>
        </Grid>

        <Grid size={4} display="flex" justifyContent="flex-end"  gap="6px" >
         <IconButton className="iconbutton" onClick={handlecheck}>
            <CheckIcon style={{border:"solid #757575",background:task.completed?"#ef9a9a" :"gray"
              ,color:"white"}} />
         </IconButton>
          <IconButton className="iconbutton" onClick={handleshowdialog}>
            <DeleteIcon style={{border:"solid #757575",background:"gray",color:"white" }}/>
         </IconButton>
          <IconButton className="iconbutton" onClick={handleshowupdatedialog}>
            < EditIcon style={{border:"solid #757575",background:"gray",color:"white"}} />
         </IconButton>
        </Grid>

       <Grid size={12} style={{direction:"ltr"}}>
        {subtasks.map((sub,index)=>(
          <div key={index}>
            <input type='checkbox' onChange={()=>togglesubtask(index)}/>
              &nbsp;{sub.title}

          </div>
        ))}
        <input type='text'
        placeholder='add subtask'
        value={newsubtask}
        onChange={(e)=>setnewsubtask(e.target.value)}/>

        <button onClick={addsubtask}>add subtask</button>
       </Grid>



      <br/> <br/>
      {/*input file */}
        <Grid size={4}>
          <input type='file' onChange={handlechange} />
          {task.file && (
            <div>
              <span>{task.file.name}</span>{"    "}
               <a href={task.file.data} download={task.file.name} target="_blank" rel='noreferrer'>&nbsp;open file</a>
            </div>
           
          )}
        </Grid>
        
      </Grid>
          

    
    </Box>
    </div>
  );
}