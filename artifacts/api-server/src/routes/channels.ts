import { Router } from "express";
import { db } from "@workspace/db";
import { channelsTable, messagesTable, activityTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import {
  CreateChannelBody,
  DeleteChannelParams,
  ListMessagesParams,
  CreateMessageBody,
  CreateMessageParams,
  DeleteMessageParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(channelsTable).orderBy(channelsTable.name);
  const result = await Promise.all(rows.map(async (ch) => {
    const [{ value }] = await db.select({ value: count() }).from(messagesTable).where(eq(messagesTable.channelId, ch.id));
    return {
      ...ch,
      messageCount: Number(value),
      createdAt: ch.createdAt.toISOString(),
    };
  }));
  res.json(result);
});

router.post("/", async (req, res) => {
  const body = CreateChannelBody.parse(req.body);
  const [row] = await db.insert(channelsTable).values({
    name: body.name,
    description: body.description ?? "",
  }).returning();
  res.status(201).json({
    ...row,
    messageCount: 0,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteChannelParams.parse({ id: Number(req.params.id) });
  await db.delete(messagesTable).where(eq(messagesTable.channelId, id));
  await db.delete(channelsTable).where(eq(channelsTable.id, id));
  res.status(204).send();
});

router.get("/:channelId/messages", async (req, res) => {
  const { channelId } = ListMessagesParams.parse({ channelId: Number(req.params.channelId) });
  const rows = await db.select().from(messagesTable)
    .where(eq(messagesTable.channelId, channelId))
    .orderBy(desc(messagesTable.createdAt));
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/:channelId/messages", async (req, res) => {
  const { channelId } = CreateMessageParams.parse({ channelId: Number(req.params.channelId) });
  const body = CreateMessageBody.parse(req.body);
  const [row] = await db.insert(messagesTable).values({
    channelId,
    content: body.content,
    author: body.author,
  }).returning();
  await db.insert(activityTable).values({
    type: "message",
    description: `New message in channel`,
    actor: body.author,
  });
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/messages/:id", async (req, res) => {
  const { id } = DeleteMessageParams.parse({ id: Number(req.params.id) });
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
  res.status(204).send();
});

export default router;
