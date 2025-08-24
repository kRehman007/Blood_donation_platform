import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { useLoginUserMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/store/hooks"
import { addUser } from "@/redux/features/auth/authSlice"
import CustomLoader from "@/components/Loader"
import { URL } from "@/lib/URL"

const loginSchema=z.object({
    email:z.string().min(1,"Please enter your email").email("Invalid email address"),
    password:z.string().min(1,"Password enter your password"),
})

type LoginFormValues=z.infer<typeof loginSchema>
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate()
    const [loginUser]=useLoginUserMutation()
    const dispatch=useAppDispatch()

    const {
        handleSubmit,
        register,
        formState:{errors,isSubmitting},
    }=useForm<LoginFormValues>({
        resolver:zodResolver(loginSchema)
    })  

     const onSubmit = async(data: LoginFormValues) => {
    try {
        const response=await loginUser(data).unwrap()
        dispatch(addUser(response.user))
        toast.success("Login successful! Welcome to home page.")
        navigate(URL.HOME)
    } catch (error:any) {
        console.log("Login failed:", error)
        toast.error(error.data?.message || "Login failed. Please try again.")
        if(error.status===404){
         navigate(URL.REGISTER)
        }
       
    }
  }
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Image (hidden on small screens) */}
      <div className="hidden lg:flex items-center justify-center bg-gray-100">
        <img
          src="/SideImg.jpg"
          alt="Register"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
  <CardTitle className="text-xl md:text-3xl font-bold text-center text-custom-blue">
    {/* Welcome Back */}
    Log in to Stay Connected
  </CardTitle>
  <p className="text-sm text-center text-custom-dark-gray">
    Please login to continue and manage your donations.
  </p>
</CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                     {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                 {errors.email && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.email.message}</p>}

              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                <Input id="password" type={showPassword?"text":"password"} placeholder="••••••••" {...register("password")}/>
                   <div className="absolute right-2 top-2 text-muted-foreground">
                    {
                    showPassword?<Eye
                    size={18}
                    onClick={()=>setShowPassword(false)}
                    />:<EyeOff onClick={()=>setShowPassword(true)}
                    size={18}
                    />
                }
                </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.password.message}</p>}
              </div>

            

              {/* Submit */}
              <Button className="w-full btn" type="submit">
                {
                isSubmitting?<CustomLoader />:"Log In"
                }
              </Button>
                <p className="text-center text-custom-dark-gray">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-custom-blue font-medium hover:underline">
                    Register
                    </Link>
                    </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
