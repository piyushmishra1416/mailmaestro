// app/api/classify-emails/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { emails, openaiKey } = await req.json()

  if (!emails || !openaiKey) {
    return NextResponse.json({ message: 'Missing emails or OpenAI key' }, { status: 400 })
  }

  try {
    const openai = new OpenAI({
      apiKey: openaiKey,
    })

    const classifications = await Promise.all(
      emails.map(async (email: any) => {
        const response = await openai.completions.create({
          model: 'gpt-3.5-turbo',
          prompt: `Classify this email: ${email.subject} - ${email.snippet}`,
          max_tokens: 50,
        })
        return {
          ...email,
          category: response.choices[0].text.trim(),
        }
      })
    )

    return NextResponse.json(classifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error classifying emails' }, { status: 500 })
  }
}
