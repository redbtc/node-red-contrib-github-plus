import { createAppAuth } from "@octokit/auth-app";
import { RequestInterface } from "@octokit/auth-app/dist-types/types";
import { request } from "@octokit/request";

export interface GithubApiConfigOptions {
  appId: string; // application id
  instId: string; // installation id
}

export interface GithubApiConfigCredentials {
  privKey: string; // private key
}

export class GithubApiClient {
  public request: RequestInterface;
  constructor(
    appId: string,
    privKey: string,
    instId: string,
    headers: {
      "user-agent": string;
    }
  ) {
    const auth = createAppAuth({
      id: appId,
      privateKey: privKey,
      installationId: instId,
    });
    this.request = request.defaults({
      headers,
      request: {
        hook: auth.hook,
      },
    });
  }
}
