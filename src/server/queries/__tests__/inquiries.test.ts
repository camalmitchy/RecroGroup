import { describe, expect, it } from "vitest";

import {
  buildInquiryWhere,
  buildNewInquiryCountWhere,
} from "@/server/queries/inquiries";

describe("buildInquiryWhere", () => {
  it("keeps team building and therapist applications out of corporate speaking", () => {
    const where = buildInquiryWhere({ program: "corporate" });

    expect(where).toEqual({
      AND: [
        {
          AND: [
            {
              OR: [
                { type: "CORPORATE" },
                { subject: { contains: "corporate", mode: "insensitive" } },
              ],
            },
            {
              NOT: {
                OR: [
                  { subject: { contains: "team builder", mode: "insensitive" } },
                  { subject: { contains: "team-building", mode: "insensitive" } },
                ],
              },
            },
            {
              NOT: {
                OR: [
                  {
                    subject: {
                      contains: "therapist application",
                      mode: "insensitive",
                    },
                  },
                  {
                    subject: {
                      contains: "facilitator application",
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  it("selects team building and therapist applications by subject", () => {
    expect(buildInquiryWhere({ program: "team-building" })).toEqual({
      AND: [
        {
          OR: [
            { subject: { contains: "team builder", mode: "insensitive" } },
            { subject: { contains: "team-building", mode: "insensitive" } },
          ],
        },
      ],
    });

    expect(buildInquiryWhere({ program: "therapist" })).toEqual({
      AND: [
        {
          OR: [
            { subject: { contains: "therapist application", mode: "insensitive" } },
            { subject: { contains: "facilitator application", mode: "insensitive" } },
          ],
        },
      ],
    });
  });

  it("counts new inquiries inside the same program and search filters", () => {
    const filters = {
      program: "therapist" as const,
      search: "Ada",
      type: "CORPORATE" as const,
    };

    expect(buildNewInquiryCountWhere(filters)).toEqual({
      AND: [buildInquiryWhere(filters), { status: "NEW" }],
    });
    expect(buildNewInquiryCountWhere(filters)).not.toEqual({ status: "NEW" });
  });
});
