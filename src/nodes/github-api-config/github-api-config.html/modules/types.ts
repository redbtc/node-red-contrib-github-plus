import { EditorNodeProperties } from "node-red";
import {
  GithubApiConfigCredentials,
  GithubApiConfigOptions,
} from "../../shared/types";

export type GithubApiConfigEditorNodeCredentials = GithubApiConfigCredentials;

export interface GithubApiConfigEditorNodeProperties
  extends EditorNodeProperties,
    GithubApiConfigOptions {}
