import { notOK, ok } from "@/helper/utils";
import { Word } from "@/models";
import { NextRequest } from "next/server";
import {connectToDatabase} from "../../../../helper/db";

export async function GET(req: NextRequest, {params}: any) {
    try {
        await connectToDatabase();
        const { word: text } = params;
        const data = await Word.findOneAndUpdate({ text }, { report: 1 }, { upsert: true }).exec();
        return ok([data]);
    } catch (error) {
        return notOK(error);
    }
}