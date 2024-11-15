import Joi from "joi";

const registerUserValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
})

const loginUserValidation = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    id: Joi.required(),
    email: Joi.string().email().optional(),
    name: Joi.string().max(100).optional(),
    password: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).optional(),
    newPasswordConfirmation: Joi.string().optional().valid(Joi.ref('newPassword')).when('newPassword', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.forbidden()
    })
}).strict();

export {
    loginUserValidation,
    registerUserValidation,
    getUserValidation,
    updateUserValidation,
}
