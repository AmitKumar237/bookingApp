import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './components/IndexPage'
import Login from './components/Login'
import Layout from './Layout'
import Register from './components/Register'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='register' element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
