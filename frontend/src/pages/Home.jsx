import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth'
import api from '../../utils/axios'
import { auth, googleProvider } from '../../utils/firebase'
import { FcGoogle } from "react-icons/fc";
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import ArtiFact from '../components/ArtiFact';

function Home() {
  const {userData} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token })
      dispatch(setUserData(data.user))
    } catch (err) {
      console.log(err)
    }
  }

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data.user.getIdToken()

    await handleLogin(token)
    console.log(data)
  }

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden flex">

      <SideBar/>
      <ChatArea/>
      <ArtiFact/> 
    
    {!userData && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
       <div className= ' w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col items-center gap-5'>
         <div className='flex flex-col items-center gap-2 '>
          <h2 className='text-[17px]font-semibold text-slate-100 tracking-tight'>Welcome to CortexAI</h2>
          <p className='text-[15px] text-slate-400 tracking-tight'>Login to continue using the app</p>

         </div>
         <button className='w-full flex items-center justify-center gap-2 bg-white/70 hover:bg-white/85 transition text-black/90 rounded-lg py-2 text-[15px] font-semibold' onClick={googleLogin}>
          <FcGoogle size={20} />
          Continue with Google
         </button>
       </div>
      </div>}
      
    </div>
  )
}

export default Home