import { connectToDatabase } from "@/helper/db";
import { notOK, ok } from "@/helper/utils";
import { Word } from "@/models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
    try {
        await connectToDatabase();
        const { len } = params;
        const length = parseInt(len);
        const q = await Word.aggregate([
            { $match: { simple: 1, length, report: { $ne: 2 } } },
            { $sample: { size: 1 } }
        ]).exec();
        return ok(q);
    } catch (err) {
        return notOK(err);
    }
}