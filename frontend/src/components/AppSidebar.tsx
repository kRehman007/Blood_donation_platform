import { Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { URL } from "@/lib/URL"
import { Link, useNavigate } from "react-router-dom"
import { useLogoutUserMutation } from "@/redux/features/auth/authApi"
import { clearUser } from "@/redux/features/auth/authSlice"
import { useAppDispatch } from "@/redux/store/hooks"
import toast from "react-hot-toast"

// Menu items.
const items = [
  {
    title: "Home",
    url: URL.HOME,
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
    const navigate=useNavigate()
    const dispatch=useAppDispatch()
    const [logoutUser]=useLogoutUserMutation()

      const handleLogout = async () => {
    try {
      await logoutUser().unwrap()
      dispatch(clearUser())
      toast.success("Logged out successfully")
      navigate(URL.LOGIN)
    } catch (error:any) {
      console.error("Logout failed", error)
      toast.error(error.data?.message||"Logout failed. Please try again.")
    }
  }

  return (
    <Sidebar>
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 pb-12">
          <img src="/Logo.png" alt="Logo" className="w-14 h-14 object-contain" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="pl-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="">
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
     
      <SidebarMenuItem  className="absolute bottom-4 pl-4 list-none w-full">
                  <SidebarMenuButton asChild
                  onClick={handleLogout}
                  >
                    <div>
                      <LogOut />
                      <span>Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
      </SidebarContent>
    </Sidebar>
  )
}