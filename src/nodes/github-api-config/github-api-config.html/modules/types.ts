import { EditorNodeProperties } from "node-red";
import { GithubApiConfigOptions } from "../../shared/types";

export interface GithubApiConfigEditorNodeProperties
  extends EditorNodeProperties,
    GithubApiConfigOptions {}
