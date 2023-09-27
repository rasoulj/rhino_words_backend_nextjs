import { NextRequest } from "next/server";
import { decodeUserIdFromReq, encodeUserId } from "../../helper/jose";
import { connectToDatabase } from "@/helper/db";
import { WUser } from "@/models";
import { notOK, ok } from "@/helper/utils";
import consts, { EMPTY_USER, SCORES } from "@/config/consts";
import bcrypt from "bcryptjs"
import { IWUser } from "@/types";
import { PipelineStage } from "mongoose";


export async function findNearUsers(score: number, limit = 10, gte = true) {
    try {
        const match: any = !gte ? [
            {$match: {score: {$lt: score}} },
        ] : [
            {$sort: {score: 1}},
            {$match: {score: {$gte: score}} },
        ];


        const pipeStage: PipelineStage[] = [
            {
                $project: {
                    userName: 1,
                    wins: 1,
                    loses: 1,
                    score: { $add: [{ $multiply: ["$wins", SCORES.winsScore] }, { $multiply: ["$loses", SCORES.loseScore] }] }

                }
            },
            { $sort: { score: -1 } },
            {
                $group: {
                    _id: "$name",
                    items: { $push: "$$ROOT" }
                }
            },
            { $unwind: { path: "$items", "includeArrayIndex": "items.rank" } },
            { $replaceRoot: { "newRoot": "$items" } },
            ...match,
            { $limit: limit }
        ];

        const q = await WUser.aggregate(pipeStage).exec();
        return q;
    } catch (err) {
        console.log(err);
        return [];
    }
}


async function findUsersAroundScore(score: number, limit = 10) {
    console.log("findUsersAroundScore", score);
    const gte = (await findNearUsers(score, limit, true)).reverse();
    console.log("gte", gte);
    const count = 2*limit - gte.length;
    const lt = await findNearUsers(score, count, false);
    return [...gte, ...lt];
}


async function calcUpdate(user: Partial<IWUser>) {
    console.log("user2", user);
    const {wins = 0, loses = 0} = user || EMPTY_USER;
    const score = SCORES.winsScore*wins + SCORES.loseScore*loses;
    try {
        const total = await WUser.count({});
        const ranks = await findUsersAroundScore(score, 5);
        return {
            //wins, loses,
            ...SCORES,
            total,
            score,
            ranks,
        };
    } catch (e) {
        console.log("e-calcUpdate", e);
        return {score, wins, loses};
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { userName, password } = await req.json();
        const user = await WUser.findOne({ userName }).exec();
        if (!!user && bcrypt.compareSync(password, user.password)) {
            const token = await encodeUserId(userName);

            const update = await calcUpdate(user);
            return ok({
                update,
                user,
                authToken: token,
            });

        } else {
            return notOK(consts.MES.Invalid_User_PassFa, 200);            
        }

        
    } catch (error) {
        return notOK(error)
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const users = await WUser.find({}, "userName correct wins loses").exec();
        return ok(users);
    } catch (error) {
        return notOK(error);
    }
}


export async function updateUser(userName: string, wins: number, loses: number) {
    try {
        await connectToDatabase();
        const user = await WUser.findOneAndUpdate({ userName }, { wins, loses }).exec();
        if (!wins && !loses) {
            return ok({});
        } else {
            const data = await calcUpdate({ wins, loses });
            return ok(data);
        }
    } catch (error) {
        return notOK(error);
    }
}

export async function PUT(req: NextRequest) {
    const { wins, loses } = await req.json();
    const userName = await decodeUserIdFromReq(req);
    if (!userName) {
        return notOK("Not Authorized", 401);
    } else {
        return updateUser(userName ?? "", wins, loses);
    }
}