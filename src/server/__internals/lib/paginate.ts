import { PgSelect, PgSelectQueryBuilder } from "drizzle-orm/pg-core";
import { Context } from "hono";
import { sql } from "drizzle-orm";
import { db } from "../db/setup";
import { z } from "zod";

export type PaginateResult<T> = {
  data: Array<T>;
  meta: {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
    nextPage?: number | null;
    prevPage?: number | null;
    url: {
      next?: string | null;
      prev: string | null;
    };
  };
};

export const paginateQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).optional(),
});

export type PaginateQuery = z.infer<typeof paginateQuerySchema>;

export async function withPagination<
  T extends PgSelect,
  Result = T["_"]["result"][number],
>(
  qb: T,
  paginateQuery: PaginateQuery,
  url: string,
): Promise<PaginateResult<Result>> {
  let page = Number(paginateQuery.page || 1);
  let perPage = Number(paginateQuery.perPage ?? 10);

  page = page || 1;
  perPage = perPage || 10;

  const offset = (Math.max(page, 1) - 1) * perPage;
  const subQuery = qb.as("sub_query");
  const [{ count: totalRecords }] = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(subQuery);
  const data = await qb.offset(offset).limit(perPage);

  const totalPages = Math.ceil(totalRecords / perPage);
  const prevPage = page === 1 ? null : page - 1;
  const nextPage = page < totalPages ? page + 1 : null;
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  const query = urlObj.searchParams;

  const nextUrl =
    nextPage === null
      ? null
      : createPaginatePath(
          {
            page: nextPage,
            perPage: perPage,
          },
          query,
          path,
        );

  const prevUrl =
    prevPage === null
      ? null
      : createPaginatePath(
          {
            page: prevPage,
            perPage,
          },
          query,
          path,
        );

  return {
    data: data as Array<Result>,
    meta: {
      page,
      perPage,
      nextPage,
      prevPage,
      url: {
        prev: prevUrl,
        next: nextUrl,
      },
      totalRecords,
      totalPages,
    },
  };
}

function createPaginatePath(
  paginateQuery: { page: number; perPage: number },
  filterQuerys: URLSearchParams,
  path?: string,
) {
  const { page, perPage } = paginateQuery;
  const query = `page=${page}&perPage=${perPage}${filterQuerys.size > 1 ? "&" + filterQuerys.toString() : ""}`;

  return path ? `/${path}?${query}` : query;
}
