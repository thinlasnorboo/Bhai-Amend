import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, activityTable } from "@workspace/db";
import { eq, desc, gte } from "drizzle-orm";
import {
  CreateEventBody,
  UpdateEventBody,
  GetEventParams,
  UpdateEventParams,
  DeleteEventParams,
} from "@workspace/api-zod";

const router = Router();

const serializeEvent = (r: typeof eventsTable.$inferSelect) => ({
  ...r,
  startDate: r.startDate.toISOString(),
  endDate: r.endDate ? r.endDate.toISOString() : null,
  createdAt: r.createdAt.toISOString(),
});

router.get("/", async (_req, res) => {
  const rows = await db.select().from(eventsTable).orderBy(desc(eventsTable.startDate));
  res.json(rows.map(serializeEvent));
});

router.post("/", async (req, res) => {
  const body = CreateEventBody.parse(req.body);
  const [row] = await db.insert(eventsTable).values({
    title: body.title,
    description: body.description ?? "",
    location: body.location,
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : null,
    organizer: body.organizer,
  }).returning();
  await db.insert(activityTable).values({
    type: "event",
    description: `New event: "${body.title}"`,
    actor: body.organizer,
  });
  res.status(201).json(serializeEvent(row));
});

router.get("/:id", async (req, res) => {
  const { id } = GetEventParams.parse({ id: Number(req.params.id) });
  const [row] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(serializeEvent(row));
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateEventParams.parse({ id: Number(req.params.id) });
  const body = UpdateEventBody.parse(req.body);
  const updates: Partial<typeof eventsTable.$inferInsert> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.location !== undefined) updates.location = body.location;
  if (body.startDate !== undefined) updates.startDate = new Date(body.startDate);
  if (body.endDate !== undefined) updates.endDate = body.endDate ? new Date(body.endDate) : null;
  const [row] = await db.update(eventsTable).set(updates).where(eq(eventsTable.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(serializeEvent(row));
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteEventParams.parse({ id: Number(req.params.id) });
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.status(204).send();
});

export const getUpcomingEvents = async () => {
  const now = new Date();
  const rows = await db.select().from(eventsTable)
    .where(gte(eventsTable.startDate, now))
    .orderBy(eventsTable.startDate)
    .limit(5);
  return rows.map(serializeEvent);
};

export default router;
