// src/utils/paginationHandler.ts
import { Response } from "express";
import { ResponseHandler } from "./responseHandler";
import {PaginatedResult, PaginationMeta, PaginationParams } from "../Types/paginationType";

/**
 * Scalable Pagination Handler (Postgres + Drizzle ready)
 */
export class PaginationHandler {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  /**
   * Parse and normalize query parameters
   */
  static parseParams(query: any): Required<PaginationParams> {
    const page = Math.max(1, Number.parseInt(query.page) || this.DEFAULT_PAGE);
    const requestedLimit = Number.parseInt(query.limit) || this.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, requestedLimit), this.MAX_LIMIT);

    const sortBy = query.sortBy || "createdAt";
    const sortOrder =
      ["asc", "desc"].includes(query.sortOrder?.toLowerCase())
        ? query.sortOrder.toLowerCase()
        : "desc";

    return { page, limit, sortBy, sortOrder: sortOrder as "asc" | "desc" };
  }

  /**
   * Get SQL OFFSET for pagination
   */
  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Build pagination metadata
   */
  static getMeta(page: number, limit: number, totalItems: number): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return {
      currentPage: page,
      pageSize: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Create paginated result (for service layer)
   */
  static createResult<T>(
    data: T[],
    totalItems: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    return {
      data,
      meta: this.getMeta(page, limit, totalItems),
    };
  }

  /**
   * Send paginated response (for controller layer)
   */
  static send<T>(
    res: Response,
    data: T[],
    totalItems: number,
    page: number,
    limit: number,
    message = "Data fetched successfully"
  ) {
    const meta = this.getMeta(page, limit, totalItems);
    return ResponseHandler.ok(res, message, data, meta);
  }
}
