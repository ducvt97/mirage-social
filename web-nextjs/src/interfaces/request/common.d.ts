export interface GetWithPaging {
  page?: number;
  pageSize?: number;
}

export interface SearchRequest extends GetWithPaging {
  searchText: string;
}
