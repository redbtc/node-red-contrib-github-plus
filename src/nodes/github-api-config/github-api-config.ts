import { NodeInitializer } from "node-red";
import { GithubApiConfigNode, GithubApiConfigNodeDef } from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function GithubApiConfigNodeConstructor(
    this: GithubApiConfigNode,
    config: GithubApiConfigNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType("github-api-config", GithubApiConfigNodeConstructor);
};

export = nodeInit;
