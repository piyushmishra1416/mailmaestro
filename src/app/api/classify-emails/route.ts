// app/api/classify-emails/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { emails, geminiApiKey } = await req.json();

  if (!emails || !geminiApiKey) {
    return NextResponse.json(
      { message: "Missing emails or Gemini API key" },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const classifications = await Promise.all(
      emails.map(async (email: any) => {
        const prompt = `Classify this email: ${email.subject} - ${email.snippet}`;
        return await retryWithBackoff(async () => {
          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            return {
              ...email,
              category: text,
            };
          } catch (error: any) {
            if (error.response?.candidates?.[0]?.blocked) {
              return {
                ...email,
                category: "Blocked due to safety concerns",
              };
            }
            throw error;
          }
        });
      })
    );

    return NextResponse.json(classifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error classifying emails" },
      { status: 500 }
    );
  }
}

async function retryWithBackoff(fn: () => Promise<any>, retries = 5, delay = 1000) {
  try {
    return await fn();
  } catch (error: any) {
    if (
      retries === 0 ||
      (error.status !== 429 &&
        !error.response?.candidates?.[0]?.blocked)
    ) {
      throw error;
    }
    console.warn(`Retrying in ${delay}ms...`);
    await new Promise((res) => setTimeout(res, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}
