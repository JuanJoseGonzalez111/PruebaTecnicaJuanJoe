import api from "./api"

export interface Book {
    id: number
    title: string
    description: string
    pageCount: number
    excerpt: string
    publishDate: string
}

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const response = await api.get("/books")
        return response.data
    },

    getById: async (id: number): Promise<Book> => {
        const response = await api.get(`/books/${id}`)
        return response.data
    },

    create: async (book: Omit<Book, "id">): Promise<Book> => {
        const response = await api.post("/books", book)
        return response.data
    },

    update: async (id: number, book: Omit<Book, "id">): Promise<Book> => {
        const response = await api.put(`/books/${id}`, book)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/books/${id}`)
    },
}
