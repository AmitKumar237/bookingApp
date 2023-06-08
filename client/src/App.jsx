import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './components/IndexPage'
import Login from './components/Login'
import Layout from './Layout'
import Register from './components/Register'
import axios from 'axios'
import { UserContextProvider } from './userContext'
import AccountPage from './components/AccountPage'

axios.defaults.baseURL = 'http://localhost:7000';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='/account/' element={<AccountPage />} />
          <Route path='/account/:subpage' element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
