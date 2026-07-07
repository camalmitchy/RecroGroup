export type MediaVideo = {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    duration: string;
    embedUrl: string;
};

export const mediaCategories = [
    "All",
    "Grief",
    "Parenting",
    "Relationships",
    "Mental Health",
] as const;

export const mediaVideos: MediaVideo[] = [
    {
        id: "featured-1",
        title: "Understanding Grief: A Therapist's Perspective",
        excerpt: "Our clinical director shares insights on navigating loss and healing.",
        category: "Grief",
        duration: "12:34",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "video-2",
        title: "Parenting Through Loss",
        excerpt: "How to support your children when facing family grief.",
        category: "Parenting",
        duration: "8:45",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "video-3",
        title: "Building Resilient Relationships",
        excerpt: "Communication strategies for stronger connections.",
        category: "Relationships",
        duration: "15:20",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "video-4",
        title: "Mental Health in Times of Crisis",
        excerpt: "Practical tools for managing anxiety and stress.",
        category: "Mental Health",
        duration: "10:12",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "video-5",
        title: "The Journey of Healing",
        excerpt: "Stories of recovery and hope from our therapy community.",
        category: "Grief",
        duration: "18:30",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "video-6",
        title: "Co-Parenting After Loss",
        excerpt: "Maintaining stability for children during difficult transitions.",
        category: "Parenting",
        duration: "11:15",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
];
