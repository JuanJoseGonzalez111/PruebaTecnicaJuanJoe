"use client"

import { useState, useEffect } from "react"
import { message } from "antd"
import { bookService, type Book } from "../services/bookService"

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBooks = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await bookService.getAll()
            setBooks(data)
        } catch (err) {
            setError("Error fetching books")
            message.error("No se pudieron cargar los libros")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const createBook = async (book: Omit<Book, "id">) => {
        try {
            const newBook = await bookService.create(book)
            setBooks((prev) => [...prev, newBook])
            message.success("Libro creado exitosamente")
            return newBook
        } catch (err) {
            setError("Error creating book")
            message.error("Error al crear el libro")
            throw err
        }
    }

    const updateBook = async (id: number, book: Omit<Book, "id">) => {
        try {
            const updatedBook = await bookService.update(id, book)
            setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)))
            message.success("Libro actualizado exitosamente")
            return updatedBook
        } catch (err) {
            setError("Error updating book")
            message.error("Error al actualizar el libro")
            throw err
        }
    }

    const deleteBook = async (id: number) => {
        try {
            await bookService.delete(id)
            setBooks((prev) => prev.filter((b) => b.id !== id))
            message.success("Libro eliminado exitosamente")
        } catch (err) {
            setError("Error deleting book")
            message.error("Error al eliminar el libro")
            throw err
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    return {
        books,
        loading,
        error,
        fetchBooks,
        createBook,
        updateBook,
        deleteBook,
    }
}
