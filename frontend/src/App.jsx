import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import GoogleLogin from './components/GoogleLogin'
import Dashboard from './components/Dashboard'
import PageNotFound from './components/PageNotFound'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const GoogleOAuthWrapper=()=>{
    return(
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin/>
      </GoogleOAuthProvider>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<GoogleOAuthWrapper/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
