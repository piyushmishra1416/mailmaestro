"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EmailList from "@/components/EmailList";
import LandingSection from "@/components/LandingSection";
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';
import { MdRefresh, MdCategory } from 'react-icons/md';

const HomePage = () => {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassificationLoading, setIsClassificationLoading] = useState(false);
  const getStartedRef = useRef<HTMLDivElement>(null);

  const useGeminiClient = () => {
    const classifyEmails = async (emails: any, geminiApiKey: any) => {
      try {
        setIsClassificationLoading(true)
        const response = await axios.post("/api/classify-emails", {
          emails,
          geminiApiKey,
        });
        return response.data;
      } catch (error) {
        console.error("Error classifying emails:", error);
        return null;
      }
      finally{
        setIsClassificationLoading(false)
      }
    };
  
    return { classifyEmails };
  };

  const { classifyEmails } = useGeminiClient();

  useEffect(() => {
    const storedApiKey = localStorage.getItem("apikey");
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
    }
  }, []);

  const fetchEmails = async () => {
    if (session) {
      const response = await axios.get("/api/fetch-emails", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      setEmails(response.data);
    }
  };

  const handleClassifyEmails = async () => {
    if (emails.length === 0 || !geminiApiKey) {
      alert("No emails to classify or API key is missing.");
      return;
    }

    const classifiedEmails = await classifyEmails(emails, geminiApiKey);
    if (classifiedEmails) {
      setEmails(classifiedEmails);
    }
  };

  const handleApiKeyChange = (e: { target: { value: any; }; }) => {
    const newApiKey = e.target.value;
    setGeminiApiKey(newApiKey);
    localStorage.setItem("apikey", newApiKey);
  };

  const handleSignIn = () => {
    if (geminiApiKey) {
      localStorage.setItem("apikey", geminiApiKey);
      signIn("google");
    } else {
      alert("Please enter your Gemini API key.");
    }
  };

  const scrollToGetStarted = () => {
    getStartedRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-[2000px] mx-auto relative">
        {!session ? (
          <div className="flex flex-col">
            <LandingSection onGetStarted={scrollToGetStarted} />
            {/* Get Started Section */}
            <div ref={getStartedRef} className="w-full max-w-md mx-auto px-4 mb-20">
              <div className="bg-gray-800/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Get Started
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Gemini API Key
                    </label>
                    <input
                      type="text"
                      value={geminiApiKey}
                      onChange={handleApiKeyChange}
                      placeholder="Enter your Gemini API key"
                      className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-blue-500/20"
                  >
                    <FaGoogle className="text-lg" />
                    Sign in with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Header with user info and actions */}
            <div className="sticky top-4 z-30 bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-lg">
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={session.user?.image || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full ring-2 ring-gray-700"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="font-semibold text-gray-100">{session.user?.name}</h2>
                    <p className="text-sm text-gray-400">{session.user?.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-end gap-3">
                  <button
                    onClick={fetchEmails}
                    disabled={isLoading}
                    className="min-w-[40px] px-4 py-2 bg-blue-500/90 hover:bg-blue-500 rounded-xl transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <MdRefresh className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isLoading ? "Loading..." : "Fetch Emails"}</span>
                  </button>
                  <button
                    onClick={handleClassifyEmails}
                    disabled={isClassificationLoading}
                    className="min-w-[40px] px-4 py-2 bg-purple-500/90 hover:bg-purple-500 rounded-xl transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <MdCategory className="text-lg" />
                    <span className="hidden sm:inline">
                      {isClassificationLoading ? "Classifying..." : "Classify"}
                    </span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="min-w-[40px] px-4 py-2 bg-gray-600/90 hover:bg-gray-600 rounded-xl transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email list */}
            <div className="pt-4">
              <EmailList emails={emails} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
