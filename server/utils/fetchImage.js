export const fetchImage = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&searchType=image&key=${process.env.GOOGLE_API_KEY}&num=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        } else {
            console.log("No image found for:", query);
            return "https://via.placeholder.com/300";
        }
    } catch (error) {
        console.error("Error fetching image for:", query, error);
        return "https://via.placeholder.com/300";
    }
};