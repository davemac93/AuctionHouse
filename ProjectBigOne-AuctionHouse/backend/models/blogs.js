const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    dateOfAdding: Date,
    imagePaths: [{ type: String }],
    text1: String,
    text2: String,
    text3: String,
    text4: String
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;