import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable, channelsTable, messagesTable, eventsTable, membersTable, activityTable } from "@workspace/db";
import { count, gte, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const [[{ total: totalMembers }], [{ total: totalAnnouncements }], [{ total: totalChannels }], [{ total: totalMessages }], [{ total: totalEvents }], [{ total: upcomingEventsCount }]] = await Promise.all([
    db.select({ total: count() }).from(membersTable),
    db.select({ total: count() }).from(announcementsTable),
    db.select({ total: count() }).from(channelsTable),
    db.select({ total: count() }).from(messagesTable),
    db.select({ total: count() }).from(eventsTable),
    db.select({ total: count() }).from(eventsTable).where(gte(eventsTable.startDate, new Date())),
  ]);
  res.json({
    totalMembers: Number(totalMembers),
    totalAnnouncements: Number(totalAnnouncements),
    totalChannels: Number(totalChannels),
    totalMessages: Number(totalMessages),
    totalEvents: Number(totalEvents),
    upcomingEventsCount: Number(upcomingEventsCount),
  });
});

router.get("/recent-activity", async (_req, res) => {
  const rows = await db.select().from(activityTable).orderBy(desc(activityTable.occurredAt)).limit(20);
  res.json(rows.map((r) => ({ ...r, occurredAt: r.occurredAt.toISOString() })));
});

router.get("/upcoming-events", async (_req, res) => {
  const rows = await db.select().from(eventsTable)
    .where(gte(eventsTable.startDate, new Date()))
    .orderBy(eventsTable.startDate)
    .limit(5);
  res.json(rows.map((r) => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate ? r.endDate.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  })));
});

export default router;
