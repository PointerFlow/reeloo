import { executeGraphQL } from "../graphql/graphql";

export const pullFileUntilReady = async (
    admin,
    getFileByIdQuery,
    fileId,
    interval = 1000,
    maxAttempts = 10,
) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const fileByIdResponse = await executeGraphQL(
            admin,
            getFileByIdQuery,
            fileId,
        );

        if (fileByIdResponse.node.originalSource !== null) {
            return {
                ...fileByIdResponse,
                attempts,
                timeTaken: `${(attempts * interval) / 1000}s`,
            };
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("File not ready after maximum attempts");
};
