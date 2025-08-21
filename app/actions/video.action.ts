const BASE_URL = "https://reelo-backend.vercel.app/api/v1";

// get all videos
export const getAllVideos = async (storeId: string) => {
    try {
        const videos = await fetch(`${BASE_URL}/videos?storeId=${storeId}`, {
            method: "GET",
        });
        const data = await videos.json();
        return data;

    } catch (error) {
        return error;
    }
}

// delete video
export const deleteVideo = async (id: string) => {
    try {
        const video = await fetch(`${BASE_URL}/videos/${id}`, {
            method: "DELETE",
        });
        const data = await video.json();
        return data;
    } catch (error) {
        return error;
    }
}

// update video
export const updateVideo = async (id: string, title: string, status: string, products: string[]) => {
    try {
        const video = await fetch(`${BASE_URL}/videos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                status,
                products,
            }),
        });
        const data = await video.json();
        return data;
    } catch (e) {
        return e;
    }
}

// get videos by id
export const getVideoByid = async (id: string) => {
    try {
        const result = await fetch(`${BASE_URL}/videos/${id}`, {
            method: "GET",
        });
        const data = await result.json();
        return { video: data.data.video }
    } catch (e) {
        return e;
    }

}
