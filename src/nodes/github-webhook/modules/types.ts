import { Node, NodeDef } from "node-red";
import {
  GithubWebhookOptions,
  GithubWebhookCredentials,
} from "../shared/types";

export interface GithubWebhookNodeDef extends NodeDef, GithubWebhookOptions {}

// export interface GithubWebhookNode extends Node {}
export type GithubWebhookNode = Node<GithubWebhookCredentials>;
