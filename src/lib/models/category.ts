import { Schema, model, models } from "mongoose";

/*
  CategorySchema for Category models contain:
    title: required string
    user: relationship with User model
*/
const CategorySchema = new Schema (
  {
    title: {type: "string", required: true},
    user: {type: Schema.Types.ObjectId, ref: "User"},
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;