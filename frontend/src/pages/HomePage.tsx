import { useAppSelector } from "@/redux/store/hooks"

const HomePage = () => {
    const user=useAppSelector(state=>state.auth.user)

    console.log("User on HomePage:", user)
  return (
    <div>HomePage</div>
  )
}

export default HomePage