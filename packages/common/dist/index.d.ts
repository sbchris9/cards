export declare const WELCOME_MESSAGE: string;
export declare const GOODBYE_MESSAGE = "Goodbye.";
export * from './interfaces/Card';
export * from './interfaces/Row';
export * from './interfaces/Board';
export * from './interfaces/User';
export * from './schemas';
export declare type Lazy<T extends object> = Promise<T> | T;
