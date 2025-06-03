"use client"

import { useState, useEffect } from "react"
import { message } from "antd"
import { authorService, type Author } from "../services/authorService"

export const useAuthors = () => {
    const [authors, setAuthors] = useState<Author[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAuthors = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await authorService.getAll()
            setAuthors(data)
        } catch (err) {
            setError("Error fetching authors")
            message.error("No se pudieron cargar los autores")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const createAuthor = async (author: Omit<Author, "id">) => {
        try {
            const newAuthor = await authorService.create(author)
            setAuthors((prev) => [...prev, newAuthor])
            message.success("Autor creado exitosamente")
            return newAuthor
        } catch (err) {
            setError("Error creating author")
            message.error("Error al crear el autor")
            throw err
        }
    }

    const updateAuthor = async (id: number, author: Omit<Author, "id">) => {
        try {
            const updatedAuthor = await authorService.update(id, author)
            setAuthors((prev) => prev.map((a) => (a.id === id ? updatedAuthor : a)))
            message.success("Autor actualizado exitosamente")
            return updatedAuthor
        } catch (err) {
            setError("Error updating author")
            message.error("Error al actualizar el autor")
            throw err
        }
    }

    const deleteAuthor = async (id: number) => {
        try {
            await authorService.delete(id)
            setAuthors((prev) => prev.filter((a) => a.id !== id))
            message.success("Autor eliminado exitosamente")
        } catch (err) {
            setError("Error deleting author")
            message.error("Error al eliminar el autor")
            throw err
        }
    }

    useEffect(() => {
        fetchAuthors()
    }, [])

    return {
        authors,
        loading,
        error,
        fetchAuthors,
        createAuthor,
        updateAuthor,
        deleteAuthor,
    }
}
