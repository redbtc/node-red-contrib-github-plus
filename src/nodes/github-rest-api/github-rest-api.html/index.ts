import { EditorRED } from "node-red";
import { GithubRestApiEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GithubRestApiEditorNodeProperties>("github-rest-api", {
  category: "github",
  color: "#C0C0C0",
  defaults: {
    endpoint: { value: "" },
    client: { value: "", type: "github-api-config", required: true },
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "github-logo.svg",
  paletteLabel: "github rest api",
  label: function () {
    if (this.name) {
      return this.name;
    }
    if (this.endpoint) {
      return this.endpoint.length > 25
        ? this.endpoint.substr(0, 25) + "…"
        : this.endpoint;
    }
    return "github rest api";
  },
  oneditsave: function () {
    let val = $("#node-input-endpoint").val()?.toString() || "";
    val = val.trim();
    $("#node-input-endpoint").val(val);
  },
});
