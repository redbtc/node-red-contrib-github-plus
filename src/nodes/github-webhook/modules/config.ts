import { NodeCredentials } from "node-red";
import { GithubWebhookCredentials } from "../shared/types";

export const githubWebhookCredentials: NodeCredentials<GithubWebhookCredentials> = {
  secret: { type: "text" },
};
