'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { FaPlay, FaDownload, FaClock, FaUser } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'

export default function ViewDownloadedVideos() {
    let { userid } = useParams()
    let [downloadvideos, setdownloadvideos] = useState([])
    let [videosWithDetails, setVideosWithDetails] = useState([])
    let [loading, setLoading] = useState(true)
    let [downloading, setDownloading] = useState(null)

    // Fetch downloaded videos list
    useEffect(() => {
        if (userid) {
            fetchDownloadedVideos()
        }
    }, [userid])

    const fetchDownloadedVideos = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`https://youtube-server-all.up.railway.app/api/video/download-video/view?id=${userid}`)
            
            if (response.data.status == true && response.data._data && response.data._data.length > 0) {
                setdownloadvideos(response.data._data)
                // Fetch full video details for each download
                await fetchVideoDetails(response.data._data)
                toast.success(response.data.msg)
            }
            else {
                setdownloadvideos([])
                setVideosWithDetails([])
                if (!response.data.status) {
                    toast.info(response.data.msg)
                }
            }
        } catch (error) {
            
            setdownloadvideos([])
            setVideosWithDetails([])
            toast.error("Failed to fetch downloaded videos")
        } finally {
            setLoading(false)
        }
    }

    // Fetch full video details
    const fetchVideoDetails = async (downloads) => {
        try {
            const videosDetailPromises = downloads.map(download =>
                axios.post(`https://youtube-server-all.up.railway.app/api/video/view-video?id=${download.videoid}`)
                    .then(res => {
                        if (res.data.status && res.data._data) {
                            return {
                                downloadId: download._id,
                                ...res.data._data
                            }
                        }
                        return null
                    })
                    .catch(() => {
                        toast.error("Failed to fetch video details")
                        return null
                    })
            )
            const videosDetails = await Promise.all(videosDetailPromises)
            const validVideos = videosDetails.filter(v => v !== null)
            
            if (validVideos.length === 0) {
                toast.warning("No video details could be loaded")
            }
            setVideosWithDetails(validVideos)
        } catch (error) {
            
            toast.error("Failed to load some video details")
        }
    }

    // Handle video download
    const handleDownloadVideo = async (videoId, videoFile) => {
        try {
            setDownloading(videoId)
            
            const url = `https://youtube-server-all.up.railway.app/api/video/download-video/create?id=${userid}`
            const config = { responseType: 'blob' }

            const response = await axios.post(url, {
                videoid: videoId
            }, config)

            // Extract filename from content-disposition header or use default
            const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition']
            let filename = videoFile || `video-${videoId}.mp4`
            if (disposition) {
                const match = disposition.match(/filename="?([^";]+)"?/)
                if (match && match[1]) filename = match[1]
            }

            // Create blob and trigger download
            const blob = new Blob([response.data], { 
                type: response.headers['content-type'] || 'application/octet-stream' 
            })
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(downloadUrl)
            
            toast.success('Video download started')
        } catch (error) {
            
            const errorMsg = error.response?.data?.msg || "Failed to download video"
            toast.error(errorMsg)
        } finally {
            setDownloading(null)
        }
    }

    // Handle delete from downloads
    const handleDeleteDownload = async (downloadId) => {
        try {
            // You may need to create a delete endpoint on backend
            // For now, we'll just remove from state
            setVideosWithDetails(videosWithDetails.filter(v => v.downloadId !== downloadId))
            toast.success("Removed from downloads")
        } catch (error) {
            toast.error("Failed to remove download")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-600">Loading your downloads...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        My Downloads
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {videosWithDetails.length} {videosWithDetails.length === 1 ? 'video' : 'videos'} saved for offline viewing
                    </p>
                </div>

                {/* Videos Grid */}
                {videosWithDetails && videosWithDetails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videosWithDetails.map((video) => (
                            <div
                                key={video.downloadId}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105"
                            >
                                {/* Thumbnail Section */}
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {video.thumbnail ? (
                                        <img
                                            src={`https://youtube-server-all.up.railway.app/uploads/videos/thumbnails/${video.thumbnail}`}
                                            alt={video.videotitle}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                            <span className="text-gray-700 text-4xl">🎬</span>
                                        </div>
                                    )}
                                    
                                    {/* Overlay with action buttons */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <Link
                                            href={`/watch/${video._id}`}
                                            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200 flex items-center gap-2"
                                            title="Watch video"
                                        >
                                            <FaPlay className="text-lg" />
                                            <span className="hidden sm:inline">Watch</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDownloadVideo(video._id, video.videofile)}
                                            disabled={downloading === video._id}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white p-3 rounded-full transition-colors duration-200 flex items-center gap-2"
                                            title="Download video"
                                        >
                                            <FaDownload className={downloading === video._id ? 'animate-spin' : ''} />
                                            <span className="hidden sm:inline">{downloading === video._id ? 'Downloading...' : 'Download'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4">
                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                        {video.videotitle}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {video.videodescription || "No description available"}
                                    </p>

                                    {/* Metadata */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        {video.videouploader?.username && (
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-blue-500" />
                                                <span>{video.videouploader.username}</span>
                                            </div>
                                        )}
                                        {video.videoduration && (
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-green-500" />
                                                <span>{video.videoduration}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {video.video_tags && video.video_tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {video.video_tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {video.video_tags.length > 3 && (
                                                <span className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                                                    +{video.video_tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons - Mobile */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
                                        <Link
                                            href={`/watch/${video._id}`}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                                        >
                                            <FaPlay /> Watch
                                        </Link>
                                        <button
                                            onClick={() => handleDownloadVideo(video._id, video.videofile)}
                                            disabled={downloading === video._id}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                                        >
                                            <FaDownload className={downloading === video._id ? 'animate-spin' : ''} />
                                            {downloading === video._id ? 'Downloading' : 'Download'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDownload(video.downloadId)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <MdDeleteOutline className="text-lg" />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Button - Desktop */}
                                <button
                                    onClick={() => handleDeleteDownload(video.downloadId)}
                                    className="hidden md:flex absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    title="Remove from downloads"
                                >
                                    <MdDeleteOutline className="text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="mb-6">
                            <FaDownload className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            No Downloaded Videos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            You haven't downloaded any videos yet. Download videos to watch them offline!
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Explore Videos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
