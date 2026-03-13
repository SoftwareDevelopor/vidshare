import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Comments({ comments }) {
  // comments prop is expected to be the video object passed from WatchVideos
  const commentArray = comments?.comments || []
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(commentArray)
  

  useEffect(() => {
    setLocalComments(comments?.comments || [])
  }, [comments])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !comments?._id) return

    // optimistic update
    const updated = [
      ...localComments,
      {
        text: newComment,
        createdAt: new Date().toISOString(),
        // you can add additional metadata here (user, avatar, etc.)
      },
    ]
    setLocalComments(updated)
    setNewComment('')

    try {
      await axios.post(
        `https://youtube-server-all.up.railway.app/api/video/update-comments?id=${comments._id}`,
        { comments: { comments: updated } }
      )
      .then((res)=>{
        if(res.data.status==true){
          toast.success(res.data.msg)
        }else{
          toast.info(res.data.msg)
        }
      })
    } catch (err) {
      toast.error("Failed to add comment")
    }
  }

  return (
    <div className="space-y-6">
      {/* new comment input */}
      <form
        onSubmit={handleCommentSubmit}
        className="flex items-start gap-3"
      >
        <img
          src={
            comments?.videouploader?.image
              ? `https://youtube-server-all.up.railway.app/uploads/users/${comments.videouploader.image}`
              : 'https://via.placeholder.com/40?text=👤'
          }
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a public comment..."
            className="w-full resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              Comment
            </button>
          </div>
        </div>
      </form>

      {/* existing comments list */}
      {localComments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {localComments.map((c, idx) => {
            const author = c.user || c.author || {}
            const avatar =
              author.image ||
              c.avatar ||
              'https://via.placeholder.com/40?text=👤'
            const name = author.name || author.username || 'Anonymous'
            const text = c.text || c.comment || ''
            const time = c.createdAt
              ? new Date(c.createdAt).toLocaleString()
              : ''
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={
                    avatar.startsWith('http')
                      ? avatar
                      : `https://youtube-server-all.up.railway.app/uploads/users/${avatar}`
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {name}
                    </span>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

