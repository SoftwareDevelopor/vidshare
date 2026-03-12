'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone/';
import { BsPlusCircleFill } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function Playlist({ id }) {

  const [preview, setPreview] = useState(null);

  const [bannerFile, setBannerFile] = useState(null);

  let [playlists, setplaylists] = useState([])
  
  let [openPlaylistModal, setopenPlaylistModal] = useState(false)
  
  let [playlist, setplaylist] = useState(false)
  
  let [deletePlaylist, sedeletetplaylist] = useState(false)

  let handleCreatePlaylist = async (e) => {
    e.preventDefault()
    let createPlaylistFormData = new FormData()
    createPlaylistFormData.append('name', e.target.name.value)
    createPlaylistFormData.append('description', e.target.description.value)
    if (bannerFile) createPlaylistFormData.append('image', bannerFile)
    await axios.post(`http://localhost:5000/api/video/create-playlist?id=${id}`, createPlaylistFormData)
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.msg)
          setplaylist(!playlist)
          setopenPlaylistModal(false)
          e.target.reset()
          setBannerFile(null)
          setPreview(null)
        } else {
          toast.info(response.data.msg)
          e.target.reset()
          setBannerFile(null)
          setPreview(null)
        }
      }).catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    axios.post(`http://localhost:5000/api/video/view-all-playlists?id=${id}`)
      .then((response) => {
        if (response.data.status == true) {
          setplaylists(response.data._data)
        }
      }).catch((error) => {
        toast.error("Something went wrong...!")
      })
  }, [id, playlist])

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
  });

  let deleteplaylist=(playlistid)=>{
    axios.post(`http://localhost:5000/api/video/delete-playlist?id=${playlistid}`)
    .then((response)=>{
      if(response.data.status==true){
        sedeletetplaylist(!deletePlaylist)
        toast.success(response.data.msg)
      }else{
        toast.info(response.data.msg)
      }
    }).catch(()=>{
      toast.error("Something went wrong...!")
    })
  }
  
  return (
    <>
      <div className="flex gap-2 px-3 mt-3">
        <h2 className='text-3xl font-bold'>PlayLists</h2>
        <span className='w-full border-b-2'></span>

        <BsPlusCircleFill className='text-4xl text-cyan-700' onClick={() => setopenPlaylistModal(true)} />

      </div>

      {/* Create playlist cards using with map() */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-3 mt-6">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <Link href={`/playlist/${playlist._id}`} key={index}>
              <div key={playlist._id} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg relative transition-shadow cursor-pointer" >
                <div className="relative">
                  {playlist.image ? (
                    <>
                      <img
                        src={`http://localhost:5000/uploads/videos/playlists/${playlist.image}`}
                        alt={playlist.name}
                        className="w-full h-45 object-cover"
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-2">{playlist.description}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {playlist.videoids?.length || 0} video{playlist.videoids?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <span className=' absolute top-2 end-2 bg-white rounded-full' onClick={()=>deleteplaylist(playlist._id)}><MdDeleteOutline className='text-black text-3xl'/></span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No playlists yet. Create one to get started!</p>
          </div>
        )}
      </div>

      <div className={`fixed top-1/2 left-1/2 -translate-1/2 max-w-[600px] w-full border rounded-lg bg-white p-2 z-[9999] ${openPlaylistModal ? 'block' : 'hidden'}`}>
        <h1 className='text-xl font-bold text-center'>Create Playlist</h1>
        <span className='absolute top-1 end-3 cursor-pointer text-2xl' onClick={() => setopenPlaylistModal(false)}>&times;</span>
        <form action="" className='my-2' onSubmit={handleCreatePlaylist}>
          <div className="mb-2">
            <label htmlFor="">Playlist Name</label>
            <input type="text" name="name" required id="" className='w-full p-2 border rounded-lg' />
          </div>
          <div className="mb-1">
            <label htmlFor="">Playlist Description</label>
            <textarea name="description" required id="" className='border w-full p-2 rounded-lg' rows="4"></textarea>
          </div>
          <div className="mb-2">
            <label htmlFor="">Playlist Thumbnail Image</label>

            <section className="container">
              <div {...getRootProps({ className: 'border p-3 h-[100px] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50' })}>
                <input {...getInputProps()} name='image' required />
                <div className="flex flex-col gap-0.5 text-center items-center">
                  <p className=''>Drag 'n' drop playlist banner image here, or click to select files</p>
                  <p>Your's Playlist Banner Size should be less than or equal to 2048 &times; 1152 pixels.</p>
                  <p>File Size must be under 6MB.</p>
                </div>
              </div>
              <aside>
                {preview && (
                  <div>
                    <h4 className='mt-4 font-semibold'>Banner Preview</h4>
                    <img src={preview} alt="Banner Preview" className="max-w-full max-h-[100px] mt-4 rounded-lg" />
                    {bannerFile && <p className="text-sm text-gray-600 mt-2">Selected: {bannerFile.name}</p>}
                  </div>
                )}
              </aside>
            </section>

          </div>
          <button type="submit" className='p-3 border rounded-lg'>Create Playlist</button>
        </form>
      </div>
    </>
  )
}
