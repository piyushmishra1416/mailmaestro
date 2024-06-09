"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import EmailList from "@/components/EmailList";

const useGeminiClient = () => {
  const classifyEmails = async (emails: any, geminiApiKey: any) => {
    try {
      const response = await axios.post("/api/classify-emails", {
        emails,
        geminiApiKey,
      });
      return response.data;
    } catch (error) {
      console.error("Error classifying emails:", error);
      return null;
    }
  };

  return { classifyEmails };
};

const HomePage = () => {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");

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
    <div className="container flex justify-center items-center text-center mx-auto p-4">
      {!session ? (
        <>
          <input
            type="text"
            value={geminiApiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your Gemini API key"
            className="ml-2 p-2 border border-gray-400 rounded"
          />
          <button onClick={handleSignIn} className="btn border-2 border-white p-4 btn-primary">
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <button onClick={fetchEmails} className="btn btn-primary ml-2">
            Fetch Emails
          </button>
          <button onClick={() => signOut()} className="btn btn-secondary">
            Sign out
          </button>
          <button onClick={handleClassifyEmails} className="btn btn-primary ml-2">
            Classify Emails
          </button>
          <EmailList emails={emails} />
        </>
      )}
    </div>
  );
};

export default HomePage;
