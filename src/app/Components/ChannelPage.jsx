'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VideosSlider from './VideosSlider'
import Playlist from './Playlist'
import { BsPlusCircleFill } from 'react-icons/bs'
import WatchLater from './WatchLater'
import LikedVideos from './LikedVideos'
import { toast } from 'react-toastify'

export default function ChannelPage() {
  let { id } = useParams()
  let [user, setuser] = useState({})
  let [channelBannerImagePath, setChannelBannerImagePath] = useState('')
  let [ImagePath, setImagePath] = useState("")
  let [length, setlength] = useState(0)

  useEffect(() => {
    axios.post(`https://youtube-server-all.up.railway.app/api/auth/viewProfileById?id=${id}`)
      .then((response) => {
        setImagePath(response.data.imagepath + response.data._data.image)
        setuser(response.data._data)
        setChannelBannerImagePath(response.data.imagepath + response.data._data.channel_banner_image)
        setlength(response.data._data.videoIds.length)
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }, [id])

  return (
    <>
      <div className='py-4 px-[25px] w-full h-full flex flex-col gap-[25px]'>
        {
          user ?
            <>
              <div className=" w-full h-[400px] rounded-2xl ">
                {
                  channelBannerImagePath ?
                    <img src={channelBannerImagePath} className=' w-full h-full rounded-2xl' alt="" />
                    :
                    <img src="" className=' w-full h-full bg-gray-50 rounded-2xl' alt="" />
                }
              </div>

              <div className="flex items-center gap-5">
                <img src={ImagePath} alt="" className='lg:w-[200px] lg:h-[200px] w-15 h-15 rounded-full object-cover' />
                <div className='flex flex-col gap-3 '>
                  <h2 className='text-4xl font-extrabold '>
                    {user.channel_name || "Guest User"}
                  </h2>
                  <h2 className='text-2xl font-bold'>
                    {user.name || "User"}
                  </h2>
                  <ul className="flex gap-2 items-center text-lg">
                    <li>&bull;     {user.subscribers_count < 0 ? 0 : user.subscribers_count} Subscribers</li>
                    <li>&bull;     {length || 0} {length <= 1 ? 'Video' : 'Videos'}</li>
                  </ul>
                  <p className='text-xl '>
                    {user.channel_description}
                  </p>
                </div>
              </div>

              <div className="my-5">
                <h2 className='text-3xl font-bold'>Videos</h2>
                <VideosSlider id={id} />
                <Playlist id={user._id} />

                <div className="relative ">
                  <h2 className='text-3xl font-bold my-4'>Watch Later</h2>
                  <span className='absolute top-4 end-2'><BsPlusCircleFill className='text-lg font-bold' /></span>
                  <WatchLater id={user._id} />
                </div>
                <LikedVideos id={user._id}/>
              </div>
            </>
            :

            <p>No any user</p>
        }


      </div>


    </>
  )
}
