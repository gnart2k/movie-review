import * as gemini from "@google/generative-ai";
import { HarmCategory } from "@google/generative-ai";
import { NextResponse } from "next/server"; // Use NextResponse for Next.js API routes

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Missing Google API Key" }, { status: 500 });
        }

        const genAI = new gemini.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: gemini.HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });

        const chat = model.startChat({ history: body.history || [] });
        const msg = body.message;
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();

        return new NextResponse(text, { status: 200 }); // ✅ Always return a response
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
