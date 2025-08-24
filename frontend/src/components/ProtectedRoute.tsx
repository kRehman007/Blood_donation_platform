import { useCheckAuthQuery,  } from "@/redux/features/auth/authApi"
import {  useEffect, type JSX } from "react"
import { CustomPageLoader } from "./Loader"
import { Navigate, useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/store/hooks"
import { addUser } from "@/redux/features/auth/authSlice"
import { URL } from "@/lib/URL"
import toast from "react-hot-toast"



interface ProtectedRouteProps{
    children:JSX.Element
}
const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
  const {data,isLoading,error}=useCheckAuthQuery()
  const dispatch=useAppDispatch()
  const navigate=useNavigate()

  useEffect(()=>{
    if(!isLoading){
        if(error || !data){
            toast.error("Please login first")
            navigate(URL.LOGIN,{replace:true})
        }
    }
    if(data){
    console.log("User is authenticated ✅", data)
  dispatch(addUser(data?.user?._doc))
    }
  },
[isLoading,error,data])
  if(isLoading){
    return <CustomPageLoader />
  } 

  return data ? (children) : <Navigate to="/login" replace />
}

export default ProtectedRoute