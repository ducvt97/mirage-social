export class GetWithPagingDTO {
    page?: number;
    pageSize?: number;
}

export class SearchDTO extends GetWithPagingDTO {
    search?: string;
}