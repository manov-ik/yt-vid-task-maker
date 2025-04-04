import { useState } from 'react'
import Home from "./pages/Home"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Task from "./pages/Task"

function App() {
 

  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/task" element={<Task/>}/>
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
