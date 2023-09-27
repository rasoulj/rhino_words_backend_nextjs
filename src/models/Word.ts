import { IWord } from "@/types";
import mongoose, { Document, model, Model, Schema } from 'mongoose'

export type IWordDoc = Document & IWord;

const ISchema = new Schema({
    text: {
        type: String,
        trim: true,
        required: false
    },
    length: {
        type: Number,
        default: 0,
    },
    simple: {
        type: Number,
        default: 0,
    },
    report: {
        type: Number,
        default: 0,
    },
});

export const Word = (mongoose.models.Word ||
    model('Word', ISchema)) as Model<IWordDoc>;
