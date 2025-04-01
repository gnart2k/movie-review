import prisma from "@/prismaClient";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, filmId } = body;
        let newReview = []

        
    }catch(e){
        console.error(e)
    }
}