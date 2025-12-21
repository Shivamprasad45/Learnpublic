'use client';
import { useState, useEffect, useCallback } from 'react';
import ConfigForm from './ConfigForm';
import { useRouter } from 'next/navigation';
import { ConfigFormData, UserData } from '@/type';


export default function ConfigPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<ConfigFormData>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userdata, setUserdata] = useState<UserData | null>(null);
  const [posting, setPosting] = useState(false);

  const fetchConfig = useCallback(async () => {
    if (!userdata?.id) return;
    
    try {
      const response = await fetch(`/api/config?userId=${userdata.id}`);
      const data = await response.json();
      
      if (data.config) {
        setInitialData(data.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  }, [userdata?.id]);

 useEffect(() => {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined") {
    localStorage.removeItem("user");
    router.push("/login");
    return;
  }

  try {
    const userData = JSON.parse(user);
    setUserdata(userData);
  } catch {
    console.error("Invalid user data in localStorage:", user);
    localStorage.removeItem("user");
    router.push("/login");
  }
}, [router]);


  useEffect(() => {
    if (userdata?.id) {
     fetchConfig();
    }
  }, [userdata, fetchConfig]);

  const sendPostSocialMedia = async (id: string) => {
    setPosting(true);
    try {
      const response = await fetch(`/api/Webhook?userId=${id}`);
      await response.json();
      setMessage({ type: 'success', text: 'Posted to social media successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to post to social media' });
    } finally {
      setPosting(false);
    }
  };

  const handleSubmit = async (formData: ConfigFormData) => {
    if (!userdata) return;
    
    const obj = {
      ...formData,
      USER_ID: userdata.id
    };

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!userdata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Configuration Settings
              </h1>
              <p className="text-gray-600">
                Manage your GitHub and Twitter API credentials
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500 mb-1">Logged in as</div>
              <div className="font-semibold text-gray-900">{userdata.name}</div>
              <div className="text-sm text-gray-600">{userdata.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Alert Message */}
        {message && (
          <div className={`max-w-4xl mx-auto mb-6 p-4 rounded-lg shadow-sm transition-all duration-300 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Post Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Your Learning Experience
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Share your latest learning progress and achievements on your connected social media platforms.
              </p>
              <button
                onClick={() => sendPostSocialMedia(userdata.id)}
                disabled={posting}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {posting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post to Social Media
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                API Configuration
              </h2>
            </div>
            <div className="p-6">
              <ConfigForm 
                initialData={initialData} 
                onSubmit={handleSubmit} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}