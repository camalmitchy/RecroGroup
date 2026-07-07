export type Resource = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readingTime: string;
    publishedAt: string;
    content?: string;
};

export const resources: Resource[] = [
    {
        slug: "understanding-complex-grief",
        title: "Understanding Complex Grief",
        excerpt: "Grief isn't linear. Learn about the different stages and how to navigate the complexity of loss.",
        category: "Grief",
        readingTime: "8 min read",
        publishedAt: "2026-06-15",
    },
    {
        slug: "talking-to-children-about-death",
        title: "Talking to Children About Death",
        excerpt: "Age-appropriate ways to discuss loss with your children and support them through grief.",
        category: "Parenting",
        readingTime: "6 min read",
        publishedAt: "2026-06-10",
    },
    {
        slug: "maintaining-relationships-during-grief",
        title: "Maintaining Relationships During Grief",
        excerpt: "How grief affects relationships and strategies to maintain connection during difficult times.",
        category: "Relationships",
        readingTime: "7 min read",
        publishedAt: "2026-06-05",
    },
    {
        slug: "self-care-for-caregivers",
        title: "Self-Care for Caregivers",
        excerpt: "Essential practices for those who support others through illness, loss, or recovery.",
        category: "Mental Health",
        readingTime: "5 min read",
        publishedAt: "2026-05-28",
    },
    {
        slug: "when-to-seek-therapy",
        title: "When to Seek Therapy",
        excerpt: "Signs that professional support might help, and what to expect from your first session.",
        category: "Mental Health",
        readingTime: "9 min read",
        publishedAt: "2026-05-20",
    },
    {
        slug: "navigating-holidays-after-loss",
        title: "Navigating Holidays After Loss",
        excerpt: "Practical guidance for managing special occasions and family gatherings while grieving.",
        category: "Grief",
        readingTime: "10 min read",
        publishedAt: "2026-05-15",
    },
    {
        slug: "building-emotional-resilience",
        title: "Building Emotional Resilience in Children",
        excerpt: "How to help your children develop coping skills and emotional strength.",
        category: "Parenting",
        readingTime: "8 min read",
        publishedAt: "2026-05-10",
    },
    {
        slug: "communication-in-conflict",
        title: "Communication Strategies During Conflict",
        excerpt: "Tools for healthy conflict resolution and deeper understanding in relationships.",
        category: "Relationships",
        readingTime: "7 min read",
        publishedAt: "2026-05-05",
    },
];
