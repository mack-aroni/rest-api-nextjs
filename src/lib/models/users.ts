import { Schema, model, models } from "mongoose";

/*
  UserSchema for User model contains:
    email: required unique string
    username: required unique string
    password: required string
*/
const UserSchema = new Schema(
  {
    email: {type: "string", required: true, unique: true},
    username: {type: "string", required: true, unique: true},
    password: {type: "string", required: true},
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;