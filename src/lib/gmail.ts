// lib/gmail.ts
import { google } from 'googleapis'

export const getEmails = async (accessToken: string, maxResults: number = 10) => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const gmail = google.gmail({ version: 'v1', auth })
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
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

  return Promise.all(emailPromises)
}
