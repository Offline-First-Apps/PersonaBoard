import { env } from "@personaboard/env/server";
import prisma from "@personaboard/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
});

app.post("/leads", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "A valid name and email are required." }, 400);
  }
  const lead = await prisma.lead.create({ data: parsed.data });
  return c.json({ id: lead.id, createdAt: lead.createdAt }, 201);
});

app.get("/leads", async (c) => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return c.json(leads);
});

export default app;
