import { describe, expect, it } from "vitest";

import {
  extensionFromName,
  resolveFlyerExtension,
  sniffFlyer,
} from "../flyer-types";

function file(name: string, type: string, bytes: number[]) {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("grief camp flyer types", () => {
  it("treats jpeg and jpg filenames as the same type", () => {
    expect(extensionFromName("camp.JPG")).toBe("jpg");
    expect(extensionFromName("camp.jpeg")).toBe("jpg");
    expect(extensionFromName("camp.jfif")).toBe("jpg");
  });

  it("accepts a JPEG even when the browser leaves the MIME type blank", () => {
    const bytes = [0xff, 0xd8, 0xff, 0xe0, 0x00];
    const result = resolveFlyerExtension(
      file("flyer.jpg", "", bytes),
      new Uint8Array(bytes),
    );
    expect(result).toBe("jpg");
  });

  it("sniffs jpeg, png, gif and pdf magic bytes", () => {
    expect(sniffFlyer(new Uint8Array([0xff, 0xd8, 0xff]))).toBe("jpg");
    expect(sniffFlyer(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe("png");
    expect(sniffFlyer(new Uint8Array([0x47, 0x49, 0x46, 0x38]))).toBe("gif");
    expect(sniffFlyer(new Uint8Array([0x25, 0x50, 0x44, 0x46]))).toBe("pdf");
  });
});
