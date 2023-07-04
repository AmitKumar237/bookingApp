import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './components/IndexPage'
import Login from './components/Login'
import Layout from './Layout'
import Register from './components/Register'
import axios from 'axios'
import { UserContextProvider } from './userContext'
import AccountPage from './components/AccountPage'
import Placespage from './components/PlacesPage'
import BookingPage from './components/BookingPage'
import PlacesFormPage from './components/PlacesFormPage'

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
          <Route path='/account/places/' element={<Placespage />} />
          <Route path='/account/bookings/' element={<BookingPage />} />
          <Route path='/account/places/new' element={<PlacesFormPage />} />
          <Route path='/account/places/:id' element={<PlacesFormPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
