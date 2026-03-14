'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa6';
import { BsEyeFill, BsEyeSlash, BsSearch } from 'react-icons/bs'
import { BsPlus } from 'react-icons/bs';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { channelState, logout, userDetails } from '../userslices/userslice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io'
import { IoLogoYoutube } from 'react-icons/io5'
import { searchVideos } from '../searchresultslices/searchSlice';

export default function Header() {

    let [openModal, setOpenModal] = useState(false)
    let [openUserModal, setOpenUserModal] = useState(false)
    let [openLoginModal, setLoginModal] = useState(false)
    let [openforgotModal, setForgotModal] = useState(false)
    let [user, setuser] = useState({})
    let [password, setpassword] = useState(false)
    let [channel, setChannel] = useState(false)
    let [imagePath, setImagePath] = useState("")
    let dispatch = useDispatch()
    let route = useRouter()

    let handle = (e) => {
        e.preventDefault()
        axios.post('https://youtube-server-a5ha.onrender.com/api/auth/register', e.target)
            .then((res) => {
                dispatch(userDetails({ token: res.data.token }))
                setOpenModal(false)
                setChannel(false)
                dispatch(channelState({ channel: !channel }))
                e.target.reset()
                toast.success(res.data.msg)
            })
            .catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let logoutuser = () => {
        dispatch(logout())
        toast.info("Logout User..!")
        setOpenUserModal(false)
    }

    let handleLogin = (event) => {
        event.preventDefault()
        let obj = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        axios.post('https://youtube-server-a5ha.onrender.com/api/auth/login', obj)
            .then((respnse) => {
                dispatch(userDetails({ token: respnse.data.token }))
                toast.success(respnse.data.msg)
                obj.email = ''
                obj.password = ''
                setLoginModal(false)
                setChannel(false)
                dispatch(channelState({ channel: !channel }))
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let token = useSelector((t) => {
        return t.userdetails.token
    })

    useEffect(() => {
        if (token) {
            axios.post('https://youtube-server-a5ha.onrender.com/api/auth/view-profile', {}, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    setImagePath(res.data.image_url + res.data._data.image)
                    setuser(res.data._data)
                    setChannel(false)
                    dispatch(channelState({ channel: !channel }))
                })
                .catch((error) => {
                    toast.error("Something went wrong...!")
                    setChannel(false)
                });
        }
    }, [token]);

    let handleforgotPassword = (event) => {
        event.preventDefault()
        let obj = {
            email: event.target.email.value
        }
        axios.post('https://youtube-server-a5ha.onrender.com/api/auth/forgot-password', obj)
            .then((response) => {
                toast.info(response.data.msg)
                setForgotModal(false)
                event.target.email.value = ''
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let handleVideo = () => {
        route.push('/video/upload')
    }

    let handleCreateChannel = () => {
        setChannel(true)
        dispatch(channelState({ channel: !channel }))
        route.push('/create-youtube-channel')
        setOpenUserModal(false)
    }

    let handleSearch = (e) => {
        e.preventDefault()
        let obj = {
            searchedText: e.target.searchedText.value
        }
        axios.post('https://youtube-server-a5ha.onrender.com/api/video/search-videos', obj)
            .then((res) => {
                if (res.data.status) {
                    toast.success(res.data.msg)
                    dispatch(searchVideos({ searchVideos: res.data._data }))
                }
                else {
                    toast.error(res.data.msg)
                    dispatch(searchVideos({ searchVideos: [] }))
                }
            }
            ).catch((error) => {
                toast.error("Something went wrong...!")
                dispatch(searchVideos({ searchVideos: [] }))
            }
            )
    }

    let chanelstate=useSelector((state)=>{
        console.log(state)
    })


    return (
        <>
            <div className="grid lg:grid-cols-[75%_auto] items-center px-4 gap-[50px] sticky top-0 z-50 bg-white">
                <div className=" flex items-center justify-between  gap-[50px] mx-auto">
                    <div className="flex gap-[50px] p-2 items-center">
                        <FaBars className='text-2xl' />
                        <Link href={'/'}>
                            <img src="/logo.png" className='max-w-full h-12' alt="Youtube Logo" />
                        </Link>
                    </div>
                    <form onSubmit={handleSearch} className="max-w-3xl flex items-center rounded-4xl border ">
                        <input type="text" name="searchedText" className='w-[750px] py-3 ps-[25px] border-none outline-none focus:outline-none' id="" autoComplete='on' />
                        <button type='submit' className="bg-gray-400 p-2.5 rounded-r-4xl cursor-pointer">
                            <BsSearch className='text-3xl' />
                        </button>
                    </form>
                </div>
                <div className=" flex items-center gap-[25px] ">
                    {
                        token ?
                            <>
                                <div className=" bg-green-300 py-2 rounded-4xl flex items-center px-3 mt-1 cursor-pointer" style={{ boxShadow: '-10px -1.5px 0px rgba(246, 226, 16, 0.645)' }} onClick={handleVideo}>
                                    <BsPlus className='text-4xl font-extrabold ' />
                                    <h2 className='text-3xl font-semibold'>Create</h2>
                                </div>
                                <div className='relative'>
                                    <img src={imagePath} className='w-15 h-15 rounded-full cursor-pointer' alt="" onClick={() => { setOpenUserModal(!openUserModal), dispatch(channelState({ channel: !channel })) }} />
                                    <div className={`absolute right-0 top-[100%] border lg:w-[320px] p-2 bg-white rounded-lg text-lg cursor-pointer  ${openUserModal == true ? '' : 'hidden'}`}>
                                        {
                                            channel ?
                                                <div className="grid grid-cols-2 gap-3 border-b w-full py-3">

                                                    <div className="flex flex-col items-center gap-2">

                                                        <h1>{user.channel_name}</h1>
                                                        <h2>{user.name}</h2>
                                                    </div>
                                                    <Link href={'/user-channel'}><h1 onClick={() => setOpenUserModal(false)}>View Channel Info</h1></Link>
                                                </div>
                                                :
                                                <h1 onClick={handleCreateChannel}>Create YouTube Channel</h1>
                                        }
                                        <div className="flex flex-col h-[350px] overflow-auto group">
                                            <h2 className='cursor-pointer px-5 flex items-center justify-between py-2 hover:bg-gray-300' onClick={logoutuser}>Logout <span><IoIosArrowForward /></span></h2>

                                            <Link href={'/user-channel'}>
                                                <h2 className='px-5 flex items-center justify-between hover:bg-gray-300 py-2'>Subscribers <span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <h2 className='px-5 flex items-center justify-between hover:bg-gray-300 py-2'>Live <span><IoIosArrowForward /></span></h2>

                                            <Link href={user || token ? '/user-channel/#videos' : ''}>
                                                <h2 className='px-5 flex items-center hover:bg-gray-300 justify-between py-2'>Your Videos<span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <Link href={`/downloaded-video/${user._id}`}>
                                                <h2 className='px-5 flex items-center justify-between py-2 hover:bg-gray-300'>Downloads<span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <Link href={user || token ? '/user-channel/#watch-later' : ''}>
                                                <h2 className='px-5 flex items-center justify-between py-2 hover:bg-gray-300'>Watch Later<span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <Link href={user || token ? '/user-channel/#liked-videos' : ''}>
                                                <h2 className='px-5 flex items-center hover:bg-gray-300 justify-between py-2'>Liked Videos<span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <Link href={user || token ? '/settings/#country' : ''}>

                                                <div className='px-5 flex items-center justify-between py-2 hover:bg-gray-300'>
                                                    <div className='flex flex-col gap-1'>
                                                        <p>Location</p>
                                                        <p>{user ? user.country : ''}</p>
                                                    </div>
                                                    <span>
                                                        <IoIosArrowForward />
                                                    </span>
                                                </div>
                                            </Link>

                                            <Link href={'/settings'}>
                                                <h2 className='px-5 flex items-center justify-between py-2 hover:bg-gray-300'>Settings<span><IoIosArrowForward /></span></h2>
                                            </Link>

                                            <Link href={'/help'}>
                                                <h2 className='px-5 flex items-center justify-between rounded-b-lg py-2 hover:bg-gray-300'>Help<span><IoIosArrowForward /></span></h2>
                                            </Link>
                                        </div>
                                    </div>


                                </div>
                            </>
                            :
                            <>
                                <button className='py-2.5 px-3.5 border rounded-3xl cursor-pointer' style={{ boxShadow: '6px 4px 2px rgba(0,0,0,0.3)' }} onClick={() => setOpenModal(true)}>SignIn</button>
                            </>
                    }
                </div>

                {/* <div className=""></div> for toggling the background of page */}

            </div>

            <div className={`lg:max-w-[600px] border fixed top-[-100%] left-[50%] translate-x-[-50%] translate-y-[-50%] py-2 px-[25px] w-full m-2 duration-500 bg-white z-50 ${openModal == true ? 'top-[50%]' : ''}`}>

                <div className="flex flex-col items-center gap-1">
                    <IoLogoYoutube className='text-[45px] text-red-500' />
                    <h1 className='text-xl font-bold'>Welcome to Youtube</h1>
                    <h2 className='text-2xl font-semibold mb-2'>User Form Data Entry</h2>
                    <span className='absolute right-6 top-4 text-3xl cursor-pointer' onClick={() => setOpenModal(false)}>&times;</span>
                </div>
                <form onSubmit={handle}>
                    <div className="mb-1">
                        <label >Name</label>
                        <input type="text" name="name" placeholder='User Name' className='w-full my-1 p-1.5 border' />
                    </div>
                    <div className="mb-1">
                        <label >Email</label>
                        <input type="email" name="email" placeholder='User Email' className='w-full my-1 p-1.5 border' />
                    </div>
                    <div className="mb-1">
                        <label>Password</label>
                        <div className='flex items-center border focus:border-4 focus:outline-4x'>
                            <input type={password ? "text" : "password"} name="password" placeholder='User Password' className='w-full py-1.5 ps-2 focus:outline-none' />
                            {password ? <BsEyeFill onClick={() => setpassword(false)} className='pe-1.5 text-2xl' /> : <BsEyeSlash onClick={() => setpassword(true)} className='pe-1.5 text-2xl' />}
                        </div>
                    </div>
                    <div className="mb-1">
                        <label >Mobile Number</label>
                        <input type="tel" name="mobile_number" placeholder='User Mobile Number' className='w-full my-1 p-1.5 border' />
                    </div>
                    <div className="mb-1">
                        <label >Profile Image</label>
                        <input type="file" name="image" placeholder='User Profile Image' className='w-full my-1 p-1.5 border' />
                    </div>
                    <button type='submit' className='px-[25px] border py-2.5 rounded-lg' style={{ background: 'linear-gradient(to right, #87ceeb, rgb(245,245,245))' }} >Submit</button>

                    <h1 className='text-green-500 text-center font-bold cursor-pointer' onClick={() => { setLoginModal(true), setOpenModal(false) }}>Already an User..! <span>Login</span>
                    </h1>

                </form>
            </div>

            <div className={`fixed top-1/2 left-1/2 -translate-1/2 lg:max-w-[400px] w-full p-5 lg:m-0 m-1.5 border z-[99] rounded-lg bg-white ${openLoginModal == true ? 'block' : 'hidden'}`}>

                <div className="flex flex-col items-center gap-2">
                    <IoLogoYoutube className='text-[45px] text-red-500' />
                    <h1 className='text-xl font-bold'>Welcome Back to Youtube</h1>
                    <h1 className='text-lg font-bold'>Login User..</h1>
                    <span className='absolute right-6 top-4 text-3xl cursor-pointer' onClick={() => setLoginModal(false)}>&times;</span>
                </div>

                <form action="" onSubmit={handleLogin}>

                    <div className="my-3">
                        <label htmlFor="">Email</label>
                        <input type="email" name="email" placeholder='User Email' className='w-full my-1 p-2 border' />
                    </div>
                    <div className="my-3">
                        <label htmlFor="">Password</label>
                        <div className='flex items-center border pr-2'>
                            <input type={password ? "text" : "password"} name="password" placeholder='User Password' className='w-full my-1.5 py-1 ps-2 focus:outline-none' />
                            {password ? <BsEyeFill onClick={() => setpassword(false)} /> : <BsEyeSlash onClick={() => setpassword(true)} />}
                        </div>
                    </div>
                    <button type='submit' className='py-2 border px-[50px] my-2 rounded-lg bg-gray-950 text-white'>Login</button>

                    <h1 className='text-lg font-bold cursor-pointer text-red-400' onClick={() => { setForgotModal(true), setLoginModal(false) }}>Forgot Password ?</h1>
                </form>
            </div>

            <div className={`fixed top-1/2 left-1/2 -translate-1/2 lg:max-w-[400px] w-full p-5 lg:m-0 m-1.5 border z-[99] rounded-lg bg-white ${openforgotModal == true ? 'block' : 'hidden'}`}>
                <h1 className='text-xl font-bold text-center my-2'>Forgot Password..</h1>
                <p className='text-lg text-center '>No worries..! Enter your Email ID below, we'll send you a link to reset you password.</p>
                <span className='absolute right-6 top-4 text-3xl cursor-pointer' onClick={() => setForgotModal(false)}>&times;</span>
                <form action="" onSubmit={handleforgotPassword}>
                    <div className="my-3">
                        <label htmlFor="">Email</label>
                        <input type="email" name="email" placeholder='User Email' className='w-full my-1.5 p-2 border' />
                    </div>
                    <button type='submit' className='w-full border my-2 rounded-md py-2 bg-gray-950 text-white'>Send Link</button>
                </form>
            </div>
        </>
    )
}