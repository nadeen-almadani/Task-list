"use client";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Task from './task';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import { useState,useContext,useEffect,useMemo } from 'react';
import { Taskscontext } from '../contexts/taskcontext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Toastcontext} from '../contexts/taostcontext';

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


export default function Tasklist(){
 const context1=useContext(Taskscontext);
 if (!context1){
      throw new Error ("Taskcontext must be used within provider");
    }
    const {tasklist,settasklist}=context1;

  const [inputtitle,setinputtitle]=useState("");
  const [displayedtasktype,setdisplaytasktype]=useState("all");
   const [showdialog,setshowdialog]=useState(false);
   const [dialogtask,setdialogtask]=useState<Task | null>(null);
    const [showupdatedialog,setshowupdatedialog]=useState(false);

   
    const context=useContext(Toastcontext);
    if (!context){
      throw new Error ("Toastcontext must be used within ToastProvider");
    }
    const { showhidetoast }=context;
    const [isDarkmode,setisDarkmode]=useState(false);

    useEffect(()=>{
        const savedtheme=localStorage.getItem("theme");
        if(savedtheme==="dark") setisDarkmode(true)
    },[]);


    useEffect(()=>{
        localStorage.setItem("theme",isDarkmode ?"dark":"light");
    },[isDarkmode]);
   
  
   //handlefile

const handlefile = (file: File, taskId: string) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = () => {
    const updatedlist = tasklist.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          file: {
            data: reader.result as string,
            name: file.name,
            type: file.type,
          },
        };
      }
      return t;
    });

    settasklist(updatedlist);
    localStorage.setItem("tasks", JSON.stringify(updatedlist));
  };
};


//filteration

const completedlist=useMemo(()=>{
return tasklist.filter((t:Task)=>{
    console.log("completedlist")
    return t.completed;
  });
},[tasklist])
  

  const notcompletedlist=useMemo(()=>{
    return  tasklist.filter((t:Task)=>{
    console.log("notcompletedlist")
    return !t.completed;
  })
  },[tasklist])
  
  
  
  
  let listtoberendered=tasklist;

  if(displayedtasktype=="completed"){
    listtoberendered=completedlist;
  }else if(displayedtasktype=="noncompleted"){
    listtoberendered=notcompletedlist;
  }else if(displayedtasktype=="all"){
    listtoberendered=tasklist;
  }

  const tasks=listtoberendered.map((t:Task)=>{
   return <Task key={t.id} task={t}  onfilechange={handlefile} opendelete={opendeletedialog} openupdate={openupdatedialog}/>
    });

 
    
     function handleaddtask(){
        const newtask={
          id:uuidv4(),
          title:inputtitle,
          details:"",
          completed:false,
          file:null,
        };
        const updatedlist:Task[]=[...tasklist,newtask]
        settasklist(updatedlist);
        localStorage.setItem("tasks",JSON.stringify(updatedlist))

        setinputtitle("");
        showhidetoast("Task added successfully");
      }
      
// For delete task

function opendeletedialog(task:Task){
    setdialogtask(task)
    setshowdialog(true)
}
function handleClose(){
    setshowdialog(false);
  }

   function handleconfirmdelete(){

   const updatedlist=tasklist.filter((t:Task)=>{
      if(t.id == dialogtask?.id){
        return false;
      }
      else{return true;}
    })
   settasklist(updatedlist);
   setshowdialog(false);
   localStorage.setItem("tasks",JSON.stringify(updatedlist))
   showhidetoast("Task deleted successfully")
   
   }

   // for update task

   function openupdatedialog(task:Task){
     setdialogtask(task)
    setshowupdatedialog(true)
   }

   function handleCloseupdatedialog(){
    setshowupdatedialog(false)
  }

  function handleconfirmupdate(){
    if(!dialogtask) return;
     const updatedlist=tasklist.map((t:Task)=>{
     if(t.id === dialogtask.id){
      return {...t,title:dialogtask.title,details:dialogtask.details}
     }
     else {return t}
    })
    settasklist(updatedlist);
    localStorage.setItem("tasks",JSON.stringify(updatedlist))
    setshowupdatedialog(false);
    showhidetoast("Task updating successfully")
  }


      

  return (
    <div className={isDarkmode ? "app dark" : "app light"}>
          <button className="theme-btn" onClick={()=>setisDarkmode(!isDarkmode)}>
            {isDarkmode ?"LightMode" : "DarkMode"}
           </button>

         {/*  Dialog for delete  task */}
         <Dialog
                open={showdialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Are you sure you want to delete this task?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                   WArning:This action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={handleconfirmdelete} autoFocus>
                    Confirm Delete
                  </Button>
                </DialogActions>
              </Dialog>

         {/*Dialog for update task */}
       <Dialog
        open={showupdatedialog}
        onClose={handleCloseupdatedialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit Task:
        </DialogTitle>
        <DialogContent>
         <TextField
              autoFocus
              variant="standard"
              margin="dense"
              id="name"
             fullWidth
              label="Title:"
              value={dialogtask?.title || ""}
              onChange={(e)=>{
                setdialogtask({...dialogtask!,title:e.target.value})
              }}
             
            />
             <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Details:"
              fullWidth
               variant="standard"
              value={dialogtask?.details || ""}
              onChange={(e)=>{
                setdialogtask({...dialogtask!,details:e.target.value})
              }}
             
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseupdatedialog}>Close</Button>
          <Button onClick={handleconfirmupdate} >
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>

       <Container maxWidth="sm" className="taskcontainer" >
         <Box sx={{textAlign:"center",mt:4}} className="boxcard">

          <div className="header">
           <Typography variant="h5" style={{color:"#e75480",marginBottom:"35px"}} >
             Daily Tasks
           </Typography >
          </div>
           
           
           

      {/* Filter Button */}      
      <ToggleButtonGroup
      value={displayedtasktype}
      exclusive
      onChange={(event,newvalue)=>{setdisplaytasktype(newvalue)}}>
      <ToggleButton value="all" aria-label="left aligned">
        all
      </ToggleButton>
      <ToggleButton value="completed" aria-label="centered">
        do
      </ToggleButton>
      <ToggleButton value="noncompleted" aria-label="right aligned">
        undo
      </ToggleButton>
      
    </ToggleButtonGroup>

    {/*All Tasks   */}
    {tasks}
   

    {/*input+add */}

    <Grid container spacing={2} marginTop="20px">
        <Grid size={8} padding="10px" >
          <TextField id="outlined-basic" label="task address" variant="outlined" style={{width:"100%",color:"#616161"}}
          value={inputtitle} onChange={(e)=>{setinputtitle(e.target.value)}} />
        </Grid>

        <Grid size={4}>
         <Button variant="contained" style={{width:"100%",height:"80%",background:"#616161",marginTop:"7px"}}
         
       onClick={handleaddtask} disabled={inputtitle.length==0} >add task</Button>
        </Grid>
        
      </Grid>

    </Box>
      </Container>
    </div>

 

  );
}