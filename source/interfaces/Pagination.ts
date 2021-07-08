interface pagination {
  nextPage?: {
    page: number
    limit: number
  }
  previousPage?: {
    page: number
    limit: number
  }
  currentPage: number
  totalCounts: number
  totalPages: number
}

export default pagination
