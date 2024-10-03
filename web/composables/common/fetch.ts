const config = useRuntimeConfig();

export const usePostApi = async (path: string, body?: object) => {
    return useFetch(`${config.serverEndpoint}/${path}`, {
        method: "POST",
        body,
    });
};

export const useGetApi = async (path: string, params?: object) => {
    return useFetch(`${config.serverEndpoint}/${path}`, {
        method: "GET",
        params,
    });
};
