import { Node, NodeDef } from "node-red";
import { GithubRestApiOptions } from "../shared/types";

export interface GithubRestApiNodeDef extends NodeDef, GithubRestApiOptions {}

// export interface GithubRestApiNode extends Node {}
export type GithubRestApiNode = Node;
