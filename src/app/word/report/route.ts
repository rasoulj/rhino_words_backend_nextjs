import { connectToDatabase } from "@/helper/db";
import { notOK, ok } from "@/helper/utils";
import { Word } from "@/models";
import { NextRequest } from "next/server";

function filterReport(data: any[], type: number) {
    return (data || []).filter(({report, text}) => !!text && report === type).map(({text}) => text);
}


export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const data = await Word.find({ report: { $gte: 1 } }).exec(); 
        const rep1 = filterReport(data, 1);
        const rep2 = filterReport(data, 2);
        return ok({ rep1, rep2 });
    } catch (error) {
        return notOK(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { rep0 = [], rep1 = [], rep2 = [] } = await req.json();
        const d2 = await Word.updateMany({ text: rep2 }, { report: 2 }).exec();
        const d1 = await Word.updateMany({ text: rep1 }, { report: 1 }).exec();
        const d0 = await Word.updateMany({ text: rep0 }, { report: 0 }).exec();
        return ok({ d0, d1, d2, rep1 });
    } catch (error) {
        return notOK(error);
    }
}