import mongoose from "mongoose";

export const customerSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        linkedId: {
            type: Number,
            default : null
        },
        linkPrecedence: {
            type :String,
            enum: ["secondary", "primary"],
            default: "primary"
        },
        deletedAt: {
            type: Date,
            default : null
        }
    },
    {
        timestamps: true,
    }
);


const customerModel = mongoose.model('customer', customerSchema);

export default customerModel