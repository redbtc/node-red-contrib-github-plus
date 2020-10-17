import { EditorRED } from "node-red";
import { githubApiConfigCredentials } from "./modules/config";
import {
  GithubApiConfigEditorNodeCredentials,
  GithubApiConfigEditorNodeProperties,
} from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<
  GithubApiConfigEditorNodeProperties,
  GithubApiConfigEditorNodeCredentials
>("github-api-config", {
  category: "config",
  defaults: {
    appId: { value: "", validate: RED.validators.number(), required: true },
    instId: { value: "", validate: RED.validators.number(), required: true },
    name: { value: "" },
  },
  credentials: githubApiConfigCredentials,
  label: function () {
    return this.name || "GitHub API client config";
  },
});
