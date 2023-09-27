import { IRespType } from "@/types";
import { NextResponse } from "next/server";

const success = 1;
const fail = 0;

function getResp(status: number, data: any, message: string | undefined = undefined) : IRespType {
    return {status, data, message}
}

export function ok(data: any, message: string | undefined = undefined) : NextResponse {
    return NextResponse.json(getResp(success, data, message));
}

export function notOK(data: any, status: number = 500) : NextResponse {
    return NextResponse.json(getResp(fail, data), {status});
}

