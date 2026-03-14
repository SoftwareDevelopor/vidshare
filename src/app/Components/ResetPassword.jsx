'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs'

export default function ResetPassword() {
  let [password, setpassword] = useState(false)
  let token = useSelector((store) => {
    return store.userdetails.token
  })
  let handleResetPassword = (e) => {
    e.preventDefault()
    axios.post('https://youtube-server-a5ha.onrender.com/api/auth/reset-password', {
      new_password: e.target.new_password.value,
      confirm_password: e.target.confirm_password.value,
      headers: {
        'authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        toast.success(res.data.msg)
        
      }).catch((err) => {
        toast.error("Something went wrong...!")
      })
  }
  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-1/2 max-w-[500px] w-full py-5 px-3 border">
        <h1 className='text-2xl font-bold text-center my-3'>Reset Password</h1>
        <p className='text-lg text-center'>You reset the forgotten Password with a new one.</p>
        <form action="" onSubmit={handleResetPassword}>
          <div className="my-3">
            <label htmlFor="" className='ps-3 text-lg'>New Password :-</label>
            <div className='flex items-center border pr-2'>
              <input type={password ? "text" : "password"} name="password" placeholder='User Password' className='w-full my-1.5 py-1 ps-2 focus:outline-none' />
              {password ? <BsEyeFill onClick={() => setpassword(false)} /> : <BsEyeSlash onClick={() => setpassword(true)} />}
            </div>
          </div>
          <div className="my-3">
            <label htmlFor="" className='ps-3 text-lg'>Confirm Password :-</label>
            <div className='flex items-center border pr-2'>
              <input type={password ? "text" : "password"} name="password" placeholder='User Password' className='w-full my-1.5 py-1 ps-2 focus:outline-none' />
              {password ? <BsEyeFill onClick={() => setpassword(false)} /> : <BsEyeSlash onClick={() => setpassword(true)} />}
            </div>
          </div>
          <button type='submit' className='py-3 border px-[30px] rounded-lg bg-gray-950 text-white'>Reset Password</button>
        </form>
      </div>
    </>
  )
}
