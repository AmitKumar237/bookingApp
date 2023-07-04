import {useEffect, useState} from 'react'
import Perks from "./Perks";
import axios from "axios";
import PhotosUploader from "./PhotosUploader";
import AccountPageNav from './AccountPageNav';
import { Navigate, useParams } from 'react-router-dom';

export default function PlacesFormPage() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos , setAddedPhotos] = useState([]);
    const [description , setDescription] = useState('');
    const [perks , setPerks] = useState([]);
    const [extraInfo , setExtraInfo] = useState('');
    const [checkIn , setCheckIn] = useState('');
    const [checkOut , setCheckOut] = useState('');
    const [maxGuests , setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState('');

    useEffect(() => {
        if(!id){
            return;
        }

        axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
        })
    } , [id]);

    async function savePlace(ev) {
        ev.preventDefault();

        const placeData = {title , address , 
            addedPhotos , description , 
            perks , extraInfo ,  
            checkIn , checkOut , 
        maxGuests};

        if(id){
            // Update
            await axios.put('/places' , {id , ...placeData});
        }else{
            // new Place    
            await axios.post('/places' , placeData);
        }
        setRedirect('/account/places');
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

  return (
    <div>
        <AccountPageNav />
        <form onSubmit={savePlace}>
            <h2 className="text-2xl mt-4">Title</h2>
            <p className="text-gray-500 text-sm">Title for your place, should be catchy for the advertisement.</p>
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title , for exmple: My lovely place"/>
            <h2 className="text-2xl mt-4">Address</h2>
            <p className="text-gray-500 text-sm">Address to the place.</p>
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
            <h2 className="text-2xl mt-4">Photos</h2>
            <p className="text-gray-500 text-sm">Better = More</p>
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            <h2 className="text-2xl mt-4">Description</h2>
            <p className="text-gray-500 text-sm">Description about the place.</p>
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
            <h2 className="text-2xl mt-4">Perks</h2>
            <p className="text-gray-500 text-sm">Select all the perks of your places.</p>
            <div className="mt-2 gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">   
                <Perks selected={perks} onChange={setPerks}/>
            </div>                       

            <h2 className="text-2xl mt-4">Extra Info</h2>
            <p className="text-gray-500 text-sm">House rules ,etc.</p>
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

            <h2 className="text-2xl mt-4">Check in&out times</h2>
            <p className="text-gray-500 text-sm">Remember to have some window size for the cleaning of the rooms, between the guests. </p>
            <div className="grid sm:grid-cols-3 gap-3">
                <div>
                    <h3 className="mt-2 -mb-1">Check in time</h3>
                    <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="12:00"/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Check out time</h3>
                    <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11:00"/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Max Number of Guests</h3>
                    <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} placeholder="2"/>
                </div>
            </div>

            <div>
                <button className="primary my-4">Save</button>
            </div>
        </form>
    </div>
  )
}
