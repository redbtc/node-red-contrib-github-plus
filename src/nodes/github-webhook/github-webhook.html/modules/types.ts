import { EditorNodeProperties } from "node-red";
import {
  GithubWebhookOptions,
  GithubWebhookCredentials,
} from "../../shared/types";

export type GithubWebhookEditorNodeCredentials = GithubWebhookCredentials;

export interface GithubWebhookEditorNodeProperties
  extends EditorNodeProperties,
    GithubWebhookOptions {}
