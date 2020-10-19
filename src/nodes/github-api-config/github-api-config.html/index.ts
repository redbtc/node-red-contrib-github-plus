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
    ua: { value: "" },
    name: { value: "" },
  },
  credentials: githubApiConfigCredentials,
  label: function () {
    return this.name || "GitHub API client config";
  },
  oneditprepare: function () {
    $("#ghPemFile").on("change", (evt) => {
      const files = (<HTMLInputElement>evt.target).files;

      if (!files || files.length < 1) {
        return;
      }
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (_evt) => {
        $("#ghPemFile").val("");
        const text = reader.result?.toString().trim() || "";
        if (
          text.length < 100 ||
          text.length > 10000 ||
          !text.startsWith("-----BEGIN RSA PRIVATE KEY-----") ||
          !text.endsWith("-----END RSA PRIVATE KEY-----")
        ) {
          RED.notifications.notify("Invalid key file", "error");
          return;
        }
        $("#node-config-input-privKey").val(text);
      };

      reader.readAsText(file);
    });
  },
});
