import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route' // Correct import of authOptions

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: session.accessToken })

    const gmail = google.gmail({ version: 'v1', auth })

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // You can change the number of emails to fetch
    })

    const emailPromises = response.data.messages?.map(async (message) => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      })
      return {
        id: email.data.id!,
        subject: email.data.payload?.headers?.find(header => header.name === 'Subject')?.value || '',
        snippet: email.data.snippet || '',
      }
    }) || []

    const emails = await Promise.all(emailPromises)
    return NextResponse.json(emails)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error fetching emails' }, { status: 500 })
  }
}
