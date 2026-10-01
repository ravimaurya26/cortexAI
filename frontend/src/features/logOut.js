import React from 'react';
import api from '../../utils/axios';

async function logOut() {
  try {
    const { data } = await api.get("/api/auth/logout");

    console.log("Logout response:", data);

    return true;
  } catch (error) {
    console.log("Logout error:", error);
    return false;
  }
}

export default logOut;