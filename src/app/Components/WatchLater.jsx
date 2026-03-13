import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'


export default function WatchLater({ id }) {

  let [imagePath, setimagePath] = useState("")
  let [watchlatervideos, setwatchlatrvideos] = useState([])
  let [user, setuser] = useState('')
  let [updatewatchlater,setupdatewatchlater]=useState(false)


  useEffect(() => {
    axios.post(`https://youtube-server-all.up.railway.app/api/video/watch-later/view-all-videos-watch-later?id=${id}`)
      .then((response) => {
        if (response.data.status == true) {
          toast.success(response.data.msg)
          setimagePath(response.data.imagepath)
          setuser(response.data._data.userId._id)
          setwatchlatrvideos(response.data._data.videos)
        }
        else{
          toast.info(response.data.msg)
        }
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }, [id,updatewatchlater])

  // console.log(watchlatervideos)

  let handleDeleteVideosInWatchLater = (VideoId) => {
    axios.post(`https://youtube-server-all.up.railway.app/api/video/watch-later/update-watch-later?id=${id}`, {
      videoid: VideoId
    })
      .then((response) => {
        if(response.data.status==true){
          toast.success(response.data.msg)
          setupdatewatchlater(!updatewatchlater)
        }
        else{
          toast.info(response.data.msg)
        }
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }

  return (
    <>

      <div className="grid grid-cols-1 items-center gap-6 m-3" id='watch-later'>

        {
          watchlatervideos && id === user && watchlatervideos.length > 0 ?

            watchlatervideos.map((v, i) => {
              return (

                <Link href={`/watch/${v._id}`}>
                  <div key={i} className=" grid lg:grid-cols-[40%_auto] gap-5 p-2 rounded-xl bg-gray-50 group hover:bg-gray-100 relative">
                    <img src={imagePath + "videos/thumbnails/" + v.thumbnail} alt="" className='w-full rounded-xl' />
                    <div className=" w-full pt-5">
                      <h1 className='text-2xl font-extrabold'>{v.videotitle}</h1>
                      <div className="flex gap-3 items-center mt-3">
                        <img src={imagePath + "users/" + v.videouploader.image} alt="" className='w-15 h-15 rounded-full' />
                        <div>
                          <h2 className='text-xl font-bold'>{v.videouploader.channel_name}</h2>
                          <h3 className='text-xl font-semibold'>{v.videouploader.name}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center pt-3">
                        <p className=' text-gray-500'>{v.likes} likes</p>
                        <p className=' text-gray-500'>{v.views} views</p>
                      </div>
                    </div>
                    <span className='absolute top-2 end-2 w-10 h-10 rounded-full border justify-center items-center  hidden group-hover:flex' onClick={() => handleDeleteVideosInWatchLater(v._id)}><AiFillDelete className='text-xl text-gray-800' /></span>
                  </div>

                </Link>

              )
            })

            :

            <p>No any videos in this watch later section....!</p>
        }

      </div>

    </>
  )
}
