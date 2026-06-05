import { Router, type IRouter } from "express";
import healthRouter from "./health";
import announcementsRouter from "./announcements";
import channelsRouter from "./channels";
import eventsRouter from "./events";
import membersRouter from "./members";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/announcements", announcementsRouter);
router.use("/channels", channelsRouter);
router.use("/events", eventsRouter);
router.use("/members", membersRouter);
router.use("/stats", statsRouter);

export default router;
