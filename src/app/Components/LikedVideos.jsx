'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'

export default function LikedVideos({id}) {

    const [likedVideos, setLikedVideos] = useState([])
    const [imagePath, setImagePath] = useState("")
    const [user, setUser] = useState('')
    const [updateState, setUpdateState] = useState(false)

    useEffect(() => {
        if (id) {
            axios.post(`http://localhost:5000/api/video/liked-videos/view?id=${id}`)
                .then((response) => {
                    if (response.data.status === true) {
                        toast.success(response.data.msg)
                        setImagePath(response.data.imagepath)
                        setLikedVideos(response.data._data)
                    } else {
                        toast.info(response.data.msg)
                    }
                }).catch(() => {
                    toast.error("Something went wrong...!")
                })
        }
    }, [id, updateState])

    const handleUnlike = (videoId) => {
        axios.post(`http://localhost:5000/api/video/decrement-like?id=${videoId}`, {
            dislikedByUserIds: id
        })
        .then((response) => {
            if (response.data.status === true) {
                toast.success(response.data.msg)
                setLikedVideos(likedVideos.filter(v => v._id !== videoId))
            } else {
                toast.info(response.data.msg)
            }
        }).catch(() => {
            toast.error("Something went wrong...!")
        })
    }

    return (
        <>
            <h2 className='text-3xl font-bold my-4'>Liked Videos</h2>
            <div className="grid grid-cols-1 items-center gap-6 m-3" id='liked-videos'>
                {likedVideos && likedVideos.length > 0 ? (
                    likedVideos.map((v, i) => (
                        <Link href={`/watch/${v._id}`} key={i}>
                            <div className=" grid lg:grid-cols-[40%_auto] gap-5 p-2 rounded-xl bg-gray-50 group hover:bg-gray-100 relative">
                                <img
                                    src={imagePath + "videos/thumbnails/" + v.thumbnail}
                                    alt=""
                                    className='w-full rounded-xl'
                                />
                                <div className=" w-full pt-5">
                                    <h1 className='text-2xl font-extrabold'>{v.videotitle}</h1>
                                    <div className="flex gap-3 items-center mt-3">
                                        <img
                                            src={imagePath + "users/" + v.videouploader.image}
                                            alt=""
                                            className='w-15 h-15 rounded-full'
                                        />
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
                                <span
                                    className='absolute top-2 end-2 w-10 h-10 rounded-full border justify-center items-center hidden group-hover:flex cursor-pointer'
                                    onClick={(e) => { e.preventDefault(); handleUnlike(v._id) }}
                                >
                                    <AiFillDelete className='text-xl text-gray-800' />
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No any Liked Videos...!</p>
                )}
            </div>
        </>
    )
}
