'use client'
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


export default function CreateYoutubeChannel() {

    const [preview, setPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [loading, setLoading] = useState(false);
    let route=useRouter()

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (2000000 <= file.size <= 6000000) {

                setBannerFile(file);

                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
            else{
                let fileSizeInMB=file.size * 0.000001
                alert(`Your channel banner image file size of ${fileSizeInMB} MB is not matching the required size. Please upload the image of required size.`)
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
    });

    let token = useSelector((store) => {
        return store.userdetails.token
    })

    let handleCreateYoutubeChannel = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // First upload the banner image if provided
            if (bannerFile) {
                const formData = new FormData();
                formData.append('singleimage', bannerFile);

                const bannerResponse = await axios.post(
                    'https://youtube-server-a5ha.onrender.com/api/auth/upload-channel-banner',
                    formData,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (!bannerResponse.data.status) {
                    toast.error('Banner upload failed: ' + bannerResponse.data.msg);
                    setLoading(false);
                    return;
                }
            }

            // Then update channel details
            const channelResponse = await axios.post(
                'https://youtube-server-a5ha.onrender.com/api/auth/update-profile',
                {
                    channel_name: e.target.channel_name.value,
                    date_of_birth: e.target.date_of_birth.value,
                    channel_description: e.target.channel_description.value,
                },
                {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                }
            );

            if (channelResponse.data.status) {
                e.target.reset();
                setPreview(null);
                setBannerFile(null);
                route.push('/')

                } else {
                    toast.error('Channel creation failed: ' + channelResponse.data.msg);
            }
        } catch (error) {
            toast.error('An error occurred while creating the channel. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>

            <div className="max-w-4xl w-full p-3 border mx-auto my-3">
                <Link href={'/'} className='flex justify-center items-center my-1.5'>
                    <img src="/logo.png" className='max-w-full h-8' alt="Youtube Logo" />
                </Link>
                <h1 className='text-xl text-center'>Create Youtube Channel :-- </h1>
                <form action="" className='overflow-auto' onSubmit={handleCreateYoutubeChannel}>

                    <div className="mt-1.5">
                        <label htmlFor="">Youtube Channel Name :--</label>
                        <input type="text" name="channel_name" placeholder="User's Youtube Channel Name..." className='w-full my-1 p-2 border rounded-lg' required />
                    </div>

                    <div className="">
                        <label htmlFor="">Your's Date of Birth :--</label>
                        <input type="date" name="date_of_birth" id="" className='border w-full rounded-lg p-2' required />
                    </div>

                    <div className="">
                        <label htmlFor="">Youtube Channel Description :--</label>
                        <textarea name="channel_description" placeholder="Describe your Youtube Channel..." className='w-full my-1 p-2 border rounded-lg' rows="3" required></textarea>
                    </div>

                    <div className="">
                        <label htmlFor="">Youtube Channel Banner :--</label>

                        <section className="container border p-3">
                            <div {...getRootProps({ className: 'border p-4.5 h-[200px] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50' })}>
                                <input {...getInputProps()} />
                                <div className="flex flex-col gap-1 items-center">
                                    <p className=''>Drag 'n' drop banner image here, or click to select files</p>
                                    <p>Your's Channel Banner Size should be less than or equal to 2048 &times; 1152 pixels.</p>
                                    <p>File Size must be under 6MB.</p>
                                </div>
                            </div>
                            <aside>
                                {preview && (
                                    <div>
                                        <h4 className='mt-4 font-semibold'>Banner Preview</h4>
                                        <img src={preview} alt="Banner Preview" className="max-w-full max-h-96 mt-4 rounded-lg" />
                                        {bannerFile && <p className="text-sm text-gray-600 mt-2">Selected: {bannerFile.name}</p>}
                                    </div>
                                )}
                            </aside>
                        </section>

                    </div>
                    <button type="submit" disabled={loading} className='py-3 px-5 my-2 rounded-lg bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                        {loading ? 'Creating Channel...' : 'Create Youtube Channel'}
                    </button>
                </form>
            </div>

        </>
    )
}
