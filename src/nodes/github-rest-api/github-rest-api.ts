import { NodeInitializer, NodeStatus, NodeMessageInFlow } from "node-red";
import { GithubApiConfigNode } from "../github-api-config/modules/types";
import { GithubRestApiNode, GithubRestApiNodeDef } from "./modules/types";

const statuses: Record<
  "idle" | "misconfigured" | "error" | "sending" | "blank",
  NodeStatus
> = {
  idle: { fill: "green", shape: "dot", text: "idle" },
  misconfigured: {
    fill: "red",
    shape: "ring",
    text: "misconfigured",
  },
  error: { fill: "red", shape: "ring", text: "error" },
  sending: { fill: "blue", shape: "dot", text: "sending" },
  blank: {},
};

interface GithubMessage extends NodeMessageInFlow {
  endpoint?: unknown;
  payload?: unknown;
}

const nodeInit: NodeInitializer = (RED): void => {
  function GithubRestApiNodeConstructor(
    this: GithubRestApiNode,
    config: GithubRestApiNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (!config.client) {
      this.status(statuses.misconfigured);
      return;
    }

    const clientNode = RED.nodes.getNode(config.client) as GithubApiConfigNode;
    if (!clientNode || !clientNode.client) {
      this.status(statuses.misconfigured);
      return;
    }

    const githubClient = clientNode.client;

    this.on("input", async (msg: GithubMessage, send, done) => {
      const endpoint = config.endpoint || msg.endpoint;
      if (typeof endpoint !== "string") {
        done(new Error("Invalid Endpoint: " + endpoint));
        return;
      }

      const payload = (msg.payload as Record<string, unknown>) || {};
      if (typeof payload !== "object") {
        done(new Error("Invalid Payload: " + payload));
        return;
      }

      try {
        this.status(statuses.sending);
        const resData = await githubClient.request(endpoint, payload);
        this.status(statuses.idle);
        msg.payload = resData;
      } catch (e) {
        this.status(statuses.error);
        done(e);
        return;
      }

      send(msg);
      done();
    });

    this.on("close", () => {
      this.status({});
    });

    this.status(statuses.idle);
  }

  RED.nodes.registerType("github-rest-api", GithubRestApiNodeConstructor);
};

export = nodeInit;
