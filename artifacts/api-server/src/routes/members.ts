import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable, activityTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateMemberBody,
  UpdateMemberBody,
  UpdateMemberParams,
  DeleteMemberParams,
} from "@workspace/api-zod";

const router = Router();

const serializeMember = (r: typeof membersTable.$inferSelect) => ({
  ...r,
  joinedAt: r.joinedAt.toISOString(),
});

router.get("/", async (_req, res) => {
  const rows = await db.select().from(membersTable).orderBy(membersTable.name);
  res.json(rows.map(serializeMember));
});

router.post("/", async (req, res) => {
  const body = CreateMemberBody.parse(req.body);
  const [row] = await db.insert(membersTable).values({
    name: body.name,
    role: body.role,
    bio: body.bio ?? null,
    avatarUrl: body.avatarUrl ?? null,
  }).returning();
  await db.insert(activityTable).values({
    type: "member",
    description: `New member joined: ${body.name}`,
    actor: body.name,
  });
  res.status(201).json(serializeMember(row));
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateMemberParams.parse({ id: Number(req.params.id) });
  const body = UpdateMemberBody.parse(req.body);
  const [row] = await db.update(membersTable).set(body).where(eq(membersTable.id, id)).returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(serializeMember(row));
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteMemberParams.parse({ id: Number(req.params.id) });
  await db.delete(membersTable).where(eq(membersTable.id, id));
  res.status(204).send();
});

export default router;
