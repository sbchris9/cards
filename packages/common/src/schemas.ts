import * as yup from 'yup';

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

export const registerSchema = yup.object().shape({
  username,
  password,
  terms: yup.boolean().oneOf([true], 'Must Accept Terms of Service')
});

export const loginSchema = yup.object().shape({
  username,
  password
});

export const cardSchema = yup.object().shape({
  title: yup.string().max(255),
  content: yup.string().max(255)
});
