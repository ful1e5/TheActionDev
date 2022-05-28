import * as os from "os";

import { parseAsArray } from "../utils/parseAsArray";
import { getInputAsArray } from "../utils/getInputAsArray";
import { parseFrontMatter } from "../utils/parseFrontMatter";

describe.each([{ s: "a,b" }, { s: "a, b" }, { s: " a,,b " }, { s: "a,b,," }])(
  "converting string '$s' to array",
  ({ s }) => {
    const expected = ["a", "b"];
    test(`returns ${expected}`, () => {
      expect(parseAsArray(s)).toStrictEqual(expected);
    });
  }
);

describe("input as array tests", () => {
  const setInput = (name: string, value: any) => {
    process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] = value;
  };

  it("returning multiple values with array", () => {
    setInput("test", "a,b");
    expect(getInputAsArray("test")).toStrictEqual(["a", "b"]);
  });

  it("returning single value with array", () => {
    setInput("test", "a");
    expect(getInputAsArray("test")).toStrictEqual(["a"]);
  });
});

describe("front-matter parser tests", () => {
  beforeEach(() => {
    process.stdout.write = jest.fn();
  });

  // Assert that process.stdout.write calls called only with the given arguments.
  const assertWriteCalls = (calls: string[]): void => {
    expect(process.stdout.write).toHaveBeenCalledTimes(calls.length);

    for (let i = 0; i < calls.length; i++) {
      expect(process.stdout.write).toHaveBeenNthCalledWith(i + 1, calls[i]);
    }
  };

  it("ignore warning messages", () => {
    parseFrontMatter("");
    assertWriteCalls([
      `Parsing Front-Matter...${os.EOL}`,
      `::warning::dev.to Front-Matter not found. Ignoring this file.${os.EOL}`,
      `By adding this file name to \`ignore\` list to prevent from sync.${os.EOL}`
    ]);
  });

  it("title parsing error", () => {
    parseFrontMatter(`
---
title:
published: false
description: Test Post
series: Test
tags: Test
cover_image: https://www.test.com
---

Testing!
`);
    assertWriteCalls([
      `Parsing Front-Matter...${os.EOL}`,
      `::error::Unable to find article title.${os.EOL}`
    ]);
  });

  it("parsing undefined data", () => {
    const result = parseFrontMatter(`
---
title: Test
---
Test Body
`);
    assertWriteCalls([`Parsing Front-Matter...${os.EOL}`]);
    expect(result).toMatchObject({
      title: "Test",
      description: undefined,
      published: false,
      body_markdown: "Test Body",
      cover_image: undefined,
      tags: [],
      canonical_url: undefined,
      series: undefined
    });
  });

  it("parsing data", () => {
    const result = parseFrontMatter(`
---
title: Test
published: true
description: Test Post
series: Test
tags:
  - test1
  - null
  - test2
  - test3
  - 0
  - 
canonical_url: https://www.test.org
cover_image: https://www.test.com
---

# Heading1
Testing!

`);
    expect(result).toMatchObject({
      title: "Test",
      description: "Test Post",
      published: true,
      body_markdown: "# Heading1\nTesting!",
      cover_image: "https://www.test.com",
      tags: ["test1", "test2", "test3"],
      canonical_url: "https://www.test.org",
      series: "Test"
    });
  });
});
