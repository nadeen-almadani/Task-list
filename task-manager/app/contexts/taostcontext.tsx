import { createContext } from "react";
type ToastContextType={
   showhidetoast:(message:string)=> void;

};

export const Toastcontext=createContext<ToastContextType | null>(null);