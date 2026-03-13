'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiSettings, FiBell, FiSliders, FiMoon, FiHelpCircle, FiChevronRight } from 'react-icons/fi';
import { MdVerified, MdPayment } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  let [user, setuser] = useState({})
  let [country, setcountry] = useState(false)
  let [togglebackground, settogglebackground] = useState(false)
  const [toggleStates, setToggleStates] = useState({
    twoFactor: false,
    newsletter: true,
    notifications: true,
    autoplayNext: true,
    captions: false,
    darkMode: true,
  });

  const [selections, setSelections] = useState({
    quality: '1080p',
    language: 'English',
    theme: 'Dark',
  });

  const handleToggle = (key) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    if (!toggleStates[key] == true) {

      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast.success('Notification permission granted.');
          }
          else if (permission === 'denied') {
            toast.error('Notification permission denied.');
          }
        });
      }
    }
    if (key == 'darkMode') {
      settogglebackground(!togglebackground)
    }
  };

  const handleSelect = (key, value) => {
    setSelections(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const menuItems = [
    { id: 'account', label: 'Account', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'playback', label: 'Playback & Performance', icon: FiSliders },
    { id: 'appearance', label: 'Appearance', icon: FiMoon },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle },
  ];

  let token = useSelector((state) => state.userdetails.token)
  useEffect(() => {
    if (token) {
      axios.post('https://youtube-server-all.up.railway.app/api/auth/view-profile', {}, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          setuser(res.data._data)
        })
        .catch((error) => {
          toast.error("Something went wrong...!")
        });
    }
  }, [token, country])

  let updatecountry = (e) => {
    let country = e.target.value
    axios.post('https://youtube-server-all.up.railway.app/api/auth/update-profile', { country }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.msg)
          setcountry(!country)
        } else {
          toast.error(res.data.msg)
        }
      })
      .catch((error) => {
        toast.error("Something went wrong...!")
      });
  }

  let deleteaccount = () => {
    console.log("delete account")
  }

  const SettingItem = ({ label, description, children }) => (
    <div className="py-6 border-b border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className=" font-medium text-md">{label}</h3>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-red-600' : 'bg-gray-700'
        } flex items-center ${checked ? 'justify-end' : 'justify-start'} p-1`}
    >
      <div className="w-5 h-5 bg-white rounded-full"></div>
    </button>
  );

  return (
    <div className={`grid md:grid-cols-2 grid-cols-1 min-h-screen ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <div className={`lg:w-64 w-full border-r border-gray-800 p-5 lg:fixed h-screen overflow-y-auto ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-8">Settings</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 cursor-pointer rounded-lg transition-colors ${activeTab === item.id
                  ? 'bg-red-600 text-white'
                  : ' hover:bg-gray-500 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1 p-5  w-full">

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Account</h1>
            <p className=" mb-8">Manage your account details and preferences</p>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className=" rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MdVerified className="text-red-600" /> Profile Information
                </h2>
                <div className="space-y-6">
                  <SettingItem label="Channel Name" description="Your public channel name">
                    <input
                      type="text"
                      defaultValue={user ? user.name : "Username"}
                      className={`border border-gray-700 rounded text-center py-2 focus:outline-none focus:border-red-600 w-[150px] ${togglebackground ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    />
                  </SettingItem>
                  <SettingItem label="Email Address" description="Your account email">
                    <input
                      type="email"
                      defaultValue={user ? user.email : " useremail@gmail.com"}
                      className={`border border-gray-700 rounded text-center py-2 focus:outline-none focus:border-red-600 w-[150px] ${togglebackground ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    />
                  </SettingItem>
                  <SettingItem label="Phone Number" description="For account recovery">
                    <input
                      type="tel"
                      defaultValue={user ? user.mobile_number : "+1 (555) 000-0000"}
                      className={`border border-gray-700 rounded text-center py-2 focus:outline-none focus:border-red-600 w-[150px] ${togglebackground ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    />
                  </SettingItem>
                  <SettingItem label="Country/Region" description="Your location" >
                    <select className={`border border-gray-700 rounded text-center px-3 py-2 focus:outline-none focus:border-red-600 w-[150px] ${togglebackground ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} onChange={updatecountry} id='country' value={user ? user.country : ''}>
                      <option value={'United States'}>United States</option>
                      <option value={'Canada'}>Canada</option>
                      <option value={'United Kingdom'}>United Kingdom</option>
                      <option value={'Australia'}>Australia</option>
                      <option value={'India'}>India</option>
                      <option value={'Germany'}>Germany</option>
                      <option value={'France'}>France</option>
                      <option value={'Japan'}>Japan</option>
                      <option value={'Brazil'}>Brazil</option>
                      <option value={'Mexico'}>Mexico</option>
                      <option value={'Spain'}>Spain</option>
                      <option value={'Italy'}>Italy</option>
                      <option value={'Netherlands'}>Netherlands</option>
                      <option value={'South Korea'}>South Korea</option>
                      <option value={'China'}>China</option>
                      <option value={'Russia'}>Russia</option>
                      <option value={'Saudi Arabia'}>Saudi Arabia</option>
                      <option value={'Turkey'}>Turkey</option>
                      <option value={'Sweden'}>Sweden</option>
                      <option value={'Switzerland'}>Switzerland</option>
                      <option value={'Argentina'}>Argentina</option>
                      <option value={'Nigeria'}>Nigeria</option>
                      <option value={'Egypt'}>Egypt</option>
                      <option value={'Indonesia'}>Indonesia</option>
                      <option value={'Philippines'}>Philippines</option>
                      <option value={'Vietnam'}>Vietnam</option>
                    </select>
                  </SettingItem>
                </div>
              </div>

              {/* Download Data */}
              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6">Data Management</h2>

                <SettingItem label="Delete Account" description="Permanently delete your account and data">
                  <button onClick={deleteaccount} className={` hover:bg-red-600 hover:border-0 px-6 py-2 rounded font-medium transition-colors ${togglebackground ? ' text-white' : 'border-2 border-gray-500 text-black'}`}>
                    Delete
                  </button>
                </SettingItem>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-500 mb-8">Manage how you get notified</p>

            <div className="space-y-6">
              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <SettingItem label="Enable All Notifications" description="Receive all notification types">
                  <Toggle
                    checked={toggleStates.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                </SettingItem>
                <SettingItem label="Subscriber Updates" description="Get notified when creators you follow upload">
                  <Toggle
                    checked={toggleStates.subscriberUpdates}
                    onChange={() => handleToggle('subscriberUpdates')}
                  />
                </SettingItem>
                <SettingItem label="Comment Replies" description="Get notified when someone replies to your comments">
                  <Toggle
                    checked={toggleStates.commentReplies}
                    onChange={() => handleToggle('commentReplies')}
                  />
                </SettingItem>
                <SettingItem label="Weekly Newsletter" description="Receive weekly digest of your interests">
                  <Toggle
                    checked={toggleStates.newsletter}
                    onChange={() => handleToggle('newsletter')}
                  />
                </SettingItem>
              </div>

              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6 ">Email Preferences</h2>
                <SettingItem label="Marketing Emails" description="Receive promotional offers and updates">
                  <Toggle
                    checked={!toggleStates.marketingEmails}
                    onChange={() => handleToggle('marketingEmails')}
                  />
                </SettingItem>
                <SettingItem label="Product Updates" description="Learn about new features and improvements">
                  <Toggle
                    checked={toggleStates.productUpdates}
                    onChange={() => handleToggle('productUpdates')}
                  />
                </SettingItem>
              </div>
            </div>
          </div>
        )}

        {/* Playback & Performance */}
        {activeTab === 'playback' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Playback & Performance</h1>
            <p className="text-gray-500 mb-8">Customize your viewing experience</p>

            <div className="space-y-6">
              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6">Video Quality</h2>
                <SettingItem label="Default Video Quality" description="Choose your preferred playback quality">
                  <select
                    value={selections.quality}
                    onChange={(e) => handleSelect('quality', e.target.value)}
                    className=" border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                  >
                    <option>360p</option>
                    <option>480p</option>
                    <option>720p</option>
                    <option>1080p</option>
                    <option>4K</option>
                  </select>
                </SettingItem>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Appearance</h1>
            <p className="text-gray-500 mb-8">Customize how the app looks</p>

            <div className="space-y-6">
              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6">Theme</h2>
                <SettingItem label="Dark Mode" description="Easy on the eyes, especially at night">
                  <Toggle
                    checked={toggleStates.darkMode}
                    onChange={() => handleToggle('darkMode')}
                  />
                </SettingItem>
                <div className="py-6 border-b border-gray-700">
                  <h3 className=" font-medium text-md mb-4">Theme Preference</h3>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 rounded bg-red-600 border-2 font-medium">
                      Dark
                    </button>
                    <button className="px-4 py-2 rounded bg-gray-800 border-2 border-gray-700 text-gray-300 font-medium hover:border-gray-600">
                      Light
                    </button>
                    <button className="px-4 py-2 rounded bg-gray-800 border-2 border-gray-700 text-gray-300 font-medium hover:border-gray-600">
                      System
                    </button>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6">Layout</h2>
                <SettingItem label="Sidebar" description="Default sidebar visibility">
                  <select className=" border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-600">
                    <option>Show</option>
                    <option>Hide</option>
                    <option>Auto</option>
                  </select>
                </SettingItem>
                <SettingItem label="Compact Mode" description="Reduce spacing for a condensed layout">
                  <Toggle
                    checked={false}
                    onChange={() => { }}
                  />
                </SettingItem>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support */}
        {activeTab === 'help' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-gray-500 mb-8">Get help with your account</p>

            <div className="space-y-6">
              

              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6 ">Contact Us</h2>
                <SettingItem label="Send Feedback" description="Tell us what you think">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition-colors">
                    Send
                  </button>
                </SettingItem>
                <SettingItem label="Report a Problem" description="Help us fix issues">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition-colors">
                    Report
                  </button>
                </SettingItem>
              </div>

              <div className={`rounded-lg p-6 border border-gray-800 ${togglebackground ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-6 ">About</h2>
                <div className="space-y-3 text-gray-500 text-sm">
                  <p>Version 1.0.0</p>
                  <p>© 2026 YouTube Clone. All rights reserved.</p>
                  <div className="pt-4 flex gap-6">
                    <Link href="/privacy-policy" className="text-red-600 hover:text-red-500">
                      Privacy Policy
                    </Link>
                    <Link href="/terms-of-service" className="text-red-600 hover:text-red-500">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
