import mongoose, { Document } from "mongoose";

export interface ItypeModal extends Document {
    facultyId: mongoose.Types.ObjectId;
    maxPoints: number;
    types: string;
    createdAt: Date;
    updatedAt: Date; // Added updatedAt for better tracking
}

const typeSchema = new mongoose.Schema(
    {
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, "facultyId is required"]
        },
        maxPoints: {
            type: Number,
            required: [true, "maxPoints is required"]
        },
        types: {
            type: String,
            required: [true, "type is required"]
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt
);

const Type = mongoose.model<ItypeModal>('Type', typeSchema); // Changed to Type for consistency

export default Type;
