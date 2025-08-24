import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link,  useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { useRegisterUserMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/store/hooks"
import { addUser } from "@/redux/features/auth/authSlice"
import CustomLoader from "@/components/Loader"
import { URL } from "@/lib/URL"


const registerSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1,"Please enter your email").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Enter a valid phone number"),
  role: z.enum(["donar", "receiver"], {
  message: "Please select a role",
}),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [registerUser]=useRegisterUserMutation()
    const dispatch=useAppDispatch()
    const navigate=useNavigate()

      const {
    register,
    handleSubmit,
    setValue,
    formState: { errors,isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

    const onSubmit = async(data: RegisterFormValues) => {
    try {
        const response=await registerUser(data).unwrap()
        console.log("Registration successful ✅", response)
         dispatch(addUser(response.user))
        toast.success("Registration successful! Welcome to home page.")
        navigate(URL.HOME)
    } catch (error:any) {
        console.error("Registration failed:", error)
        toast.error( error.data?.message || "Registration failed. Please try again.")
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
    Let’s Get You Started
  </CardTitle>
  <p className="text-sm md:mt-0.5 text-center text-custom-dark-gray">
    Enter your details to register and join our blood donation community.
  </p>
</CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" type="text" placeholder="John Doe" {...register("fullname")} />
                  {errors.fullname && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.fullname.message}</p>}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="johndoe123" {...register("username")} />
                  {errors.username && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.username.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com"  {...register("email")}/>
                  {errors.email && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                    <div className="relative">
                <Input id="password" type={showPassword?"text":"password"} placeholder="••••••••"
                 {...register("password")} />
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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+923001234567" {...register("phone")} />
                     {errors.phone && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.phone.message}</p>}
              
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(val) => setValue("role", val as "donar" | "receiver")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donar">Donar</SelectItem>
                    <SelectItem value="receiver">Receiver</SelectItem>
                  </SelectContent>
                </Select>
                  {errors.role && <p className="text-red-500 text-sm -mt-1 pl-0.5">{errors.role.message}</p>}
              </div>

              {/* Submit */}
              <Button className="w-full btn" type="submit"
              disabled={isSubmitting}>
                {
                    isSubmitting?<CustomLoader />:"Register"
                }
              </Button>
               <p className="text-center text-custom-dark-gray">
                    Already have an account?{" "}
                    <Link to="/login" className="text-custom-blue font-medium hover:underline">
                    Login
                    </Link>
                    </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
