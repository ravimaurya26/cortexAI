
import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserdata } from './redux/userSlice'
import getCurrentUser from './features/getCurrentUser'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      const data =await getCurrentUser()
      dispatch(setUserdata(data));
    }
    getUser()
  }, [])
      

  return (
  
  <>
  <Home/>
  </>
    
  )
}

export default App
