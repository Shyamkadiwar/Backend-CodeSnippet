import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePass(){

    const [oldPassword, setOldpassword] = useState("")
    const [newPassword, setNewpassword] = useState("")
    const navigate = useNavigate()

    async function handleChangePass(e){
        e.preventDefault()
        const data = {oldPassword,newPassword}
        const response = await  axios.post('http://localhost:8000/api/v1/users/change-password',data,{withCredentials:true})
        if(response.status === 200){
            navigate('/login')
        }
    }

    return(
        <>
            <form onClick={handleChangePass}>
                <input type="text" value={oldPassword} placeholder="old password" onChange={(e)=>{setOldpassword(e.target.value)}} />
                <input type="text" value={newPassword} placeholder="new password" onChange={(e)=>{setNewpassword(e.target.value)}} />
                <button type="submit">submit</button>
            </form>
        </>
    )   
}

export default ChangePass