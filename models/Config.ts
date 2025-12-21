// models/Config.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IConfig extends Document {
  USER_ID?: string;
  GITHUB_TOKEN: string;
  GITHUB_WEBHOOK_SECRET?: string;
  GITHUB_USERNAME: string;
  GITHUB_REPO?: string;
  TWITTER_API_KEY: string;
  TWITTER_API_SECRET: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_ACCESS_SECRET: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema: Schema = new Schema(
  {
     USER_ID: {
      type: String,
      required: true,
    },
    GITHUB_TOKEN: {
      type: String,
      required: true,
    },
    GITHUB_WEBHOOK_SECRET: {
      type: String,
      required: false,
    },
    GITHUB_USERNAME: {
      type: String,
      required: true,
    },
    GITHUB_REPO: {
      type: String,
      required: false,
    },
    TWITTER_API_KEY: {
      type: String,
      required: true,
    },
    TWITTER_API_SECRET: {
      type: String,
      required: true,
    },
    TWITTER_ACCESS_TOKEN: {
      type: String,
      required: true,
    },
    TWITTER_ACCESS_SECRET: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);