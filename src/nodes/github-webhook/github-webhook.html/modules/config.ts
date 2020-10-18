import { EditorNodeCredentials } from "node-red";
import { GithubWebhookCredentials } from "../../shared/types";

export const githubWebhookCredentials: EditorNodeCredentials<GithubWebhookCredentials> = {
  secret: { type: "text" },
};
