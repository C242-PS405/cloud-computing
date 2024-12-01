import Joi from "joi";

const emailValidation = Joi.string()
    .email({ tlds: { allow: ['com', 'org', 'net'] } }) 
    .lowercase() 
    .trim() 
    .max(255)
    .required();

const passwordValidation = Joi.string()
    .min(8) // Tingkatkan minimal panjang
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])?[A-Za-z\\d@$!%*?&]{8,}$')) 
    .message('Password harus mengandung huruf besar, huruf kecil, dan angka');

const registerUserValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
})

const loginUserValidation = Joi.object({
    email: emailValidation,
    password: passwordValidation
})

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    id: Joi.required(),
    email: emailValidation.optional(),
    name: Joi.string().min(3).max(100).optional(),
    password: passwordValidation.optional(), 
    newPassword: Joi.alternatives().conditional('password', {
        is: Joi.exist(), 
        then: passwordValidation.invalid(Joi.ref('password')),
        otherwise: Joi.forbidden() 
    }),
    newPasswordConfirmation: Joi.alternatives().conditional('newPassword', {
        is: Joi.exist(), // Jika password baru diisi
        then: Joi.string().valid(Joi.ref('newPassword')).required(), 
        otherwise: Joi.forbidden() // Jika tidak, konfirmasi tidak boleh ada
    })
}).with('newPassword', 'newPasswordConfirmation') // Pastikan keduanya ada bersama
    .strict(); // Tolak properti yang tidak terdefinisi


export {
    loginUserValidation,
    registerUserValidation,
    getUserValidation,
    updateUserValidation,
}
