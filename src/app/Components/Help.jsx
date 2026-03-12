'use client'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

export default function Help() {
  const topics = [
    {
      title: 'Getting started on YouTube',
      description: 'Create an account, upload your first video, and start your channel.',
    },
    {
      title: 'Account & Settings',
      description: 'Manage your account, privacy, and notification preferences.',
    },
    {
      title: 'Uploading & Managing Videos',
      description: 'Learn how to upload, edit, and organize your content.',
    },
    {
      title: 'Monetization & Analytics',
      description: 'Understand monetization options and review your channel statistics.',
    },
    {
      title: 'Community Guidelines',
      description: 'Keep your content compliant with YouTube’s policies and standards.',
    },
    {
      title: 'Copyright & Content ID',
      description: 'Protect your work and understand how copyright works on YouTube.',
    },
  ]

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      <h1 className="text-4xl font-bold">Help Center</h1>
        <p>Take Help From Our Community Share...!</p>

      {/* topics grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((t) => (
          <div
            key={t.title}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
