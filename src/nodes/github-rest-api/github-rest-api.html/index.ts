import { EditorRED } from "node-red";
import { GithubRestApiEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GithubRestApiEditorNodeProperties>("github-rest-api", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "github rest api",
  label: function () {
    return this.name || "github rest api";
  },
});
