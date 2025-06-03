import api from "./api"

export interface Author {
    id: number
    idBook: number
    firstName: string
    lastName: string
    fullName: string
}

export const authorService = {
    getAll: async (): Promise<Author[]> => {
        const response = await api.get("/Authors")
        return response.data
    },

    getById: async (id: number): Promise<Author> => {
        const response = await api.get(`/Authors/${id}`)
        return response.data
    },

    create: async (author: Omit<Author, "id">): Promise<Author> => {
        const response = await api.post("/Authors", author)
        return response.data
    },

    update: async (id: number, author: Omit<Author, "id">): Promise<Author> => {
        const response = await api.put(`/Authors/${id}`, author)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/Authors/${id}`)
    },
}