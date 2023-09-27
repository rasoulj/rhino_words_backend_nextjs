import { connectToDatabase } from "@/helper/db";
import { notOK, ok } from "@/helper/utils";
import { NextRequest } from "next/server";
import { findNearUsers } from "../route";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        return ok(await findNearUsers(100000000, 50, false));
    } catch (error) {
        return notOK(error);
    }
}