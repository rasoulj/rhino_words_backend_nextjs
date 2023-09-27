import { connectToDatabase } from "@/helper/db";
import { NextRequest } from "next/server";
import { notOK, ok } from "@/helper/utils";
import { WUser } from "@/models";

export async function GET(req: NextRequest, { params }: any) {
    try {
        await connectToDatabase();

        const { userName } = params;

        const user = await WUser.findOne({ userName }, "correct");

        return ok(user);
        
    } catch (error) {
        return notOK(error);
    }
}