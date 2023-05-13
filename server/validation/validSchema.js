const joi = require('joi');

const signUpSchema = joi.object(
    {
        username : joi.string().trim().min(2).max(50).required(),
        email : joi.string().email().min(2).max(50).required(),
        password : joi.string().min(7).max(100).required()
    }
)

const loginSchema = joi.object(
    {
        email : joi.string().email().min(2).max(50).required(),
        password : joi.string().min(7).max(100).required()
    }
)

const updateSchema = joi.object({
    username: joi.string().trim().min(2).max(50),
    password : joi.string().min(7).max(100)
});

const postSchema = joi.object({
    title: joi.string().trim().min(2).max(100).required(),
    content: joi.string().trim().min(2).required(),
    category: joi.string().trim().max(50).required(),
});

const updatePostSchema = joi.object({
    title: joi.string().trim().min(2).max(100),
    content: joi.string().trim().min(2),
    category: joi.string().trim().max(50),
});

const commentSchema = joi.object({
    content: joi.string().trim().required()
});

const updateCommentSchema = joi.object({
    content: joi.string().trim().required()
});

const categorySchema = joi.object({
    title: joi.string().trim().required()
})

module.exports = {
    signUpSchema,
    loginSchema,
    updateSchema,
    postSchema,
    updatePostSchema,
    commentSchema,
    updateCommentSchema,
    categorySchema
}