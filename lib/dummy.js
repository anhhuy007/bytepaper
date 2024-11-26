export const newsData = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    thumbnail: "https://via.placeholder.com/150",
    title: `Sample News Title ${index + 1}`,
    tags: ["Tag1", "Tag2"],
    date: "2023-10-01",
    content: "This is a detailed description of the news article.",
    author: "John Doe",
}));

// Example new data
/*
{
        id: 2,
        thumbnail: "https://via.placeholder.com/150",
        title: "Sample News Title 2",
        tags: ["Tag3", "Tag4"],
        date: "2023-10-02",
        content: "This is a detailed description of the second news article.",
    },
*/
