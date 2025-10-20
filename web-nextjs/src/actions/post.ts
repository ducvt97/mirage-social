import { GetPostsByUserRequest } from "@/interfaces"
import { apiServerFetch } from "@/services/base"

const getPostsByUser = async (params: GetPostsByUserRequest) => {
  return apiServerFetch(`post/getByUser`, "get", undefined, params)
}

export { getPostsByUser }