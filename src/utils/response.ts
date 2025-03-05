import { ErrorCode } from "@/server/__internals/constants/response_code";
import { type Context } from "hono";
import {
  type ContentfulStatusCode,
  type StatusCode,
} from "hono/utils/http-status";
import StatusCodes from "http-status";

type ApiBaseResponse = {
  success: boolean;
  message?: string;
};

export type ApiSuccessResponse<Data = unknown> = {
  success: true;
} & ApiBaseResponse &
  Data;

export type ApiErrorResponse = {
  success: false;
  error_code?: ErrorCode;
  message: string;
  errors: Record<string, unknown> | Error;
} & ApiBaseResponse;

export function successResponse<
  Data = unknown,
  Code extends ContentfulStatusCode = 200,
>(c: Context, data?: Data, code?: Code, message?: string) {
  return c.json(
    <ApiSuccessResponse<Data>>{ success: true, message, ...data },
    code ?? StatusCodes.OK,
  );
}

export function errorResponse<Code extends ContentfulStatusCode = 500>(
  c: Context,
  message: string,
  code?: Code,
  options?: {
    error_code?: ErrorCode;
    errors?: any;
  },
) {
  const { error_code, errors } = options ?? {};
  return c.json(
    <ApiErrorResponse>{ success: false, message, error_code, errors },
    code ?? StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

export function internalServerErrorResponse(
  c: Context,
  options?: {
    errors?: any;
  },
) {
  const { errors } = options ?? {};

  // Default message with a more user-friendly tone
  const message =
    "Oops! Something went wrong on our end. Please try again later.";

  // Construct the response object
  const response: ApiErrorResponse = {
    success: false,
    message,
    error_code: ErrorCode.INTERNAL_SERVER_ERROR,
    errors,
  };

  return c.json(response, StatusCodes.INTERNAL_SERVER_ERROR);
}
