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



