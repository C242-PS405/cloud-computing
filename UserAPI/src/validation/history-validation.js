const getLogsSchema = Joi.object({
    userId: Joi.number().integer().required(), // User ID harus ada dan berupa integer
    paramId: Joi.number().integer().optional(), // Param ID opsional
    page: Joi.number().integer().min(1).default(1), // Halaman, minimal 1
    limit: Joi.number().integer().min(1).max(100).default(10) // Batas, antara 1 dan 100
});

export {
    getLogsSchema,
}