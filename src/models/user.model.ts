import mongoose, { InferSchemaType, Model, model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

const UserModel: Model<User> =
    mongoose.models.User || model("User", UserSchema);

export default UserModel;
