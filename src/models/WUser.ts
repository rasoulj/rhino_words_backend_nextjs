import { IWUser } from '@/types';
import mongoose, { Document, model, Model, Schema } from 'mongoose'
import bcrypt from "bcryptjs"


export type IWUserDoc = Document & IWUser;

const ISchema: Schema = new Schema({

    userName: {
        type: String,
    },
    password: {
        type: String
    },
    wins: {
        type: Number,
        default: 0,
    },
    loses: {
        type: Number,
        default: 0,
    },
    index: {
        type: Number,
        default: 0,
    },
    guesses: {
        type: [String],
        default: ["", "", "", "", "", "", ""],
    },
    bgSound: {
        type: Boolean,
        default: true,
    },
    effectSound: {
        type: Boolean,
        default: true,
    },
    correct: {
        type: String,
        default: "",
    },
    bgImage: {
        type: Boolean,
        default: true,
    },
})

ISchema.set("timestamps", true);

ISchema.index({ userName: 1 }, { unique: true });

ISchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    // this.wid =  createWid(await nextCount("wid"));
    next();
});


export const WUser = (mongoose.models.WUser ||
    model('WUser', ISchema)) as Model<IWUserDoc>;
