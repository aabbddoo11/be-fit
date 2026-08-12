import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  oldPrice: {
    type: Number,
    min: 0
  },

  category: {
    type: String,
    trim: true
  },

  brand: {
    type: String,
    trim: true
  },

  flavor: {
    type: String,
    trim: true
  },

  weight: {
    type: String,
    trim: true
  },

  servings: {
    type: String,
    trim: true
  },

  image: {
    type: String
  },

  gallery: {
    type: [String],
    default: []
  },

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  featured: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviewsCount: {
    type: Number,
    default: 0
  },

  badge: {
    type: String,
    default: ""
  },

  benefits: {
    type: [String],
    default: []
  },

  ingredients: {
    type: [String],
    default: []
  }
});
const Product = mongoose.model("Product", productSchema)
export default Product;