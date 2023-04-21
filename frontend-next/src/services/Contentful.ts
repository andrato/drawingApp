import { createClient } from "contentful";

export const useContentful = () => {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_REACT_APP_SPACE_ID ?? "",
        accessToken: process.env.NEXT_PUBLIC_REACT_APP_ACCESS_TOKEN ?? "",
    })

    const getContentfulMedia = async (id: string = "6JMkIhcUwv4Op1caX3WrfB") => {
        let response;
        try {
            response = await client.getEntry(id);

            return response;
        } catch (error) {
            console.error("Error fetching id:" + error);
        }
    }

    const getAllContentfulMedia = async () => {
        let response;
        try {
            response = await client.getEntries();

            return response;
        } catch (error) {
            console.error("Error fetching id:" + error);
        }
    }

    return {
        getContentfulMedia,
        getAllContentfulMedia,
    }
}
