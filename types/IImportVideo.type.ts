export interface IImportVideo  {
    video: {
        id: string;
        title: string;
        status: string;
        products: string[];
        url: string;
        source: string;
        views: string;
        size: number;
        duration: number;
        width: string;
        height: string;
        format?: string;
    };
};