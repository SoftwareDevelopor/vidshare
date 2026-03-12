'use client'
import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiDeleteBin5Line, RiPlayListAddLine } from 'react-icons/ri'
import { MdFileDownload, MdOutlineWatchLater } from 'react-icons/md'
import { FaPlay } from 'react-icons/fa';
import { FiXSquare } from 'react-icons/fi'
import { toast } from 'react-toastify';

export default function VideosSlider({ id }) {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    let [videos, setvideos] = useState([])

    let [ImagePath, setImagePath] = useState("")

    let [name, setname] = useState('')

    let [channelname, setchannelname] = useState('')

    let [visibility, setVisibility] = useState(false)

    let [playlists, setplaylists] = useState([])

    let [deletevideo,setdeletevideo]=useState(false)

    let [VIDEOID, setVIDEOID] = useState([])

    let [updatePlaylistModal, setupdatePlaylistModal] = useState(false)

    let [watchlatervideoid, setwatchlatervideoid] = useState([])

    useEffect(() => {
        axios.post(`https://youtube-server-omega.vercel.app/api/auth/viewProfileById?id=${id}`)
            .then((response) => {
                setImagePath(response.data.imagepath + response.data._data.image)
                setvideos(response.data._data.videoIds)
                setplaylists(response.data._data.playlist)
                setname(response.data._data.name)
                setchannelname(response.data._data.channel_name)
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }, [id,deletevideo])

    let videoidinstateUpdate = (ID) => {
        if (!VIDEOID.includes(ID)) {
            setVIDEOID([...VIDEOID, ID])
            setupdatePlaylistModal(true)
        }
        else {
            setupdatePlaylistModal(false)
            toast.info("This video is already in the playlist...!")
        }
    }

    let handleUpdatePlaylist = (playlistid) => {
        axios.post(`https://youtube-server-omega.vercel.app/api/video/update-playlist?id=${playlistid}`, {
            videoids: VIDEOID
        })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.msg)
                    setupdatePlaylistModal(false)
                }
                else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let addToWatchlater = (videoid) => {
        if (!watchlatervideoid.includes(videoid)) {
            setwatchlatervideoid([...watchlatervideoid, videoid])
        }
        axios.post(`https://youtube-server-omega.vercel.app/api/video/watch-later/add-video-watch-later?id=${id}`,{
            VIDEOID:watchlatervideoid
        })
        .then((response)=>{
            console.log(response.data)
            if(response.data.status == true){
                toast.success(response.data.msg)
            }
            else{
                toast.info(response.data.msg)
            }
        }).catch((error)=>{
            toast.error("Something went wrong...!")
        })
    }

    let deleteVideo=(deleteVideoId)=>{
        if(confirm("Are you sure want to delete this video ?")){
            axios.post(`https://youtube-server-omega.vercel.app/api/video/delete-video/${deleteVideoId}`)
            .then((response)=>{
                if(response.data.status==true){
                    toast.success(response.data.msg)
                    setdeletevideo(!deletevideo)
                }
                else{
                    toast.info(response.data.msg)
                }
            }).catch((error)=>{
                toast.error("Something went wrong...!")
            })
        }
    }

    return (
        <>

            <div className='w-full h-full overflow-hidden grid lg:grid-cols-4 grid-cols-2 items-center gap-3' id='videos'>
                {
                    videos.length > 4 ?
                        videos.map((video, index) => {

                            return (
                                <Slider {...settings}>
                                    <div>

                                        <Link href={`/watch/${video._id}`} key={index}>
                                            <div className="border border-gray-300 lg:m-2 rounded-lg h-[330px] group relative hover:bg-gray-100">
                                                <img src={"https://youtube-server-omega.vercel.app/uploads/videos/thumbnails/" + video.thumbnail} alt={video.videotitle} className="w-full h-50 object-cover rounded-md mb-2" />
                                                <div className="flex gap-2 p-2">
                                                    <img src={ImagePath} alt={name} className="w-10 h-10 rounded-full" />
                                                    <div>
                                                        <h1 className="text-lg font-bold">{video.videotitle}</h1>
                                                        <h2 className="text-md text-gray-600">{channelname}</h2>
                                                        <p className="text-sm">{video.description.length > 40 ? video.description.substring(0, 80) + "..." : video.description}</p>
                                                    </div>
                                                </div>

                                                <div className='w-15 h-15 rounded-full hidden absolute top-1.5 bg-gray-300 group-hover:flex justify-center items-center end-1.5' onClick={() => setVisibility(!visibility)}><BsThreeDotsVertical className='text-2xl font-bold' /></div>

                                                <div className={` flex-col gap-1 border absolute top-[65px] bg-white end-1 rounded-lg w-[150px] ${visibility ? 'group-hover:flex' : 'hidden'}`}>
                                                    <div className='flex items-center gap-2 hover:bg-cyan-100 p-2 rounded-lg cursor-pointer' >
                                                        <RiDeleteBin5Line /> <span>Delete Playlist</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 hover:bg-cyan-100 p-2 rounded-lg cursor-pointer' >
                                                        <RiPlayListAddLine /> <span>Add to Playlist</span>
                                                    </div>
                                                    <div className='flex items-center gap-2  hover:bg-cyan-100 p-2 rounded-lg cursor-pointer'>
                                                        <MdOutlineWatchLater /> <span>Add to Watch Later</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 hover:bg-cyan-100 p-2 rounded-lg cursor-pointer'>
                                                        <MdFileDownload /> <span>Download</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                </Slider>
                            )
                        })
                        :
                        videos.map((video, index) => {
                            return (
                                <div className="border border-gray-300 lg:m-2 rounded-lg h-[330px] group relative hover:bg-gray-100" key={index} onMouseLeave={() => setVisibility(false)}>
                                    <Link href={`/watch/${video._id}`} >
                                        <img src={"https://youtube-server-omega.vercel.app/uploads/videos/thumbnails/" + video.thumbnail} alt={video.videotitle} className="w-full h-50 object-cover rounded-md mb-2" />
                                        <div className="flex gap-2 p-2">
                                            <img src={ImagePath} alt={name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h1 className="text-lg font-bold">{video.videotitle}</h1>
                                                <h2 className="text-md text-gray-600">{channelname}</h2>
                                                <p className="text-sm">{video.description.length > 40 ? video.description.substring(0, 80) + "..." : video.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='w-15 h-15 rounded-full hidden absolute top-1.5 bg-gray-300 group-hover:flex justify-center items-center end-1.5' onClick={() => setVisibility(!visibility)} ><BsThreeDotsVertical className='text-2xl font-bold' /></div>

                                    <div className={` flex-col gap-1.5 border absolute top-[65px] bg-white end-1 rounded-lg w-[150px] ${visibility ? 'group-hover:flex' : 'hidden'}`}>
                                        <div onClick={()=>deleteVideo(video._id)} className='flex items-center gap-2 hover:bg-cyan-100 p-1 rounded-lg cursor-pointer'>
                                            <RiDeleteBin5Line /> <span>Delete Video</span>
                                        </div>
                                        <div className='flex items-center gap-2 hover:bg-cyan-100 p-1 rounded-lg cursor-pointer' onClick={() => videoidinstateUpdate(video._id)}>
                                            <RiPlayListAddLine /> <span>Add to Playlist</span>
                                        </div>
                                        <div className='flex items-center gap-2  hover:bg-cyan-100 p-1 rounded-lg cursor-pointer' onClick={() => addToWatchlater(video._id)}>
                                            <MdOutlineWatchLater /> <span>Add to Watch Later</span>
                                        </div>
                                    </div>

                                </div>

                            )
                        })
                }
            </div>

            <div className={`fixed top-1/2 left-1/2 -translate-1/2 lg:max-w-6xl h-[450px] z-[999] w-[90%] border bg-white rounded-xl updatemodal ${updatePlaylistModal ? 'block' : 'hidden'}`}>
                <h1 className='text-2xl font-bold p-2 border-b-2'>Adding and Updating Playlist</h1>
                <span className='text-2xl font-bold absolute top-1 end-3 cursor-pointer' onClick={() => setupdatePlaylistModal(false)}>
                    <FiXSquare className='text-4xl font-extrabold' />
                </span>
                <div className="grid lg:grid-cols-5 items-center gap-4 m-3 overflow-auto">
                    {playlists && playlists.length > 0 ? (
                        playlists.map((playlist, index) => (

                            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg relative transition-shadow  cursor-pointer" onClick={() => handleUpdatePlaylist(playlist._id)}>
                                <div className="relative">
                                    {playlist.image ? (
                                        <>
                                            <img
                                                src={`https://youtube-server-omega.vercel.app/uploads/videos/playlists/${playlist.image}`}
                                                alt={playlist.name}
                                                className="w-full h-20 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <FaPlay className="text-black text-4xl" />
                                            </div>

                                        </>
                                    ) : (
                                        <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-1.5">
                                    <h3 className="text-lg font-semibold text-white truncate">{playlist.name}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
                                    <div className=" text-xs text-gray-500">
                                        {playlist.videoids?.length || 0} video{playlist.videoids?.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-400">No playlists yet. Create one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
