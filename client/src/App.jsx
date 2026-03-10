import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/LoginPage/Login'


function App() {
 

  return (
    <>
    
     <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/Login' element={<Login/>} />
     </Routes>
  
    
    </>
  )
}

export default App
