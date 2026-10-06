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

export type ParsedInquiryField = {
    label: string;
    value: string;
};

export type ParsedInquirySection = {
    heading: string;
    fields: ParsedInquiryField[];
};

const SECTION_HEADING = /^[A-Z0-9][A-Z0-9 &'’/().-]*$/;

function titleCaseHeading(heading: string) {
    return heading
        .toLowerCase()
        .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());
}

/** Turns a stored form message back into headings and labelled answers. */
export function parseInquiryMessage(message: string): ParsedInquirySection[] {
    const sections: ParsedInquirySection[] = [];
    let current: ParsedInquirySection | null = null;
    let field: ParsedInquiryField | null = null;

    const pushField = () => {
        if (!current || !field) return;
        const value = field.value.trim();
        if (value) current.fields.push({ label: field.label, value });
        field = null;
    };

    const startSection = (heading: string) => {
        pushField();
        current = { heading: titleCaseHeading(heading), fields: [] };
        sections.push(current);
    };

    for (const raw of message.replace(/\r\n/g, "\n").split("\n")) {
        const line = raw.trim();
        if (!line) continue;

        if (!line.includes(":") && SECTION_HEADING.test(line)) {
            startSection(line);
            continue;
        }

        const labelled = line.match(/^([^:]+):\s*(.*)$/);
        if (labelled) {
            if (!current) startSection("Details");
            pushField();
            field = { label: labelled[1].trim(), value: labelled[2] };
            continue;
        }

        if (field) {
            field.value = field.value ? `${field.value}\n${line}` : line;
            continue;
        }

        if (!current) startSection("Message");
        current.fields.push({ label: "Note", value: line });
    }

    pushField();
    return sections.filter((section) => section.fields.length > 0);
}

export function truncateSubject(subject: string): string {
    return subject.length <= SUBJECT_LIMIT
        ? subject
        : subject.slice(0, SUBJECT_LIMIT - 1).trimEnd() + "…";
}
