import HomePage from "@/pages/HomePage";
import { URL } from "./URL";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import type { RouteLayout } from "@/lib/interface";

export const AllRoutes:RouteLayout[]=[
    {
        link:URL.LOGIN,
        element:LoginPage,
        isProtected:false,
    },
    {
        link:URL.REGISTER,
        element:RegisterPage,
        isProtected:false,
    },
    {
        link:URL.HOME,
        element:HomePage,
        isProtected:true,
    }
]