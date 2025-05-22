import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function PageNotFound() {
    const navigate = useNavigate();
  return (
    <div>
        <h2>404 Page Not Found</h2>
        <button onClick={()=>navigate("/login")}>Login</button>
    </div>
  )
}
