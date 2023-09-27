import { connectToDatabase } from "@/helper/db";
import { notOK, ok } from "@/helper/utils";
import { Word } from "@/models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const text = req.nextUrl.searchParams.get("text");
        const data = await Word.find({ text });
        if (!!data && data.length > 0) {
            const { simple } = data[0];
            if (simple !== 1) {
                await Word.findOneAndUpdate({ text }, { simple: 2, length: (text || "").length }, { upsert: true });
            }
        }

        return ok(data);

    } catch (err) {
        return notOK(err);
    }
    
    
}