import { Client, middleware } from "@line/bot-sdk";
import express, { Request, Response, Router } from "express";
import config from "../configs/app";
import WebhookService from "../services/webhook.service";
const webhookRouter: Router = express.Router();

const lineConfig: any = {
  channelAccessToken: config.CHANNEL_ACCESS_TOKEN,
  channelSecret: config.CHANNEL_SECRET,
};

const client: Client = new Client(lineConfig);

webhookRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is breakfast-bot-server");
});

webhookRouter.post(
  "/webhook",
  middleware(lineConfig),
  async (req: Request, res: Response) => {
    try {
      const events = req.body.events;
      if (events.length > 0) {
        await events.map((event: any) => WebhookService(event, client));
      }
      res.status(200).send("OK");
    } catch (error) {
      res.status(500).end();
    }
  }
);

export default webhookRouter;
