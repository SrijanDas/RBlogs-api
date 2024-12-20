import { Types } from "mongoose";

export type ISerializable<T> = (T & { _doc?: T }) | null;
export type IDocument<T> = Document<unknown, any, T>;

export type JwtPayload = {
    id: string;
    iat: number;
    exp: number;
};

export type Blog = {
    _id: Types.ObjectId;
    title: string;
    content: string;
    createdBy: string;
    comments: number;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
};

export type Comment = {
    _id: Types.ObjectId;
    blogId: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
};
