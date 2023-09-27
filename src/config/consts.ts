import { IWUser } from "@/types";

const consts = {
    MES: {
        Invalid_User_Pass: "Invalid phone/password pair.",
        User_Added: "User added successfully!",
        User_Not_Verified: "The user has not verified.",

        Invalid_User_PassFa: "نام کاربری و یا رمز عبور صحیح نیست",
        User_AddedFa: "کاربر با موفقیت اضافه شد",
        User_AlreadyAddedFa: "این کاربر از قبل موجود است",
        User_NoPassword: "نام کاربری وارد نشده است",

    },
    CONFIG: {
        TokenExpireIn: '7200h'
    },
    Roles: {
        AGENCY: "AGENCY",
        BRANCH: "BRANCH",
        AGENCY_ADMIN: "1-agencyAdmin",
        BRANCH_ADMIN: "2-branchAdmin",
        BRANCH_AGENT: "3-branchAgent",
        CUSTOMER: "4-branchCustomer",
        NONE: "5-none"
    }

}

export default consts;


const rhino = "کرگدن";

export const SCORES = {
    winsScore: 5,
    loseScore: 1,
}

export const EMPTY_USER: Partial<IWUser> = {
    wins: 0,
    loses: 0,
    index: 0,
    guesses: ["", "", "", "", "", "", "", ],
    bgSound: true,
    effectSound: true,
    correct: rhino,
}
