'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UploadVideo() {
    const [videopreview, setvideoPreview] = useState(null);
    const [thumbnailpreview, setthumbnailPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [videoFile, setvideoFile] = useState(null)
    let [user, setuser] = useState({})
    

    let route = useRouter()

    let onVideoDrop = (acceptFile) => {
        // console.log(acceptFile)
        if (acceptFile.length > 0) {
            const file = acceptFile[0]
            setvideoFile(file)
            let reader = new FileReader();
            reader.onload = () => {
                setvideoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    let onImageDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            // console.log(file)
            if (1500000 <= file.size <= 2000000) {

                setBannerFile(file);

                const reader = new FileReader();
                reader.onload = () => {
                    setthumbnailPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
            else {
                let fileSizeInMB = file.size * 0.000001
                alert(`Your channel banner image file size of ${fileSizeInMB} MB is not matching the required size. Please upload the image of required size.`)
            }
        }
    };

    const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
        maxFiles: 1,
        onDrop: onImageDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] }
    })

    const { getRootProps: getRootPropsVideo, getInputProps: getInputPropsVideo } = useDropzone({
        maxFiles: 1,
        onDrop: onVideoDrop,
        accept: { 'video/*': ['.mp4', '.mkv', '.amv', '.m4p', '.m4v', '.mpg', '.mpeg', '.WebM'] }
    })

    let token = useSelector((store) => {
        return store.userdetails.token
    })

    useEffect(() => {
         if (token) {
            axios.post('http://localhost:5000/api/auth/view-profile', {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    setuser(res.data._data)
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                });
        }
    }, [token])

    let handleUploadVideo = async (e) => {
        e.preventDefault()
        // Build multipart/form-data payload so multer receives files in req.files
        
        let videoTags=e.target.video_tags.value.split(',')
        
        
        const formData = new FormData();
        formData.append('videotitle', e.target.videotitle.value || '');
        formData.append('description', e.target.description.value || '');
        formData.append('visibility', e.target.visibility.value || '');
        formData.append('agerestriction', e.target.agerestriction.value || '');
        formData.append('videouploader', user._id || '');
        formData.append('video_tags', videoTags || []);
        if (bannerFile) formData.append('thumbnail', bannerFile);
        if (videoFile) formData.append('videofile', videoFile);

        try {
            axios.post('http://localhost:5000/api/video/uploadvideo', formData)
            .then((res) => {
                if (res.data.status) {
                    toast.success(res.data.msg);
                    route.push('/')
                    e.target.reset()
                    setvideoPreview(null)
                    setthumbnailPreview(null)
                    setBannerFile(null)
                    setvideoFile(null)
                } else {
                    toast.error(res.data.msg);
                }
            }).catch((error) => {
                toast.error("An error occurred while uploading the video. Please try again.");
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="max-w-[1200px] mx-auto p-6 my-5 border rounded-lg ">
                <form action="" className='grid lg:grid-cols-[60%_auto] grid-cols-1 flex-col-reverse gap-5 ' onSubmit={handleUploadVideo}>
                    <div className=" w-full flex flex-col gap-2 ">
                        <div className="">
                            <label htmlFor="">Video Title :--</label>
                            <input type="text" name='videotitle' placeholder='Enter the Title of Video...' className='w-full py-2 border ps-3 rounded-lg' />
                        </div>
                        <div className="">
                            <label htmlFor="">Video Description :--</label>
                            <textarea name="description" id="" rows="4" className='border w-full p-2 rounded-lg' placeholder='Enter Video Description...'></textarea>
                        </div>
                        <div className="">
                            <label htmlFor="">Video Visibility :--</label>
                            <select name="visibility" id="" className='border w-full py-2.5 rounded-lg ps-3'>
                                <option value="">Select Visibility Option given below</option>
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="">Video Age Restriction :--</label>
                            <input type="number" placeholder='Enter the Age Restriction for Watching this video...' name='agerestriction' min={'10'} className='w-full py-2 border ps-3 rounded-lg' />
                        </div>
                        <div className="">
                            <label htmlFor="">Video Uploader :--</label>
                            <input type="text" value={user.channel_name} name='videouploader' className='w-full py-2 border ps-3 rounded-lg' />
                        </div>
                        <div className="">
                            <label htmlFor="">Video Tags :--</label>
                            <input type="text" name='video_tags' placeholder='Enter the Tags with Comma separated...' className='w-full py-2 border ps-3 rounded-lg ' />
                        </div>
                    </div>
                    <div className=" w-full">

                        <section className="container p-2 ">
                            <div {...getRootPropsVideo({ className: 'border border-dashed p-4 h-[80px] rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100' })}>
                                <input {...getInputPropsVideo()} />
                                <div className="flex flex-col gap-1 items-center p-2">
                                    <p className=''>Drag 'n' drop Video here, or click to select video file</p>

                                    <p>Video File Size must be less than or equal to 30GB.</p>
                                </div>
                            </div>
                            <aside>
                                {videopreview && (
                                    <div>
                                        <h4 className='mt-4 font-semibold'>Video File Preview</h4>
                                        <video >
                                            <source src={videopreview} type="" />
                                        </video>
                                        {
                                            videoFile && <p className='text-sm text-gray-600 mt-2'>Selected Video:-- {videoFile.name}</p>
                                        }
                                    </div>
                                )}
                            </aside>
                        </section>

                        <section className="container p-2 ">
                            <div {...getRootPropsImage({ className: 'border border-dashed p-4 h-[140px] rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100' })}>
                                <input {...getInputPropsImage()} />
                                <div className="flex flex-col gap-1 items-center p-2">
                                    <p className=''>Drag 'n' drop image here, or click to select Thumbnail file</p>
                                    <p>Your's Video Thumbnail is of maximum resolution 1280 &times; 720 pixels.</p>
                                    <p>File Size must be under 2MB.</p>
                                </div>
                            </div>
                            <aside>
                                {thumbnailpreview && (
                                    <div>
                                        <h4 className='mt-4 font-semibold'>Thumbnail Preview</h4>
                                        <img src={thumbnailpreview} alt="Banner Preview" className="max-w-full mt-4 rounded-lg" />
                                        {bannerFile && <p className="text-sm text-gray-600 mt-2">Selected: {bannerFile.name}</p>}
                                    </div>
                                )}
                            </aside>
                        </section>
                    </div>
                    <button type='submit' className='border w-[150px] px-3 py-3.5 rounded-lg mx-auto'>Upload Video</button>
                </form>

            </div>
        </>
    )
}
