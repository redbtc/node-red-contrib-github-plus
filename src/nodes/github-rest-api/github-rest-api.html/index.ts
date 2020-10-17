import { EditorRED } from "node-red";
import { GithubRestApiEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GithubRestApiEditorNodeProperties>("github-rest-api", {
  category: "github",
  color: "#9CDAF1",
  defaults: {
    endpoint: { value: "" },
    client: { value: "", type: "github-api-config", required: true },
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "github-logo.svg",
  paletteLabel: "rest api",
  label: function () {
    if (this.name) {
      return this.name;
    }
    if (this.endpoint) {
      const parts = this.endpoint.split(" ");
      const method = parts[0];
      let path = parts.length > 1 ? parts[parts.length - 1] : "";
      if (path.length > 20) {
        path = "…" + path.substr(-20);
      }
      return [method, path].join(" ");
    }
    return "github rest api";
  },
  oneditsave: function () {
    let val = $("#node-input-endpoint").val()?.toString() || "";
    val = val.trim();
    $("#node-input-endpoint").val(val);
  },
});
