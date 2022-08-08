import { UserDocument } from './../models/user.model';
import UserModel from '../models/user.model';
import { DocumentDefinition } from 'mongoose';
import { omit } from 'lodash';

export async function createUser(input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt'>>) {
    try {
        const user = await UserModel.create(input);
        return user;
    } catch (e: any) {
        throw new Error(e);
    }
}
