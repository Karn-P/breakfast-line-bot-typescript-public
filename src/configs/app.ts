import * as dotenv from "dotenv";

dotenv.config();

interface ProcessEnv {
  PORT: number;
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
  SPREADSHEET_ID: string;
  BOTCOMMANDS_PHOTO: string;
}

const app: ProcessEnv = {
  PORT: Number(process.env.PORT) || 3001,
  CHANNEL_ACCESS_TOKEN: String(process.env.CHANNEL_ACCESS_TOKEN),
  CHANNEL_SECRET: String(process.env.CHANNEL_SECRET),
  SPREADSHEET_ID: String(process.env.SPREADSHEET_ID),
  BOTCOMMANDS_PHOTO: String(process.env.BOTCOMMANDS_PHOTO),
};

export default app;
