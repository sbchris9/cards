import * as yup from 'yup';
export declare const registerSchema: yup.ObjectSchema<yup.Shape<object, {
    username: string;
    password: string;
    terms: boolean;
}>>;
export declare const loginSchema: yup.ObjectSchema<yup.Shape<object, {
    username: string;
    password: string;
}>>;
