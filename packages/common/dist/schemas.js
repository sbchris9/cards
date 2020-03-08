"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
const username = yup
    .string()
    .required()
    .max(255)
    .min(4);
const password = yup
    .string()
    .required()
    .min(6)
    .max(32);
exports.registerSchema = yup.object().shape({
    username,
    password,
    terms: yup.boolean().oneOf([true], 'Must Accept Terms of Service')
});
exports.loginSchema = yup.object().shape({
    username,
    password
});
//# sourceMappingURL=schemas.js.map