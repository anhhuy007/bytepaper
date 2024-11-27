export const newsData = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    thumbnail: "https://placehold.co/600x400",
    title: `Sample News Title ${index + 1}`,
    tags: ["Tag1", "Tag2"],
    date: "2023-10-01",
    content:
        "<p>This is the content of the <strong> news </strong> article.</p>",
    author: "John Doe",
    abstract: "This is a short description of the news article.",
    status: "published",
    is_premium: true,
    category: "Health",
}));
