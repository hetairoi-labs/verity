import axios from "axios";
import { ApiError } from "./hono/error";
import { logger } from "./pino";

export class AxiosClient {
	private readonly axiosInstance;

	constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			headers: defaultHeaders,
		});

		// Convert axios errors to ApiError
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response) {
					throw new ApiError(
						500,
						`Axios Error: ${error.response.status} ${error.response.statusText}`,
						{
							error: error.response.data,
						}
					);
				}
				throw new ApiError(500, `Network error: ${error.message}`);
			}
		);
	}

	async get<T = unknown>(endpoint: string): Promise<T> {
		logger.debug({ endpoint }, "axios.get.request");
		const response = await this.axiosInstance.get(endpoint);
		return response.data;
	}

	async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
		logger.debug({ endpoint, data }, "axios.post.request");
		const response = await this.axiosInstance.post(endpoint, data);
		return response.data;
	}

	async delete<T = unknown>(endpoint: string): Promise<T> {
		logger.debug({ endpoint }, "axios.delete.request");
		const response = await this.axiosInstance.delete(endpoint);
		return response.data;
	}
}
