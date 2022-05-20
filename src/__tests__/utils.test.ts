import { parseAsArray } from "../utils/parseAsArray";
import { getInputAsArray } from "../utils/getInputAsArray";

describe.each([{ s: "a,b" }, { s: "a, b" }, { s: " a,,b " }, { s: "a,b,," }])(
  "converting string '$s' to array",
  ({ s }) => {
    const expected = ["a", "b"];
    test(`returns ${expected}`, () => {
      expect(parseAsArray(s)).toStrictEqual(expected);
    });
  }
);

describe("action input tests", () => {
  const setInput = (name: string, value: any) => {
    process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] = value;
  };

  it("return multiple values in array", () => {
    setInput("test", "a,b");
    expect(getInputAsArray("test")).toStrictEqual(["a", "b"]);
  });

  it("return single value in array", () => {
    setInput("test", "a");
    expect(getInputAsArray("test")).toStrictEqual(["a"]);
  });
});
