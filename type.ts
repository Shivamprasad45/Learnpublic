export interface ConfigFormData {
  USER_ID?: string;
  OPENAI_API_KEY?: string;
  GITHUB_TOKEN: string;
  GITHUB_WEBHOOK_SECRET: string;
  GITHUB_USERNAME: string;
  GITHUB_REPO: string;
  TWITTER_API_KEY: string;
  TWITTER_API_SECRET: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_ACCESS_SECRET: string;
}   
export interface UserData {
  id: string;
  email: string;
  name: string;
}