import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import githubRestApiNode from "../nodes/github-rest-api/github-rest-api";
import { GithubRestApiNodeDef } from "../nodes/github-rest-api/modules/types";

type FlowsItem = TestFlowsItem<GithubRestApiNodeDef>;
type Flows = Array<FlowsItem>;

describe("github-rest-api node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [
      { id: "n1", type: "github-rest-api", name: "github-rest-api" },
    ];
    testHelper.load(githubRestApiNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("github-rest-api");
      done();
    });
  });
});
