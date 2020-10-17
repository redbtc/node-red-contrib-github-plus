import { EditorRED } from "node-red";
import { GithubApiConfigEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GithubApiConfigEditorNodeProperties>("github-api-config", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "github api config",
  label: function () {
    return this.name || "github api config";
  },
});
