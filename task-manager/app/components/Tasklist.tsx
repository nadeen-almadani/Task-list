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
import { PieChart,Pie,Cell,Tooltip,Legend } from 'recharts';

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
    const [users,setusers]=useState<any[]>([]);
    const [search,setSearch]=useState("");
    
    //API
    useEffect(()=>{
      fetch("https://jsonplaceholder.typicode.com/users")
     .then((res)=>{
      console.log("response",res);
      return res.json();
     })
     .then((data)=>{
      console.log("data",data)
      setusers(data)
     })
     .catch((error)=>{
      console.log("error",error)
     })
    },[]);

   
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


     // stats
     const total=tasklist.length;
     const completed=tasklist.filter((t)=>t.completed).length;
     const pending= total-completed ;

     // charts
     const chartdata=[
      {name:"completed",value:completed},
      {name:"pending",value:pending}
     ];

     // search
     const filteredUsers=users.filter((u:any)=>
      u.name.toLowerCase().includes(search.toLocaleLowerCase()));

  return (

    <div className={isDarkmode ? "app dark" : "app light"}>
          <button className="theme-btn" onClick={()=>setisDarkmode(!isDarkmode)}>
            {isDarkmode ?"LightMode" : "DarkMode"}
           </button>

           <div style={{marginBottom:"20px",display:"flex",gap:"15px"}}>
           <div style={{flex:1,padding:"15px",border:"1px solid #ccc",borderRadius:"8px",textAlign:"center",background:"#f5f5f5"}}>
           <h4>Total Tasks</h4>
           <p>{total}</p>
           </div>

           <div style={{flex:1,padding:"15px",border:"1px solid #ccc",borderRadius:"8px",textAlign:"center",background:"#f5f5f5"}}>
            <h4>Completed Tasks</h4>
            <p>{completed}</p>
           </div>

            <div style={{flex:1,padding:"15px",border:"1px solid #ccc",borderRadius:"8px",textAlign:"center",background:"#f5f5f5"}}>
            <h4>Pending Tasks</h4>
            <p>{pending}</p>
           </div>
           </div>


          {/*charts */}
          <div style={{background:"white",padding:"20px",borderRadius:"12px",boxShadow:"0 2px 10px rgba(0,0,0,0.1)",marginBottom:"20px"}}>
            <h3 style={{textAlign:"center",marginBottom:"10px"}}>Tasks Overview</h3>
             <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={350} height={300}>
           <Pie
               data={chartdata}
               dataKey="value"
               nameKey="name"
               outerRadius={110}
               innerRadius={60}
               label
    >
              <Cell />
              <Cell />
         </Pie>
                <Tooltip />
                 <Legend />
  </PieChart>
</div>
          </div>
         


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

      <div style={{marginTop:"20px",border:"1px solid #ccc",background:"#f5f5f5",padding:"2px"}}>
         <input type='text' placeholder='search users' value={search} onChange={(e)=>setSearch(e.target.value)}/>
      </div>

       <Container maxWidth="sm" className="taskcontainer" >
        <div style={{display:"flex",gap:"20px"}}>
           <div style={{flex:2}}>
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
        </div>

    
       
        <div style={{marginTop:"40px",flex:1,height:"400px",overflowY:"auto",padding:"10px",borderRadius:"12px",background:"white"}}>
       <h2 style={{textAlign:"center",color:"#e75480"}}>Users</h2>
    
      {filteredUsers.length === 0 ?(
        <p style={{textAlign:"center",color:"gray"}}>No users found</p>
      ):(
        filteredUsers.map((u:any)=>(
          <div key={u.id}  style={{border:"1px solid #ccc",padding:"10px",marginBottom:"10px",background:"#f5f5f5"}} >
         <p>{u.name}</p>
         <p>{u.email}</p>

       </div>
      ))
      )}
       
      </div>
        </div>
       
       

    

      </Container>
    </div>

 

  );
}