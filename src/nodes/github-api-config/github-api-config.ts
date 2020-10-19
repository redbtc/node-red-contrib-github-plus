import { NodeInitializer } from "node-red";
import { GithubApiClient } from "../shared/github-api-client";
import { githubApiConfigCredentials } from "./modules/config";
import { GithubApiConfigNode, GithubApiConfigNodeDef } from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function GithubApiConfigNodeConstructor(
    this: GithubApiConfigNode,
    config: GithubApiConfigNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (
      config &&
      config.appId &&
      config.instId &&
      this.credentials &&
      this.credentials.privKey
    ) {
      this.client = new GithubApiClient(
        config.appId,
        this.credentials.privKey,
        config.instId,
        {
          "user-agent": config.ua || "node-red-contrib-github-plus",
        }
      );
    }
  }

  RED.nodes.registerType("github-api-config", GithubApiConfigNodeConstructor, {
    credentials: githubApiConfigCredentials,
  });
};

export = nodeInit;
