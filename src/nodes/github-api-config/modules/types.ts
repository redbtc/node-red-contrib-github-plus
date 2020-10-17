import { Node, NodeDef } from "node-red";
import { GithubApiConfigOptions } from "../shared/types";

export interface GithubApiConfigNodeDef extends NodeDef, GithubApiConfigOptions {}

// export interface GithubApiConfigNode extends Node {}
export type GithubApiConfigNode = Node;
