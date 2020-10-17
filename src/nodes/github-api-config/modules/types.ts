import { Node, NodeDef } from "node-red";
import { GithubApiClient } from "../../shared/github-api-client";
import {
  GithubApiConfigCredentials,
  GithubApiConfigOptions,
} from "../shared/types";

export interface GithubApiConfigNodeDef
  extends NodeDef,
    GithubApiConfigOptions {}

export interface GithubApiConfigNode extends Node<GithubApiConfigCredentials> {
  client?: GithubApiClient;
}
