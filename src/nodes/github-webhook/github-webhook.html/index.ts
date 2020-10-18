import { EditorRED } from "node-red";
import { githubWebhookCredentials } from "./modules/config";
import {
  GithubWebhookEditorNodeCredentials,
  GithubWebhookEditorNodeProperties,
} from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<
  GithubWebhookEditorNodeProperties,
  GithubWebhookEditorNodeCredentials
>("github-webhook", {
  category: "github",
  color: "#9CDAF1",
  defaults: {
    path: { value: "", required: true },
    name: { value: "" },
  },
  credentials: githubWebhookCredentials,
  inputs: 0,
  outputs: 1,
  icon: "github-logo.svg",
  paletteLabel: "webhook",
  label: function () {
    if (this.name) {
      return this.name;
    }
    if (this.path) {
      let path = RED.settings.httpNodeRoot || "";
      if (path.slice(-1) !== "/") {
        path = path + "/";
      }
      if (this.path.charAt(0) === "/") {
        path += this.path.slice(1);
      } else {
        path += this.path;
      }
      return path;
    } else {
      return "github webhook";
    }
  },
  oneditprepare: function () {
    let root = RED.settings.httpNodeRoot || "";
    if (root.slice(-1) == "/") {
      root = root.slice(0, -1);
    }
    if (root == "") {
      $("#form-tips").hide();
    } else {
      $("#form-tips-path").html(root);
      $("#form-tips").show();
    }

    $("#generateSecret").on("click", (evt) => {
      evt.preventDefault();
      const secretChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let arr = new Uint8Array(40);
      window.crypto.getRandomValues(arr);
      arr = arr.map((x) => secretChars.charCodeAt(x % secretChars.length));
      let secret = "";
      arr.forEach((byte: number) => {
        secret += String.fromCharCode(byte);
      });
      $("#node-input-secret").val(secret);
    });
  },
  oneditsave: function () {
    let val = $("#node-input-path").val()?.toString() || "";
    val = val.trim();
    if (val.length > 0) {
      if (val.substr(0, 1) !== "/") {
        val = "/" + val;
      }
    }
    $("#node-input-path").val(val);
  },
});
