"use client"

import type React from "react"
import { useState } from "react"
import {Typography, Button, Row, Col, Modal, Input, Empty, Pagination, notification} from "antd"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { useAuthors } from "../hooks/useAuthors"
import { useBooks } from "../hooks/useBooks"
import AuthorCard from "../components/Authors/AuthorCard"
import AuthorForm from "../components/Authors/AuthorForm"
import LoadingSpinner from "../components/Shared/LoadingSpinner"
import ErrorMessage from "../components/Shared/ErrorMessage"
import type { Author } from "../services/authorService"


const { Title } = Typography
const { Search } = Input

const AuthorsList: React.FC = () => {
    const {
        authors,
        loading: authorsLoading,
        error: authorsError,
        createAuthor,
        updateAuthor,
        deleteAuthor,
        fetchAuthors,
    } = useAuthors()
    const { books, loading: booksLoading } = useBooks()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 6
    const [api, contextHolder] = notification.useNotification()

    const showNotification = (
        type: 'success' | 'error' | 'info' | 'warning',
        message: string,
        description?: string
    ) => {
        api[type]({
            message,
            description,
            placement: 'topRight',
            duration: 4.5,
        })
    }

    const handleCreateAuthor = async (authorData: Omit<Author, "id">) => {
        await createAuthor(authorData)
        showNotification(
            'success',
            '¡Autor creado!',
            `El Autor "${authorData.firstName}" ha sido agregado exitosamente.`
        )
        setIsFormOpen(false)
    }

    const handleUpdateAuthor = async (authorData: Omit<Author, "id">) => {
        if (editingAuthor) {
            await updateAuthor(editingAuthor.id, authorData)
            setEditingAuthor(null)
            showNotification(
                'success',
                '¡Autor editado!',
                `El Autor "${authorData.firstName}" ha sido editado exitosamente.`
            )
            setIsFormOpen(false)
        }
    }

    const handleEditClick = (author: Author) => {
        setEditingAuthor(author)
        setIsFormOpen(true)
    }

    const handleDeleteClick = async (id: number) => {
        try {
            await deleteAuthor(id)
            const remainingAuthors = filteredAuthors.length - 1
            const maxPage = Math.ceil(remainingAuthors / pageSize)
            if (currentPage > maxPage && maxPage > 0) {
                setCurrentPage(maxPage)
            }
            showNotification(
                'success',
                '¡Autor eliminado exitosamente.!',
                `El Autor "${id}" ha sido eliminado exitosamente.`
            )
        } catch (error) {
            console.error("Error deleting author:", error)
            Modal.error({
                title: "Error",
                content: "No se pudo eliminar el autor. Por favor, inténtalo de nuevo.",
            })
        }
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingAuthor(null)
    }


    const getBookCountForAuthor = (authorId: number) => {

        return books.filter((book) => book.id === authorId).length
    }

    const filteredAuthors = authors.filter(
        (author) =>
            author.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            author.lastName.toLowerCase().includes(searchText.toLowerCase()),
    )

    const paginatedAuthors = filteredAuthors.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    if (authorsLoading || booksLoading) return <LoadingSpinner message="Cargando autores..." />
    if (authorsError) return <ErrorMessage message={authorsError} onRetry={fetchAuthors} />

    return (
         <>  {contextHolder}
        <div className="authors-list-container">
            <div className="page-header">
                <Title level={2}>Colección de Autores</Title>
                <div className="page-actions">
                    <Search
                        placeholder="Buscar autores"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={(value) => setSearchText(value)}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormOpen(true)}>
                        Nuevo Autor
                    </Button>
                </div>
            </div>

            {filteredAuthors.length === 0 ? (
                <Empty
                    description={searchText ? "No se encontraron autores con tu búsqueda" : "No hay autores disponibles"}
                    className="empty-state"
                />
            ) : (
                <>
                    <Row gutter={[24, 24]} className="authors-grid">
                        {paginatedAuthors.map((author) => (
                            <Col xs={24} sm={12} lg={8} key={author.id}>
                                <AuthorCard
                                    author={author}
                                    bookCount={getBookCountForAuthor(author.id)} // Fixed: use author.id instead of author.idBook
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            </Col>
                        ))}
                    </Row>

                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredAuthors.length}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            )}

            <AuthorForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingAuthor ? handleUpdateAuthor : handleCreateAuthor}
                author={editingAuthor}
                title={editingAuthor ? "Editar Autor" : "Nuevo Autor"}
            />
        </div>

         </>
    )
}

export default AuthorsList