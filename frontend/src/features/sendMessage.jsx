import React from 'react'
import api from '../../utils/axios'

async function SendMessage(payload) {
  try{
    const {data} = await api.post("/api/agent/chat", payload)
    return data
  }
    catch(error){
    console.error("STATUS:", error.response?.status);
  console.error("BACKEND RESPONSE:", JSON.stringify(error.response?.data, null, 2));
    console.error("FULL ERROR:", error);

      return null
    }
}

export default SendMessage
