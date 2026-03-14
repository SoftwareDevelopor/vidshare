'use client'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsPlusCircleFill } from 'react-icons/bs'
import { MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'

export default function PlaylistVideos() {
  let { id } = useParams()

  let [viewvideosinplaylist, setViewVideosInPlaylist] = useState([])

  let [playlist, setplaylist] = useState({})

  let [user, setuser] = useState({})

  let [playlistimagepath, setplaylistimagepath] = useState("")

  let [addvideosmodal, setaddvideosmodal] = useState(false)

  let [videos, setVideos] = useState([])

  let [VIDEOID, SETVIDEOID] = useState([])

  let [addvideo, setaddvideos] = useState(false)

  let [deletevideo, setdeletevideo] = useState(false)

  useEffect(() => {
    axios.post(`https://youtube-server-a5ha.onrender.com/api/video/view-all-videos-in-playlist?id=${id}`)
      .then((response) => {
        if (response.data.status) {
          setViewVideosInPlaylist(response.data._data.videoids)
          toast.success(response.data.msg)
          setplaylist(response.data._data)
          setuser(response.data._data.userId)
          setplaylistimagepath(response.data.imagepath + response.data._data.image)
        }
        else {
          setViewVideosInPlaylist([])
          toast.info(response.data.msg)
        }
      }).catch(() => {
        setViewVideosInPlaylist([])
        toast.error("Something went wrong...!")
      })
  }, [id, addvideo, deletevideo])

  useEffect(() => {
    axios.post("https://youtube-server-a5ha.onrender.com/api/video/getallvideos")
      .then((response) => {
        if (response.data.status) {
          setVideos(response.data._data)
          toast.success(response.data.msg)
        }
        else {
          toast.info(response.data.msg)
        }
      })
      .catch((error) => {
        toast("Something went wrong...!")
      })
  }, [])

  let handleaddvideos = (i) => {
    if (!VIDEOID.includes(i)) {
      SETVIDEOID([...VIDEOID, i])
    }
    let playlistid = playlist._id
    axios.post(`https://youtube-server-a5ha.onrender.com/api/video/update-playlist?id=${playlistid}`, {
      videoids: VIDEOID
    })
      .then((response) => {
        if (response.data.status == true) {
          toast.success(response.data.msg)
          setaddvideos(!addvideo)
        } else {
          toast.info(response.data.msg)
        }
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }

  let deleteVideoInPlaylist = (videoid) => {
    let playlistid = playlist._id
    axios.post(`https://youtube-server-a5ha.onrender.com/api/video/delete-video-in-playlist?id=${playlistid}`, {
      videoid: videoid
    })
      .then((response) => {
        if (response.data.status == true) {
          toast.success(response.data.msg)
          setdeletevideo(!deletevideo)
        }
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }
  
  return (
    <>
      <div className="grid lg:grid-cols-[45%_auto] gap-[25px] grid-cols-1 p-5 m-3 rounded-xl bg-[#d00224] h-screen relative">
        {
          playlist ?
            <>

              <div className="flex flex-col gap-3">
                <img src={playlistimagepath} alt="" className='w-full rounded-xl' />
                <div className="p-3.5">
                  <h1 className='text-xl font-extrabold mb-2'>{playlist.name}</h1>
                  <p className='text-lg font-medium mb-2'>{playlist.description}</p>
                  <div className="flex gap-5 items-center p-2">
                    <img src={"https://youtube-server-a5ha.onrender.com/uploads/users/" + user.image} alt="" className='max-w-25 max-h-25 w-full rounded-full' />
                    <div>
                      <h2 className='text-lg font-bold'>{user.channel_name}</h2>
                      <h3 className='text-md font-bold'>{user.name}</h3>
                    </div>
                  </div>
                  <p className='text-sm text-gray-400 mt-4'>{new Date(playlist.addedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-3">
                <h1 className='text-2xl font-bold my-3'>All Playlist Videos </h1>

                <div className="grid grid-cols-1 items-center gap-5 group ">

                  {viewvideosinplaylist || viewvideosinplaylist.length > 0 || id ?
                    viewvideosinplaylist.map((video, index) => {
                      return (
                        <Link href={`/watch/${video._id}`}>
                          <div className="grid grid-cols-[30%_auto] gap-3 border p-3 rounded-xl border-gray-800 hover:scale-105 hover:shadow-gray-600 shadow-md relative" key={index}>
                            <span className='absolute top-2 end-2 p-2 border rounded-full' onClick={() => deleteVideoInPlaylist(video._id)}> <MdDeleteOutline className='text-xl' /> </span>
                            <img src={"https://youtube-server-a5ha.onrender.com/uploads/videos/thumbnails/" + video.thumbnail} alt="" className='h-full rounded-lg' />
                            <div className="">
                              <h1 className='text-xl font-bold'>{video.videotitle}</h1>
                              <h1 className='text-lg font-semibold'>{user.channel_name}</h1>
                              <h1>{user.name}</h1>
                            </div>
                          </div>
                        </Link>

                      )
                    })
                    :
                    ''
                  }

                </div>
              </div>
            </>
            :
            <p className='text-md text-center '>No any videos in this playlist...!</p>
        }
        <span className='absolute top-2 end-2 p-2 rounded-full group hover:bg-amber-700 cursor-pointer' onClick={() => setaddvideosmodal(true)}><BsPlusCircleFill className=' text-black text-4xl font-bold scale-105 group-hover:scale-110' /></span>
      </div>

      <div className={`fixed max-w-4xl w-full top-1/2 left-1/2 -translate-1/2 border rounded-xl p-3 bg-white ${addvideosmodal ? '' : 'hidden'}`}>
        <h1 className='text-xl font-bold'>Add Videos In Playlist</h1>
        <span className='text-3xl font-bold absolute top-2 end-2 cursor-pointer ' onClick={() => setaddvideosmodal(false)}>&times;</span>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-center gap-3 overflow-auto">
          {
            videos || videos.length > 0 ?
              videos.map((v, i) => {
                return (
                  <div key={i} className="border border-gray-300 lg:p-1 rounded-lg h-[200px]" onClick={() => handleaddvideos(v._id)}>
                    <img src={"https://youtube-server-a5ha.onrender.com/uploads/videos/thumbnails/" + v.thumbnail} alt={v.videotitle} className="w-full object-cover rounded-md mb-2" />
                    <div className="flex gap-2 p-2">
                      <img src={"https://youtube-server-a5ha.onrender.com/uploads/users/" + v.videouploader.image} alt={v.videouploader.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <h1 className="text-sm font-bold">{v.videotitle}</h1>
                        <h2 className="text-sm text-gray-600">{v.videouploader.channel_name}</h2>
                        <p className="text-sm">{v.description.length > 10 ? v.description.substring(0, 25) + "..." : v.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })
              :

              <p className='text-2xl text-center font-semibold'>No any video available...!</p>
          }
        </div>
      </div>
    </>
  )
}
