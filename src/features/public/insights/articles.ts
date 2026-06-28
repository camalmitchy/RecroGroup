export type ArticleSection =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; content: string; attribution?: string };

export type ArticleFull = {
  slug: string;
  author: string;
  publishedAt: string;
  sections: ArticleSection[];
};

export const articleBodies: Record<string, ArticleFull> = {
  "from-the-foxhole-to-the-front-porch": {
    slug: "from-the-foxhole-to-the-front-porch",
    author: "Dr. Michelle Karume",
    publishedAt: "March 12, 2025",
    sections: [
      {
        type: "paragraph",
        content:
          "When Kenya welcomed home its troops, families across the country felt a wave of relief — and something quieter underneath it: the long, uneven work of coming back together. Reintegration is rarely a single homecoming moment. It is a season of relearning roles, rhythms, and expectations.",
      },
      {
        type: "heading",
        content: "The family as a living system",
      },
      {
        type: "paragraph",
        content:
          "In family systems therapy, we understand that when one member changes — through deployment, trauma, or prolonged absence — the entire family reorganises around that change. Children may have taken on responsibilities they are not ready to release. Partners may have learned to operate independently. Everyone may be grieving the version of home they imagined would return.",
      },
      {
        type: "list",
        items: [
          "Children acting out or withdrawing after a parent's return",
          "Partners feeling like strangers despite years of marriage",
          "Extended family offering advice that deepens tension rather than relief",
          "Difficulty talking about what happened during separation",
        ],
      },
      {
        type: "heading",
        content: "What reintegration actually asks of families",
      },
      {
        type: "paragraph",
        content:
          "Healthy reintegration is not about pretending nothing changed. It is about naming what changed — gently, honestly, and without rushing anyone to 'move on.' Therapy creates a structured space where each voice can be heard: the returning parent, the partner who held the home front, and the children who grew up in their absence.",
      },
      {
        type: "quote",
        content:
          "Healing a family after separation is less about returning to who you were, and more about discovering who you are becoming together.",
        attribution: "Dr. Michelle Karume",
      },
      {
        type: "paragraph",
        content:
          "At Recro Group, we walk with military and civilian families through these transitions using systemic family therapy, trauma-informed care, and practical communication tools you can use at the kitchen table — not just in the therapy room.",
      },
    ],
  },
  "the-perfect-storm": {
    slug: "the-perfect-storm",
    author: "Dr. Michelle Karume",
    publishedAt: "February 8, 2025",
    sections: [
      {
        type: "paragraph",
        content:
          "Relationships rarely fall apart in a single dramatic moment. More often, they erode through a accumulation of small disconnections — unspoken resentments, mismatched expectations, and conversations that never quite happen.",
      },
      {
        type: "heading",
        content: "When small storms become a pattern",
      },
      {
        type: "paragraph",
        content:
          "The 'perfect storm' in a relationship is rarely one event. It is the moment when stress from work, parenting, finances, extended family, and personal history all arrive at once — and neither partner has the emotional bandwidth to repair in real time.",
      },
      {
        type: "list",
        items: [
          "Criticism replacing curiosity during conflict",
          "Emotional withdrawal that feels like rejection",
          "Replaying old arguments in new contexts",
          "Feeling alone even when you are in the same room",
        ],
      },
      {
        type: "heading",
        content: "Finding your way back",
      },
      {
        type: "paragraph",
        content:
          "Couples therapy at Recro helps partners map the storm — not to assign blame, but to understand the weather patterns you have been living in. With structured conversations and evidence-based tools from Emotionally Focused Therapy and Gottman-informed practice, couples learn to interrupt cycles before they escalate.",
      },
    ],
  },
  "when-grief-shows-up-at-the-office": {
    slug: "when-grief-shows-up-at-the-office",
    author: "Dr. Michelle Karume",
    publishedAt: "January 19, 2025",
    sections: [
      {
        type: "paragraph",
        content:
          "Grief does not respect office hours. When a colleague returns to work after a significant loss, the workplace becomes part of their healing environment — for better or worse.",
      },
      {
        type: "heading",
        content: "What helps — and what doesn't",
      },
      {
        type: "list",
        items: [
          "Do: Acknowledge the loss simply — 'I'm thinking of you.'",
          "Do: Offer practical support — covering a meeting, flexible hours.",
          "Don't: Compare losses or rush them toward 'being strong.'",
          "Don't: Avoid them because you don't know what to say.",
        ],
      },
      {
        type: "paragraph",
        content:
          "Managers and HR teams often want to do the right thing but lack language for it. Recro's corporate wellness programmes include grief literacy workshops that equip leaders to respond with dignity and clarity — protecting both the grieving employee and team cohesion.",
      },
      {
        type: "quote",
        content:
          "Presence matters more than perfection. A colleague who shows up without fixing is often the most healing presence in the room.",
      },
    ],
  },
  "repair-conversations-for-couples": {
    slug: "repair-conversations-for-couples",
    author: "Dr. Michelle Karume",
    publishedAt: "December 3, 2024",
    sections: [
      {
        type: "paragraph",
        content:
          "Every couple argues. What separates relationships that grow from those that fracture is not the absence of conflict — it is the quality of repair.",
      },
      {
        type: "heading",
        content: "A simple repair structure",
      },
      {
        type: "list",
        items: [
          "Pause — step away before words become weapons.",
          "Own your part — name your feeling without blaming.",
          "Invite — ask if now is a good time to reconnect.",
          "Repair — apologise for the impact, not just the intent.",
          "Reconnect — a small gesture of warmth to close the loop.",
        ],
      },
      {
        type: "paragraph",
        content:
          "In couples sessions at Recro, partners practice this structure with a therapist present — so hard conversations become rehearsed skills rather than recurring wounds. Over time, repair becomes faster, softer, and more honest.",
      },
    ],
  },
  "how-children-grieve-differently": {
    slug: "how-children-grieve-differently",
    author: "Dr. Michelle Karume",
    publishedAt: "November 14, 2024",
    sections: [
      {
        type: "paragraph",
        content:
          "Adults often expect grief to look like sadness. In children, it may look like play, anger, regression, or sudden bursts of laughter. None of these mean the child is 'fine.' They mean the child is grieving in the only language they have.",
      },
      {
        type: "heading",
        content: "Grief by age",
      },
      {
        type: "list",
        items: [
          "Young children (5–8): magical thinking, asking when the person is coming back",
          "Tweens (9–12): anger, school struggles, wanting to appear strong",
          "Teens: risk-taking, withdrawal, intense mood swings",
        ],
      },
      {
        type: "paragraph",
        content:
          "Recro's grief camp and children's therapy programmes create age-appropriate spaces where young mourners can express loss without performing resilience for the adults around them. Parents receive parallel support so the whole family can grieve at different speeds without losing each other.",
      },
    ],
  },
  "five-gentle-ways-to-start-therapy": {
    slug: "five-gentle-ways-to-start-therapy",
    author: "Dr. Michelle Karume",
    publishedAt: "October 22, 2024",
    sections: [
      {
        type: "paragraph",
        content:
          "Starting therapy is one of the most generous things you can do for yourself — and one of the hardest to begin. If you have been thinking about it for months (or years), here are five gentle entry points.",
      },
      {
        type: "list",
        items: [
          "Book a free 15-minute orientation call — no commitment, just conversation.",
          "Write down three things you wish were different — bring the list to session one.",
          "Tell one trusted person you are going — accountability without pressure.",
          "Choose online if in-person feels like too much right now.",
          "Remember: the first session is for gathering information, not performing breakthrough.",
        ],
      },
      {
        type: "quote",
        content:
          "You do not need to arrive ready. You only need to arrive.",
        attribution: "Recro Group clinical team",
      },
      {
        type: "paragraph",
        content:
          "Our intake team matches you with a clinician suited to your goals. You can change therapists at any time — fit matters as much as expertise.",
      },
    ],
  },
  "anxiety-told-simply": {
    slug: "anxiety-told-simply",
    author: "Dr. Michelle Karume",
    publishedAt: "September 5, 2024",
    sections: [
      {
        type: "paragraph",
        content:
          "Anxiety is your nervous system's alarm — sometimes ringing when there is no fire. Understanding what it is doing in your body is the first step toward turning the volume down.",
      },
      {
        type: "heading",
        content: "What anxiety feels like in the body",
      },
      {
        type: "list",
        items: [
          "Racing heart and shallow breathing",
          "Difficulty concentrating or sleeping",
          "Irritability and muscle tension",
          "A persistent sense that something bad is about to happen",
        ],
      },
      {
        type: "paragraph",
        content:
          "Therapy does not eliminate stress — it helps you relate to it differently. Cognitive Behavioural Therapy, mindfulness-based approaches, and somatic techniques used at Recro give you practical tools for the moments when anxiety shows up at work, at home, or in the middle of the night.",
      },
      {
        type: "paragraph",
        content:
          "For organisations, our workplace wellness programmes address collective anxiety — burnout cultures, unrealistic deadlines, and the silence that keeps teams suffering in isolation.",
      },
    ],
  },
};

export const articleSlugs = Object.keys(articleBodies);

export function getArticleBySlug(slug: string): ArticleFull | undefined {
  return articleBodies[slug];
}
