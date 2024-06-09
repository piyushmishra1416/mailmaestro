"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import EmailList from "@/components/EmailList";


const HomePage = () => {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [isClassifcationLoading, setIsClassificationLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-4">
      <div className="w-full max-w-xl">
        {!session ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={geminiApiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Gemini API key"
              className="mb-4 p-2 border border-gray-400 rounded text-black"
            />
            <button onClick={handleSignIn} className="btn border-2 border-white p-2">
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <img src="/path/to/profile-pic.png" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="text-lg font-bold"> Username</h2>
                <p>{session.user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <button onClick={fetchEmails} className="btn btn-primary p-2">
                Fetch Emails
              </button>
              <button onClick={() => signOut()} className="btn btn-secondary p-2">
                Sign out
              </button>
              <button onClick={handleClassifyEmails} className="btn btn-primary p-2">
                Classify
              </button>
            </div>
            <EmailList emails={emails} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
