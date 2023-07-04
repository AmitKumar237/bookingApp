import { useContext, useState } from "react"
import { UserContext } from "../userContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Placespage from "./PlacesPage";
import AccountPageNav from "./AccountPageNav";

export default function AccountPage () {
    const [redirect , setRedirect] = useState(null);
    const {user,ready,setUser} = useContext(UserContext);
    let {subpage} = useParams();
    if(subpage === undefined){
        subpage = 'profile';
    }

    async function logout() {
        console.log('logout');
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if(!ready){
        return 'Loading...'
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }


    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div>
            <AccountPageNav />

            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logged Out</button>
                </div>
            )}

            {subpage == 'places' && (
                <Placespage />
            )}
        </div>
    )
}