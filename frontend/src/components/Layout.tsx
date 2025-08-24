import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="">
      <AppSidebar />
      {/* <main className="px-3 flex-1 md:px-8 py-2 relative">
        <div className="absolute right-2  md:left-2"><SidebarTrigger /></div>
        <div className="mt-8 md:mt-14">{children}</div>
      </main> */}
      <main className="px-3 space-y-6 flex-1 md:px-8 py-2">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}