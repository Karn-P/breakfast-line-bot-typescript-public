import express, { Request, Response, Router } from "express";
import webhookRouter from "./webhook";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is breakfast-bot-server");
});
router.use("webhook", webhookRouter);

export default router;
