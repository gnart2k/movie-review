import { NextResponse } from "next/server";

// Standardized response helper
export const createResponse = (success: boolean, message: string, data: any = {}, status = 200) =>
    NextResponse.json({ success, message, data }, { status });
