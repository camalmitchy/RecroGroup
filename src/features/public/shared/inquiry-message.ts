const MESSAGE_LIMIT = 5000;
const SUBJECT_LIMIT = 200;

export type MessageField = [label: string, value: string | boolean | null | undefined];

export type MessageSection = {
    heading: string;
    fields: MessageField[];
};

function renderValue(value: MessageField[1]): string {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return typeof value === "string" ? value.trim() : "";
}

export function formatInquiryMessage(sections: MessageSection[]): string {
    const blocks: string[] = [];

    for (const section of sections) {
        const lines = section.fields
            .map(([label, value]) => [label, renderValue(value)] as const)
            .filter(([, value]) => value.length > 0)
            .map(([label, value]) =>
                value.includes("\n") ? `${label}:\n${value}` : `${label}: ${value}`,
            );

        if (lines.length > 0) {
            blocks.push([section.heading.toUpperCase(), ...lines].join("\n"));
        }
    }

    const message = blocks.join("\n\n");
    if (message.length <= MESSAGE_LIMIT) return message;

    const notice = "\n\n[Truncated — contact the applicant for the full submission]";
    return message.slice(0, MESSAGE_LIMIT - notice.length).trimEnd() + notice;
}

export function truncateSubject(subject: string): string {
    return subject.length <= SUBJECT_LIMIT
        ? subject
        : subject.slice(0, SUBJECT_LIMIT - 1).trimEnd() + "…";
}
