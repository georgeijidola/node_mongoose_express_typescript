interface pagination {
  nextPage?: {
    page: number
    docsLeft: number
  }
  previousPage?: {
    page: number
  }
  limit: number
  currentPage: number
  totalDocs: number
  totalPages: number
}

export default pagination
