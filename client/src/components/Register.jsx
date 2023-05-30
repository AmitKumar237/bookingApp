import {Link} from 'react-router-dom'
export default function Register() {
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form action="" className="max-w-md mx-auto">
                    <input type="text" placeholder='John Doe'/>
                    <input type="email" placeholder="your@email.com"/>
                    <input type="password" placeholder="password" />
                    <button className="primary">Register</button>
                    <div className='text-gray-500 text-center py-2'>
                        Already have an account? <Link to={'/login'} className='underline text-black'>Login now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}