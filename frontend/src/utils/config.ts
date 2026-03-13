// src/utils/config.ts
// Centralized configuration for the app

/**
 * API base URL for all backend requests.
 * Change this value when switching between environments.
 */
const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.4.20.210:3000/api";
const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
export const API_BASE_URL = `${trimmedApiBaseUrl}/`;

/**
 * Socket server URL (without /api/ path).
 */
export const SOCKET_SERVER_URL =
	process.env.EXPO_PUBLIC_SOCKET_URL || trimmedApiBaseUrl.replace(/\/api$/, "");
