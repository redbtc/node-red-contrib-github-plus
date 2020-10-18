import bodyParser from "body-parser";
import { createHmac, timingSafeEqual } from "crypto";
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { IncomingMessage } from "http";
import { NodeInitializer, NodeMessageInFlow, NodeStatus } from "node-red";
import { githubWebhookCredentials } from "./modules/config";
import { GithubWebhookNode, GithubWebhookNodeDef } from "./modules/types";

interface WithRawBody {
  rawBody: Buffer;
}

interface RequestWithRawBody extends Request, WithRawBody {}

interface IncomingMessageWithRawBody extends IncomingMessage, WithRawBody {}

interface GHNodeMessage extends NodeMessageInFlow {
  topic: string;
  guid: string;
}

type Statuses = Record<
  "misconfigured" | "error" | "listening" | "blank",
  NodeStatus
>;

const statuses: Statuses = {
  misconfigured: {
    fill: "red",
    shape: "ring",
    text: "misconfigured",
  },
  error: { fill: "red", shape: "dot", text: "error" },
  listening: {
    fill: "green",
    shape: "dot",
    text: "listening",
  },
  blank: {},
};

const nodeInit: NodeInitializer = (RED): void => {
  function GithubWebhookNodeConstructor(
    this: GithubWebhookNode,
    config: GithubWebhookNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    if (RED.settings.httpNodeRoot === false) {
      this.error(
        "Cannot create github-webhook node when httpNodeRoot set to false"
      );
      this.status(statuses.misconfigured);
      return;
    }

    if (!config.path) {
      this.status(statuses.misconfigured);
      return;
    }

    let path = config.path;
    if (path[0] !== "/") {
      path = "/" + path;
    }

    // NodeRED uses bodyParser.json on httpAdminRoot, and this makes it impossible to get raw body on all child paths
    if (RED.settings.httpAdminRoot === "/") {
      this.error(
        "Cannot create github-webhook node when httpAdminRoot set to '/'"
      );
      this.status(statuses.misconfigured);
      return;
    }
    if (
      typeof RED.settings.httpAdminRoot === "string" &&
      path.startsWith(RED.settings.httpAdminRoot)
    ) {
      this.error(
        `Cannot create github-webhook node on child routes of httpAdminRoot (${RED.settings.httpAdminRoot})`
      );
      this.status(statuses.misconfigured);
      return;
    }

    if (!this.credentials.secret) {
      this.status(statuses.misconfigured);
      return;
    }

    const secret = this.credentials.secret;

    const postHandler = (
      req: RequestWithRawBody,
      res: Response,
      _next: NextFunction
    ): void => {
      const evtName = req.headers["x-github-event"] as string;
      const guid = req.headers["x-github-delivery"] as string;

      const msg: GHNodeMessage = {
        _msgid: RED.util.generateId(),
        guid,
        topic: evtName,
        payload: req.body,
      };
      this.send(msg);
      res.status(200).send("ok");

      // status = time of the last notification
      this.status({
        ...statuses.listening,
        text: new Date().toISOString(),
      });
    };

    const errorHandler: ErrorRequestHandler = (err, _req, res, _next): void => {
      this.error(err);
      res.sendStatus(err.status || 500);
      this.status(statuses.error);
    };

    const jsonParser = bodyParser.json({
      // Payloads are capped at 25 MB
      // Source: https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/webhook-events-and-payloads#webhook-payload-object-common-properties
      limit: "25mb",
      // Get Raw Body
      verify: (req: IncomingMessageWithRawBody, _res, buf, _encoding) => {
        const noHeaders = [
          "x-github-delivery",
          "x-github-event",
          "x-hub-signature-256",
        ].filter((header) => !(header in req.headers));
        if (noHeaders.length > 0) {
          throw new Error(
            "invalid incoming data (missing headers): " + noHeaders.join(", ")
          );
        }

        const sig = req.headers["x-hub-signature-256"] as string;

        const bufSig1 = Buffer.from(sig);
        const bufSig2 = Buffer.from(
          "sha256=" + createHmac("sha256", secret).update(buf).digest("hex")
        );

        if (
          bufSig1.length !== bufSig2.length ||
          !timingSafeEqual(bufSig1, bufSig2)
        ) {
          throw new Error("Invalid incoming data (signature mismatch)");
        }
      },
    });

    this.status({
      ...statuses.listening,
      text: "no notifications yet",
    });

    // add listener
    RED.httpNode.post(
      path,
      jsonParser,
      postHandler as RequestHandler,
      errorHandler
    );

    this.on("close", () => {
      // remove listener(s)
      (RED.httpNode._router.stack as {
        route?: {
          path: string;
          methods: { post?: unknown };
        };
      }[]).forEach((route, i, routes) => {
        if (
          route.route &&
          route.route.path === path &&
          route.route.methods.post
        ) {
          routes.splice(i, 1);
        }
      });
    });
  }

  RED.nodes.registerType("github-webhook", GithubWebhookNodeConstructor, {
    credentials: githubWebhookCredentials,
  });
};

export = nodeInit;
