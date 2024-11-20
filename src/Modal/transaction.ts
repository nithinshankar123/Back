import mongoose, { Document } from "mongoose";

export interface Itransaction extends Document {
    userid: mongoose.Types.ObjectId;
    points: number;
    types: mongoose.Types.ObjectId;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date; // Added updatedAt for better tracking
}

const transactionSchema = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        points: {
            type: Number,
            required: [true, "amount is required"],
        },
        types: {
            type: mongoose.Schema.Types.ObjectId, // Fixed the type declaration
            ref: 'type',
            required: [true, "type is required"],
        },
        description: {
            type: String,
            required: [true, "description is required"], // Fixed the description message
        },
        date: {
            type: Date,
            required: [true, "date is required"], // Fixed the date message
        },
        createdAt: {
            type: Date,
            default: Date.now // Fixed to use default correctly
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt
);

const Transaction = mongoose.model<Itransaction>('Transaction', transactionSchema); // Changed to Transaction for consistency

export default Transaction;
