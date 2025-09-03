import { createContext,useEffect,useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const AppContext=createContext()

const AppContextProvider=(props)=>{
  const [user, setUser] = useState(null);
    const [showLogin,setshowLogin]=useState(false);
  const [token,setToken]=useState(localStorage.getItem('token'))

  const[credit,setCredit]=useState(false)

    const backendurl=import.meta.env.VITE_BACKEND_URL;
    const navigate=useNavigate()


    const loadcreditData=async()=>{
      try {
        const {data}=await axios.get(backendurl+'/api/user/credits',{headers:{token}})
        if(data.success){
          setCredit(data.credits)
          setUser(data.user)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

    const generateImage=async(prompt)=>{
       try {
        const {data}=await axios.post(backendurl+'/api/image/generate-image',{prompt},{headers:{token}})
        if(data.success){
          loadcreditData()
          return data.resultImage
        }else{
          toast.error(data.message)
          loadcreditData()
          if(data.creditBalance===0){
            navigate('/buy')
          }
        }
       } catch (error) {
        toast.error(error.message)
       }
    } 


   const logout=()=>{
    localStorage.removeItem('token');
    setToken('')
    setUser(null)
   }

    useEffect(()=>{
       if(token){
        loadcreditData()
       }
    },[token])


    const value={
      user,setUser,showLogin,setshowLogin,backendurl,token,setToken,credit,setCredit,loadcreditData,logout,generateImage
    }
  
  return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider;