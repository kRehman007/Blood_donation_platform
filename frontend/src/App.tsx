import { Route, Routes } from "react-router-dom"
import { AllRoutes } from "./lib/route"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import {Toaster} from "react-hot-toast"
function App() {


  return (
   <>
   <Toaster position="bottom-right" />
   <Routes>
   {
    AllRoutes.map(({link,element:Element,isProtected},index)=>(
     isProtected?(
      <Route key={index} path={link} element={<ProtectedRoute>
          <Layout>
        <Element />
        </Layout>
      </ProtectedRoute>} />
     ):(
      <Route key={index} path={link} element={<Element />} />
     )
    ))
   }
   </Routes>
   </>
  )
}

export default App
