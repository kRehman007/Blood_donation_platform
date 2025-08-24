import type React from "react";

export interface RouteLayout{
    link:string;
    element:React.ComponentType;
    isProtected:boolean;
}

export interface User{
    _id?:string;
    fullname:string;
    username:string;
    email:string;
    phone:string;
    role:["donar" | "receiver"];
    createdAt?:string;
    updatedAt?:string;
    token?:string
}