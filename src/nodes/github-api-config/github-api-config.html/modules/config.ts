import { EditorNodeCredentials } from "node-red";
import { GithubApiConfigCredentials } from "../../shared/types";

export const githubApiConfigCredentials: EditorNodeCredentials<GithubApiConfigCredentials> = {
  privKey: { type: "text" },
};
