import { afterEach, describe, expect, it, vi } from "vitest";

import { formAlertRecipients } from "@/lib/mail/index";
import { inquiryFormName } from "@/lib/mail/notifications";
import { staffGriefApplicationAlert, staffInquiryAlert } from "@/lib/mail/templates";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("form alert recipients", () => {
  it("always includes info@recrogroup.org", () => {
    vi.stubEnv("MAIL_STAFF_ADDRESS", "other@example.com");

    expect(formAlertRecipients()).toEqual([
      "other@example.com",
      "info@recrogroup.org",
    ]);
  });

  it("does not send the admin mailbox twice", () => {
    vi.stubEnv("MAIL_STAFF_ADDRESS", "Info@recrogroup.org");

    expect(formAlertRecipients()).toEqual(["info@recrogroup.org"]);
  });
});

describe("inquiry form names", () => {
  it("names each public program form", () => {
    expect(inquiryFormName("Grief camp therapist application — Ada")).toBe(
      "Therapist application",
    );
    expect(inquiryFormName("Team builder application — Ada")).toBe(
      "Team building application",
    );
    expect(inquiryFormName("Consortium application")).toBe("Consortium application");
    expect(inquiryFormName("Corporate training — Recro")).toBe(
      "Corporate speaking inquiry",
    );
  });
});

describe("staff form emails", () => {
  it("addresses the grief camp alert to the admin mailbox", () => {
    const message = staffGriefApplicationAlert({
      recipientEmail: "info@recrogroup.org",
      reference: "GC-TEST",
      parentName: "Ada Lovelace",
      parentEmail: "ada@example.com",
      parentPhone: "254700000000",
      childName: "Grace",
      campName: "Recro Grief Camp",
      amountKes: 15000,
      reviewUrl: "https://recrogroup.org/admin/grief-camp",
    });

    expect(message.to).toBe("info@recrogroup.org");
    expect(message.subject).toBe("New grief camp application GC-TEST");
    expect(message.html).toContain("Grace");
    expect(message.html).toContain("https://recrogroup.org/admin/grief-camp");
  });

  it("addresses a program form alert to the admin mailbox", () => {
    const message = staffInquiryAlert({
      recipientEmail: "info@recrogroup.org",
      formName: "Team building application",
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Team builder application — Ada Lovelace",
      type: "CORPORATE",
      message: "Experience working with children: two years",
      reviewUrl: "https://recrogroup.org/admin/grief-camp/team-building",
    });

    expect(message.to).toBe("info@recrogroup.org");
    expect(message.subject).toContain("Team builder application");
    expect(message.html).toContain("Team building application");
  });
});
