import { NodeInitializer } from "node-red";
import { GithubRestApiNode, GithubRestApiNodeDef } from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function GithubRestApiNodeConstructor(
    this: GithubRestApiNode,
    config: GithubRestApiNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType("github-rest-api", GithubRestApiNodeConstructor);
};

export = nodeInit;
