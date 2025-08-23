const BASE_URL = "https://reelo-backend.vercel.app/api/v1";
// get all feeds
export const getAllFeeds = async (storeId: string) => {
    try {
        const feeds = await fetch(`${BASE_URL}/feeds?storeId=${storeId}`, {
            method: "GET",
        });
        const data = await feeds.json();
        return data;
    } catch (error) {
        return error;
    }
}


// delete feeds
export const deleteFeeds = async (feedIds: string[]) => {
    try {
        const response = await fetch(`${BASE_URL}/feeds/bulk-delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ feedIds }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

export const createFeeds = async (body:any) => {
    try {
        const result = await fetch("https://reelo-backend.vercel.app/api/v1/feeds",{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body),
        })
        const data = await result.json();
        return data;
    } catch (e) {
        return e;
    }
}




