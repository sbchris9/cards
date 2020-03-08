export const WELCOME_MESSAGE: string = 'HELLO!!!';
export const GOODBYE_MESSAGE = 'Goodbye.';

export * from './interfaces/Card';
export * from './interfaces/Row';
export * from './interfaces/Board';
export * from './interfaces/User';

export * from './schemas';

export type Lazy<T extends object> = Promise<T> | T;
