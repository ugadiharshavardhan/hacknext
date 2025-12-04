import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
// import { useNavigate } from 'react-router'
// import { FaAngleLeft } from "react-icons/fa";

function UserAccount() {
    // const navigate = useNavigate()
    const [userData,setUserData] = useState([])

    useEffect(()=> {
        const fetchAccount = async() => {
            const url = "http://localhost:5678/user/account";
            const options = {
                method:"GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("jwt_token")}`
                },
            }

            const response = await fetch(url,options)
            const data = await response.json()
            setUserData(data.userDetails)
        }
        fetchAccount()
    },[])

    if (userData.length===0) {
        return (
           <div className="bg-gray-800 min-h-screen flex justify-center items-center text-white text-xl">
                Loading...
            </div>
        )
    }

    console.log(userData)

  return (
    <div className='bg-gray-800 min-h-screen flex flex-col justify-center items-center'>
        <div className='bg-white p-10'>
            <h1 className='text-black font-bold text-2xl underline'>Student Details</h1>
            <div className='m-2'>
                <p>Student Name : <span>{userData.username}</span> </p>
                <p>Student Email : <span>{userData.email}</span></p>
            </div>
        </div>
    </div>
  )
}

export default UserAccount
