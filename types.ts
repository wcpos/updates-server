import type {ElysiaApp as App} from './index';

export type ElysiaApp = App;

export type ErrorResponse = {
	status: number;
	error: string;
	message: string;
	code?: string;
	details?: Record<string, any>;
};

export type ValidResponse<T> = {
	status: number;
	data: T;
	message?: string;
};
