import { GenAICode } from "@/configs/AiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({
                error: "Prompt is required"
            }, { status: 400 });
        }

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            return NextResponse.json({
                error: "API key not configured"
            }, { status: 500 });
        }

        const result = await GenAICode.sendMessage(prompt);
        const res = await result.response.text();
        
        // Clean and parse the response exactly like the working code
        let cleanedRes = res;
        
        // Remove markdown code block delimiters if present
        cleanedRes = cleanedRes.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
        cleanedRes = cleanedRes.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
        
        // Trim whitespace
        cleanedRes = cleanedRes.trim();
        
        const parsedResponse = JSON.parse(cleanedRes);
        return NextResponse.json(parsedResponse);
    } catch (e: any) {
        console.error("Error generating code:", e);
        
        // Handle specific error types
        if (e.message?.includes('API key')) {
            return NextResponse.json({
                error: "Invalid API key configuration"
            }, { status: 500 });
        }
        
        if (e.message?.includes('quota')) {
            return NextResponse.json({
                error: "API quota exceeded. Please try again later."
            }, { status: 429 });
        }

        if (e instanceof SyntaxError) {
            return NextResponse.json({
                error: "Failed to parse AI response. Please try again."
            }, { status: 500 });
        }

        return NextResponse.json({
            error: "Failed to generate code. Please try again."
        }, { status: 500 });
    }
}