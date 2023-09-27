import { NextRequest } from "next/server";
import { updateUser } from "../route";

export async function PUT(req: NextRequest) {
    const { userName, wins, loses } = await req.json();
    return updateUser(userName, wins, loses);
}