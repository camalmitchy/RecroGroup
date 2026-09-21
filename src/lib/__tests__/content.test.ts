import { describe, expect, it } from "vitest";

import { extractYoutubeId, slugify } from "@/lib/content";

describe("extractYoutubeId", () => {
  it("accepts a raw video id", () => {
    expect(extractYoutubeId("yrtRlE6HlUU")).toBe("yrtRlE6HlUU");
  });

  it("parses watch, embed, and short URLs", () => {
    expect(
      extractYoutubeId("https://www.youtube.com/watch?v=yrtRlE6HlUU"),
    ).toBe("yrtRlE6HlUU");
    expect(extractYoutubeId("https://youtu.be/yrtRlE6HlUU")).toBe("yrtRlE6HlUU");
    expect(
      extractYoutubeId("https://www.youtube.com/embed/yrtRlE6HlUU"),
    ).toBe("yrtRlE6HlUU");
  });

  it("rejects invalid input", () => {
    expect(extractYoutubeId("https://example.com")).toBeNull();
    expect(extractYoutubeId("")).toBeNull();
  });
});

describe("slugify", () => {
  it("builds a url-safe slug", () => {
    expect(slugify("The Perfect Storm")).toBe("the-perfect-storm");
  });
});
