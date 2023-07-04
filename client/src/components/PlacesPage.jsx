import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import AccountPageNav from "./AccountPageNav";
import axios from "axios";

export default function Placespage() {
    const [places,setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(({data}) =>{
            setPlaces(data);
        })
    } , []);

    return(
        <>
            <AccountPageNav />
            <div className="text-center">
                <Link className="inline-flex gap-3 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Place
                </Link>
            </div>

            {places.length > 0 && places.map(place => (
                <Link to={`/account/places/${places[0]._id}`} className="bg-gray-100 mt-4 p-2 rounded-xl flex gap-4 cursor-pointer">
                    <div className="flex h-32 w-32 bg-gray-300 grow shrink-0">
                        <img className="object-cover" src={'http://localhost:7000/uploads/'+place.photos[0]} alt="photos" />
                    </div>
                    <div>
                        <h2 className="text-lg">{place.title}</h2>
                        <div className="grow-0 shrink mt-1 text-sm">
                            <p>{place.description}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    )
}