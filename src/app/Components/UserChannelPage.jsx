'use client'
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import VideosSlider from './VideosSlider';
import Playlist from './Playlist';
import WatchLater from './WatchLater';
import LikedVideos from './LikedVideos';
import { toast } from 'react-toastify';

export default function UserChannelPage() {

    let [imagePath, setImagePath] = useState("")
    let [channeimage, setchannelimage] = useState("")
    let [user, setuser] = useState({})
    let [length, setlength] = useState(null)
    let [subscribers, setsubscribers] = useState([])

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
                    setchannelimage(res.data.image_url + res.data._data.channel_banner_image)
                    setuser(res.data._data)
                    setsubscribers(res.data._data.subscribed_channels)
                    setlength(res.data._data.videoIds.length)
                })
                .catch((error) => {
                    toast.error("Error fetching user data:");
                });
        }
    }, [token]);

    return (

        <div className='py-4 lg:px-[25px] w-full h-full flex flex-col gap-[25px]'>
            {
                user && token ?
                    <>

                        <div className=" w-full h-[400px] rounded-2xl">
                            {
                                channeimage ?
                                    <>
                                        <img src={channeimage} className=' w-full h-full rounded-2xl ' alt="" />
                                        
                                    </>
                                    :
                                    <img src="" className=' w-full h-full bg-gray-50 rounded-2xl border border-gray-300' alt="" />
                            }

                        </div>

                        <div className="flex items-center gap-5">
                            <img src={imagePath} alt="" className='w-15 h-15 rounded-full' />
                            <div className='flex flex-col gap-3 '>
                                <h2 className='text-4xl font-extrabold '>{user.channel_name}</h2>
                                <h2 className='text-2xl font-bold'>{user.name}</h2>
                                <ul className="flex gap-2 items-center text-lg">
                                    <li>&bull;     {user.subscribers_count < 0 ? 0 : user.subscribers_count} Subscribers</li>
                                    <li>&bull;     {length ? length : 0} {length <= 1 ? 'Video' : 'Videos'}</li>
                                </ul>
                                <p className='text-xl font-semibold'>{user.channel_description}</p>
                                <div className="flex gap-3 items-center">
                                    <h1>Subscribers : </h1>
                                    <div className="flex flex-wrap">
                                        {
                                            subscribers || subscribers.length > 0 ?
                                                subscribers.map((image, index) => {
                                                    return (
                                                        <img src={`https://youtube-server-a5ha.onrender.com/uploads/users/${image.image}`} alt="" className='w-15 h-15 rounded-full' />
                                                    )
                                                })
                                                :

                                                <p>No any subscribers...!</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h2 className='text-3xl font-bold'>Videos</h2>
                            <VideosSlider id={user._id} />
                            <Playlist id={user._id} />
                            <h2 className='text-3xl font-bold my-4'>Watch Later</h2>
                            <WatchLater id={user._id} />
                            <LikedVideos id={user._id} />

                        </div>
                    </>
                    :
                    <>
                        <p>No user</p>
                    </>
            }
        </div>


    )
}
