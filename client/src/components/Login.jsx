import axios from 'axios';
import { useContext, useState } from 'react'
import {Link, Navigate} from 'react-router-dom'
import { UserContext } from '../userContext';
export default function Login() {

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [redirect , setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function loginUser(ev) {
        ev.preventDefault();
        try{
            const {data} = await axios.post('/login' , {email , password});
            setUser(data);
            alert("Login Successful");
            setRedirect(true);
        }catch(ev){
            alert("Login failed!");
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form action="" className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)}
                    />

                    <input type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}
                    />

                    <button className="primary">Login</button>
                    <div className='text-gray-500 text-center py-2'>
                        Don't have the account yet? <Link to={'/register'} className='underline text-black'>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}