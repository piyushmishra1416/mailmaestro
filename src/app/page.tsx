"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import axios from 'axios'
import EmailList from '@/components/EmailList'

const HomePage = () => {
  const { data: session } = useSession()
  const [emails, setEmails] = useState([])

  const fetchEmails = async () => {
    if (session) {
      const response = await axios.get('/api/fetch-emails', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      setEmails(response.data)
      console.log(emails)
    }
  }

  const classifyEmails = async () => {
    if (emails.length === 0) return

    const openaiKey = prompt("Enter your OpenAI API key")

    if (openaiKey) {
      const response = await axios.post('/api/classify-emails', {
        emails,
        openaiKey,
      })
      setEmails(response.data)
    }
  }

  return (
    <div className="container flex justify-center items-center text-center mx-auto p-4">
      {!session ? (
        <button onClick={() => signIn('google')} className="btn border-2 border-white p-4 btn-primary">
          Sign in with Google
        </button>
      ) : (
        <>
          <button onClick={() => signOut()} className="btn btn-secondary">
            Sign out
          </button>
          <button onClick={fetchEmails} className="btn btn-primary ml-2">
            Fetch Emails
          </button>
          <button onClick={classifyEmails} className="btn btn-primary ml-2">
            Classify Emails
          </button>
          <EmailList emails={emails} />
        </>
      )}
    </div>
  )
}

export default HomePage
