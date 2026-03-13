'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function RightSideBar() {

  let [videos, setVideos] = useState([])

  let [videoviews, setVideoviews] = useState("")


  let token = useSelector((t) => {
    return t.userdetails.token
  })

  let searchedvideos = useSelector((state) => {
    if (token) {
      return state.searchVideos.searchVideos
    }
  })

  useEffect(() => {
    axios.post("https://youtube-server-all.up.railway.app/api/video/getallvideos")
      .then((response) => {
        if (response.data.status) {
          if (token) {
            setVideos(response.data._data)
            toast.success(response.data.msg)
          }
        }
        else {
          toast.info(response.data.msg)
        }
      })
      .catch((error) => {
        toast("Something went wrong...!")
      })
  }, [token,videoviews])

  let handleincrementviews=(videoId)=>{
    axios.post(`https://youtube-server-all.up.railway.app/api/video/increment-views?id=${videoId}`)
    .then((response)=>{
      if(response.data.status){
        toast.success(response.data.msg)
        setVideoviews(!videoviews)
      }
      else{
        toast.info(response.data.msg)
      }
    })
    .catch((error)=>{
      toast.error("Something went wrong...!")
    })
  }

  return (
    <>

      {
        searchedvideos && searchedvideos.length > 0 ?
          searchedvideos.map((items, index) => {
            return (
              <div className="grid grid-cols-[20%_auto] gap-5 w-full">
                <img src="" alt=""  className=''/>
                <div className="flex flex-col gap-3 border">
                  <h1>{items.videotitle}</h1>
                  <h2>{items.likes}</h2>
                </div>
              </div>
            )
          })
          :
          <div className='grid lg:grid-cols-4 sm:grid-cols-2 items-center gap-2 grid-cols-1 lg:m-2'>

            {

              videos.length > 0 ?
                videos.sort(() => Math.random - 0.5).map((video, index) => (
                  video.visibility == "Public" ?

                    <Link key={index} href={`/watch/${video._id}`}>
                      <div className="border border-gray-300 lg:p-2 lg:m-2 rounded-lg h-[330px]" onClick={()=>handleincrementviews(video._id)}>
                        <img src={"https://youtube-server-all.up.railway.app/uploads/videos/thumbnails/" + video.thumbnail} alt={video.videotitle} className="w-full h-50 object-cover rounded-md mb-2" />
                        <div className="flex gap-2 p-2">
                          <img src={"https://youtube-server-all.up.railway.app/uploads/users/" + video.videouploader.image} alt={video.videouploader.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <h1 className="text-lg font-bold">{video.videotitle}</h1>
                            <h2 className="text-md text-gray-600">{video.videouploader.channel_name}</h2>
                            <p className="text-sm">{video.description.length > 30 ? video.description.substring(0, 40) + "..." : video.description}</p>
                            <p>{video.views} views | {new Date(video.uploadDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    :

                    ""
                ))
                :
                <div className="bg-green-300 p-[25px] w-full mt-[30px]">
                  User Not Found..! & No any videos. Please register or login User & upload a video if you want to watch.
                </div>
            }
          </div>
      }

    </>
  )
}
