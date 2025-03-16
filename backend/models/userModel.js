import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        enrolledPaths: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LearningPath',
        }],
        resetPasswordToken : String,
        resetPasswordExpiresAt : Date,
    },
    { 
        timestamps: true 
    }
);

const User = mongoose.model('User', userSchema);
export default User;