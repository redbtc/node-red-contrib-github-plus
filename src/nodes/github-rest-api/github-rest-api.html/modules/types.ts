import { EditorNodeProperties } from "node-red";
import { GithubRestApiOptions } from "../../shared/types";

export interface GithubRestApiEditorNodeProperties
  extends EditorNodeProperties,
    GithubRestApiOptions {}
