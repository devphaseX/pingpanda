import { Hono } from "hono";

const app = new Hono().post("/sign-in");

export default app;
