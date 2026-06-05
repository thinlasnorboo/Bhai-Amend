import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable, activityTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateAnnouncementBody,
  UpdateAnnouncementBody,
  GetAnnouncementParams,
  UpdateAnnouncementParams,
  DeleteAnnouncementParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt));
  const result = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
  }));
  res.json(result);
});

router.post("/", async (req, res) => {
  const body = CreateAnnouncementBody.parse(req.body);
  const [row] = await db.insert(announcementsTable).values({
    title: body.title,
    content: body.content,
    author: body.author,
    pinned: body.pinned ?? false,
  }).returning();
  await db.insert(activityTable).values({
    type: "announcement",
    description: `New announcement: "${body.title}"`,
    actor: body.author,
  });
  res.status(201).json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = GetAnnouncementParams.parse({ id: Number(req.params.id) });
  const [row] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateAnnouncementParams.parse({ id: Number(req.params.id) });
  const body = UpdateAnnouncementBody.parse(req.body);
  const [row] = await db.update(announcementsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(announcementsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteAnnouncementParams.parse({ id: Number(req.params.id) });
  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));
  res.status(204).send();
});

export default router;
