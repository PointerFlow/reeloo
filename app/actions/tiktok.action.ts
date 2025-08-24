
// // Get TikTok videos by username
// export const getVideosByUserName = async (username: string) => {
//     try {
//         const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/search/video?keyword=cat&cursor=0&search_id=0`, {
//             method: "GET",
//             headers: {
//                 'x-rapidapi-key': 'b27f561542msh68d23b56574d66bp11ff1bjsnfbf042c15830',
//                 'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
//             }
//         });
//         const data = await response.json();
//         return data;

//     } catch (e) {
//         return null;
//     }
// };
