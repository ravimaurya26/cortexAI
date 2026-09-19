import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser()
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
