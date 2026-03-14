'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Comments from './Comments'
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { FaCirclePause, FaCirclePlay, FaDownload, FaShare } from 'react-icons/fa6'
import { FaSave, FaVolumeUp, FaFacebookF, FaTwitter, FaLinkedinIn, FaLink, FaInstagram } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RiReplay10Line, RiForward10Line } from 'react-icons/ri'
import { SlSpeedometer } from 'react-icons/sl'
import { FacebookShare, InstapaperShare, LinkedinShare, TwitterShare, WhatsappShare } from 'react-share-kit'

export default function WatchVideos() {
    const { id } = useParams()
    const [video, setVideo] = useState('')
    const [likeDisabled, setLikeDisabled] = useState(false)
    const [subscribe, setSubscribe] = useState(false)
    const [dislikeDisabled, setDislikeDisabled] = useState(false)
    let [videos, setVideos] = useState([])
    let [user, setuser] = useState({})
    let [isplaying, setisplaying] = useState(false)
    const videoRef = useRef(null)
    let [speedmodal, setspeedmodal] = useState(false)
    let [volumemodal, setvolumemodal] = useState(false)
    let [share, setshare] = useState(false)


    useEffect(() => {
        if (id) {
            axios.post(`https://youtube-server-a5ha.onrender.com/api/video/view-video?id=${id}`)
                .then((res) => {
                    if (res.data.status) {
                        setVideo(res.data._data)
                    }
                })
                .catch(() => toast.error("Something went wrong...!"))
        }
    }, [id, likeDisabled, dislikeDisabled])

    useEffect(() => {
        axios.post("https://youtube-server-a5ha.onrender.com/api/video/getallvideos")
            .then((response) => {
                setVideos(response.data._data)
            })
            .catch((error) => {
                toast.error("Something went wrong...!")
            })
    }, [])

    let remainingvideos = videos.filter((v, Id) => v._id != id)

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
                    setuser(res.data._data)
                })
                .catch((error) => {
                    toast.error("Error fetching profile...!");
                });
        }
    }, [token]);

    let handleIncrementLike = (e) => {
        e.preventDefault()
        axios.post(`https://youtube-server-a5ha.onrender.com/api/video/incrementlikes?id=${id}`, {
            likedByUserIds: user._id
        })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.msg)
                    setLikeDisabled(!likeDisabled)
                } else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let handleDecrementLike = (e) => {
        e.preventDefault()
        axios.post(`https://youtube-server-a5ha.onrender.com/api/video/decrement-like?id=${id}`, {
            dislikedByUserIds: user._id
        })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.msg)
                    setDislikeDisabled(!dislikeDisabled)
                } else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let handleSubscribe = (e) => {
        e.preventDefault()
        let videouploaderid = video.videouploader._id
        axios.post(`https://youtube-server-a5ha.onrender.com/api/auth/subscribe/?id=${videouploaderid}`, {
            channel_ids: user._id
        })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.msg)
                    setSubscribe(true)
                } else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let handleUnsubscribe = (e) => {
        e.preventDefault()
        let videouploaderid = video.videouploader._id
        axios.post(`https://youtube-server-a5ha.onrender.com/api/auth/decreasesubscribers?id=${videouploaderid}`, {
            channel_ids: user._id
        })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.msg)
                    setSubscribe(false)
                } else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    let videoref = videoRef.current
    let handlespeed = (e) => {
        e.preventDefault()
        let selectedspeed = e.target.innerText
        switch (selectedspeed) {
            case '0.25x':
                videoref.playbackRate = 0.25
                break;
            case '0.5x':
                videoref.playbackRate = 0.5
                break;
            case '0.75x':
                videoref.playbackRate = 0.75
                break;
            case 'Normal':
                videoref.playbackRate = 1
                break;
            case '1.25x':
                videoref.playbackRate = 1.25
                break;
            case '1.5x':
                videoref.playbackRate = 1.5
                break;
            case '2x':
                videoref.playbackRate = 2
                break;
            default:
                videoref.playbackRate = 1
        }
    }
    const formatDuration = () => {
        const d = videoRef.current?.duration ?? 0
        if (!d || isNaN(d) || !isFinite(d)) return '0:00'
        const h = Math.floor(d / 3600)
        const left = d % 3600
        const m = Math.floor(left / 60)
        const s = Math.floor(left % 60)
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        return `${m}:${String(s).padStart(2, '0')}`
    }
    let handlePlayPause = (e) => {
        e.preventDefault()

        if (videoref) {
            if (videoref.paused) {
                videoref.play()
            }
            else {
                videoref.pause()
            }
        }
        setisplaying(!isplaying)
    }
    let handleBackward = (e) => {
        e.preventDefault()
        if (videoref) {
            videoref.currentTime = videoref.currentTime - 10
        }
    }
    let handleForward = (e) => {
        e.preventDefault()
        if (videoref) {
            videoref.currentTime = videoref.currentTime + 10
        }
    }
    let handleDownload = async (videoID) => {
        try {
            const url = `https://youtube-server-a5ha.onrender.com/api/video/download-video/create?id=${user._id}`
            const config = { responseType: 'blob' }
            if (token) config.headers = { authorization: `Bearer ${token}` }
            const response = await axios.post(url, {
                videoid: videoID
            }, config)
            const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition']
            let filename = video?.videofile || `video-${videoID}.mp4`
            if (disposition) {
                const match = disposition.match(/filename="?([^";]+)"?/)
                if (match && match[1]) filename = match[1]
            }

            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' })
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(downloadUrl)
            toast.success('Download started...!')
            toast.info('Video Downloaded Successfully...! Check your downloads folder...!')
        } catch (error) {
            toast.error('Download failed')
        }
    }
    let handleWatchLater = (videoid) => {
        let userID = user._id
        axios.post(`https://youtube-server-a5ha.onrender.com/api/video/watch-later/add-video-watch-later?id=${userID}`, {
            VIDEOID: videoid
        })
            .then((response) => {
                if (response.data.status == true) {
                    toast.success(response.data.msg)
                }
                else {
                    toast.info(response.data.msg)
                }
            }).catch((error) => {
                toast.error("Something went wrong...!")
            })
    }

    const [copied, setCopied] = useState(false)

    const handleCopyLink = () => {
        try {
            const shareUrl = window.location.href
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    setCopied(true)
                    toast.success('Link copied to clipboard')
                    setTimeout(() => setCopied(false), 2000)
                })
                .catch(() => toast.error('Unable to copy'))
        } catch (err) {
            toast.error('Copy not supported')
        }
    }

    const shareUrl = (typeof window !== 'undefined') ? window.location.href : `https://vidshare-khaki.vercel.app/watch/${video?._id}`

    return (
        <>

            <div className="grid md:grid-cols-[55%_auto] grid-cols-1 gap-6 px-4 py-6">
                <div className="flex-1">
                    {video ? (
                        <div className="space-y-4">
                            <div className="w-full aspect-video border-4 border-gray-300 rounded-xl group relative">
                                <video
                                    id='video'
                                    ref={videoRef}
                                    className="w-full h-full rounded-xl" onPlay={() => setisplaying(true)} onPause={() => setisplaying(false)}
                                    onLoadedMetadata={() => { }}
                                >
                                    <source src={`https://youtube-server-a5ha.onrender.com/uploads/videos/videofile/${video.videofile}`} type="video/mp4" />
                                    <source src={`https://youtube-server-a5ha.onrender.com/uploads/videos/videofile/${video.videofile}`} type="video/webm" />

                                    <source src={`https://youtube-server-a5ha.onrender.com/uploads/videos/videofile/${video.videofile}`} type="video/ogg" />

                                    <source src={`https://youtube-server-a5ha.onrender.com/uploads/videos/videofile/${video.videofile}`} type="video/webm" />
                                </video>
                                <div className="absolute top-1/2 left-1/2 -translate-1/2 border hidden group-hover:block" onClick={handlePlayPause}>
                                    {isplaying ? <FaCirclePause className='lg:text-8xl text-xl font-extrabold text-red-700' /> : <FaCirclePlay className='lg:text-8xl text-xl font-extrabold text-red-700' />}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full px-2.5 pb-[25px] hidden group-hover:block">
                                    <div className="flex items-center justify-between pb-2">
                                        <div className="flex gap-3.5 items-center">
                                            <button type="button" className='relative' onMouseOver={() => setvolumemodal(true)} onMouseOut={() => setvolumemodal(false)}>
                                                <FaVolumeUp className='text-2xl ' />
                                                <div className={`absolute bottom-7 left-1 bg-gray-800 text-white text-sm rounded py-1 px-2 ${volumemodal ? '' : 'hidden'}`} onMouseOver={() => setvolumemodal(true)}>
                                                    <p className="text-center">Volume</p>
                                                    <ul className="mt-1">
                                                        <li onClick={() => videoref.volume = 0} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">Mute</li>
                                                        <li onClick={() => videoref.volume = 0.25} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">25%</li>
                                                        <li onClick={() => videoref.volume = 0.5} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">50%</li>
                                                        <li onClick={() => videoref.volume = 0.75} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">75%</li>
                                                        <li onClick={() => videoref.volume = 1} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">100%</li>
                                                    </ul>
                                                </div>
                                            </button>
                                            <button type="button" onClick={handleBackward}><RiReplay10Line className='text-2xl ' /></button>
                                            <button type="button" onClick={handleForward}><RiForward10Line className='text-2xl ' /></button>
                                        </div>
                                        <div className="flex gap-3.5 items-center">
                                            <button type="button" className="relative" onMouseOver={() => setspeedmodal(true)} onMouseOut={() => setspeedmodal(false)}><SlSpeedometer className='text-2xl text-black' />
                                                <div className={`absolute bottom-7 -left-5 bg-gray-800 text-white text-sm rounded py-1 px-2 ${speedmodal ? '' : 'hidden'}`} onMouseOver={() => setspeedmodal(true)}>
                                                    <p className="text-center">Speed</p>
                                                    <ul className="mt-1">
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">0.25x</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">0.5x</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">0.75x</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">Normal</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">1.25x</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">1.5x</li>
                                                        <li onClick={handlespeed} className="px-2 py-1 hover:bg-gray-700 cursor-pointer">2x</li>
                                                    </ul>
                                                </div>
                                            </button>
                                            {formatDuration()}
                                        </div>
                                    </div>

                                    <hr className=' border-2 rounded-xl border-gray-400' />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold">{video.videotitle}</h1>
                            <div className="flex gap-5 items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <Link href={video.videouploader._id == user._id ? '/user-channel' : `/channel-page/${video.videouploader._id}`}>
                                        <img src={`https://youtube-server-a5ha.onrender.com/uploads/users/${video.videouploader.image}`} alt="" className='w-10 h-10 rounded-full' />
                                    </Link>
                                    {
                                        subscribe ?


                                            <button type="button" onClick={handleUnsubscribe} className='px-5 border py-3 rounded-[35px]'>UnSubscribe</button>

                                            :

                                            <button type="button" onClick={handleSubscribe} className='px-5 border py-3 rounded-[35px]'>Subscribe</button>

                                    }

                                </div>
                                <div className=" flex gap-x-5 items-center">
                                    <div className='flex gap-2 items-center bg-gray-300 px-[25px] py-3 rounded-4xl'>
                                        <AiOutlineLike
                                            onClick={handleIncrementLike}
                                            className={`text-3xl font-bold ${likeDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-blue-600'}`}
                                        /> {video.likes} likes
                                        <span className='text-4xl font-semibold'> | </span>
                                        <AiOutlineDislike
                                            onClick={handleDecrementLike}
                                            className={`text-3xl font-bold ${dislikeDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-600'}`}
                                        />
                                    </div>
                                    <button type="button" className='cursor-pointer' onClick={() => setshare(true)}><FaShare className='text-3xl font-bold' /></button>
                                    <button type="button" className='cursor-pointer' onClick={() => handleDownload(video._id)}><FaDownload className='text-3xl font-bold' /></button>
                                    <button type="button" className='cursor-pointer' onClick={() => handleWatchLater(video._id)}><FaSave className='text-3xl font-bold' /></button>
                                    {/* this button above 'FaSave' is nothing but a watch later btn.*/}
                                </div>
                            </div>
                            <p className='text-md font-bold text-gray-500'>Uploaded at :-- {new Date(video.uploadDate).toLocaleDateString()}</p>
                            <p className="text-gray-700">{video.description}</p>
                            <h3 className='text-lg font-bold mt-3'>Comments</h3>
                            <Comments comments={video} />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex flex-col gap-[25px] items-center bg-sky-50 rounded-2xl p-3 group">
                    {
                        remainingvideos && remainingvideos.length > 0 ?
                            remainingvideos.sort(() => Math.random() - 0.5).map((v, i) => {
                                return (
                                    <Link href={`/watch/${v._id}`} key={i}>
                                        <div className="w-full flex gap-2 h-[200px] hover:bg-gray-300">
                                            <img src={"https://youtube-server-a5ha.onrender.com/uploads/videos/thumbnails/" + v.thumbnail} alt={v.videotitle} className='max-w-[350px]' />
                                            <div className="flex gap-2  flex-col">
                                                <h1 className="text-2xl font-bold">{v.videotitle}</h1>
                                                <div className='flex gap-2 items-center'>
                                                    <Link href={'/user-channel'}>
                                                        <img src={"https://youtube-server-a5ha.onrender.com/uploads/users/" + v.videouploader.image} alt="" className='w-10 h-10 rounded-full' />
                                                    </Link>
                                                    <div>
                                                        <h2 className='text-gray-600 text-xl font-semibold'>{v.videouploader.channel_name}</h2>

                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span> {v.views} views</span>
                                                            <span>&bull;</span>
                                                            <span>{new Date(v.uploadDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                            :
                            <p className='text-center font-bold text-lg'>Oops..! No any remaining videos..! you have to upload at least one more video...!</p>
                    }
                </div>
            </div>


            {share && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setshare(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg p-6 relative shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button aria-label="Close" className="absolute top-3 right-3 text-2xl font-bold text-gray-600" onClick={() => setshare(false)}>&times;</button>
                        <h2 className="text-2xl font-semibold mb-1">Share</h2>
                        <p className="text-sm text-gray-500 mb-4">Share this video with friends or copy the link.</p>

                        <div className="flex gap-2 items-center mb-4">
                            <input readOnly value={shareUrl} className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800" />
                            <button onClick={handleCopyLink} className="ml-2 bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2">
                                <FiCopy /> {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <div className="flex gap-3 mb-3">
                            <FacebookShare url={shareUrl} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100">
                                <FaFacebookF className="text-blue-600" /> <span className="text-sm">Facebook</span>
                            </FacebookShare>
                            <TwitterShare url={shareUrl} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100">
                                <FaTwitter className="text-sky-500" /> <span className="text-sm">Twitter</span>
                            </TwitterShare>
                            <LinkedinShare url={shareUrl} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100">
                                <FaLinkedinIn className="text-blue-700" /> <span className="text-sm">LinkedIn</span>
                            </LinkedinShare>
                            <WhatsappShare url={shareUrl} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100">
                                <FaShare className="text-green-500" /> <span className="text-sm">WhatsApp</span>
                            </WhatsappShare>

                            <InstapaperShare url={shareUrl} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100">
                                <FaInstagram className="text-green-500" /> <span className="text-sm">Instagram</span>
                            </InstapaperShare>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaLink />
                            <span>Or share the link directly</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
