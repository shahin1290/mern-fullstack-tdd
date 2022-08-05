import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config';

export interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.pre('save', async function (next) {
    let user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.saltWorkFactor);

    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
