import consts from "@/config/consts";
import { connectToDatabase } from "@/helper/db";
import { notOK, ok } from "@/helper/utils";
import { WUser } from "@/models";
import { NextRequest} from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()
        const { userName, password } = await req.json();
        const user = await WUser.findOne({ userName });
        if (!!user) {
            return notOK(consts.MES.User_AlreadyAddedFa);
        }

        await WUser.create({ userName, password });
        return ok(consts.MES.User_AddedFa);

    } catch (err) {
        return notOK(err);
    }
}