
import type React from "react"
import { useState } from "react"
import { Typography, Button, Row, Col, Input, Empty, Pagination, notification } from "antd"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { useBooks } from "../hooks/useBooks"
import BookCard from "../components/Books/BookCard"
import BookForm from "../components/Books/BookForm"
import LoadingSpinner from "../components/Shared/LoadingSpinner"
import ErrorMessage from "../components/Shared/ErrorMessage"
import type { Book } from "../services/bookService"

const { Title } = Typography
const { Search } = Input

const BooksList: React.FC = () => {
    const { books, loading, error, createBook, updateBook, deleteBook, fetchBooks } = useBooks()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingBook, setEditingBook] = useState<Book | null>(null)
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

    const handleCreateBook = async (bookData: Omit<Book, "id">) => {
        try {
            await createBook(bookData)
            setIsFormOpen(false)
            showNotification(
                'success',
                '¡Libro creado!',
                `El libro "${bookData.title}" ha sido agregado exitosamente.`
            )
        } catch (error) {
            console.error("Error creating book:", error)
            showNotification(
                'error',
                'Error al crear libro',
                'No se pudo crear el libro. Por favor, inténtalo de nuevo.'
            )
        }
    }

    const handleUpdateBook = async (bookData: Omit<Book, "id">) => {
        if (editingBook) {
            try {
                await updateBook(editingBook.id, bookData)
                setEditingBook(null)
                setIsFormOpen(false)
                showNotification(
                    'success',
                    '¡Libro actualizado!',
                    `Los cambios en "${bookData.title}" han sido guardados.`
                )
            } catch (error) {
                console.error("Error updating book:", error)
                showNotification(
                    'error',
                    'Error al actualizar libro',
                    'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.'
                )
            }
        }
    }

    const handleEditClick = (book: Book) => {
        setEditingBook(book)
        setIsFormOpen(true)
    }

    const handleDeleteClick = async (id: number) => {
        try {
            // Find the book being deleted for the notification
            const bookToDelete = books.find(book => book.id === id)
            const bookTitle = bookToDelete?.title || 'libro'

            await deleteBook(id)

            showNotification(
                'success',
                'Libro eliminado',
                `"${bookTitle}" ha sido eliminado exitosamente.`
            )


            const remainingBooks = filteredBooks.length - 1
            const maxPage = Math.ceil(remainingBooks / pageSize)
            if (currentPage > maxPage && maxPage > 0) {
                setCurrentPage(maxPage)
            }
        } catch (error) {
            console.error("Error deleting book:", error)
            showNotification(
                'error',
                'Error al eliminar libro',
                'No se pudo eliminar el libro. Por favor, inténtalo de nuevo.'
            )
        }
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingBook(null)
    }

    const handleSearch = (value: string) => {
        setSearchText(value)
        setCurrentPage(1) // Reset to first page when searching

        if (value && filteredBooks.length === 0) {
            showNotification(
                'info',
                'Sin resultados',
                `No se encontraron libros que coincidan con "${value}".`
            )
        }
    }

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.description.toLowerCase().includes(searchText.toLowerCase()),
    )

    const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    if (loading) return <LoadingSpinner message="Cargando libros..." />
    if (error) {
        showNotification(
            'error',
            'Error al cargar libros',
            'Hubo un problema al cargar la lista de libros.'
        )
        return <ErrorMessage message={error} onRetry={fetchBooks} />
    }

    return (
        <>
            {contextHolder}
            <div className="books-list-container">
                <div className="page-header">
                    <Title level={2}>Colección de Libros</Title>
                    <div className="page-actions">
                        <Search
                            placeholder="Buscar libros por título o descripción"
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setSearchText('')
                                    setCurrentPage(1)
                                }
                            }}
                            className="search-input"
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsFormOpen(true)}
                            size="large"
                        >
                            Nuevo Libro
                        </Button>
                    </div>
                </div>

                {filteredBooks.length === 0 ? (
                    <Empty
                        description={
                            searchText
                                ? `No se encontraron libros que coincidan con "${searchText}"`
                                : "No hay libros disponibles"
                        }
                        className="empty-state"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        {!searchText && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsFormOpen(true)}
                            >
                                Agregar primer libro
                            </Button>
                        )}
                    </Empty>
                ) : (
                    <>
                        <div className="results-info">
                            <Typography.Text type="secondary">
                                {searchText
                                    ? `${filteredBooks.length} libro${filteredBooks.length !== 1 ? 's' : ''} encontrado${filteredBooks.length !== 1 ? 's' : ''} para "${searchText}"`
                                    : `${filteredBooks.length} libro${filteredBooks.length !== 1 ? 's' : ''} en total`
                                }
                            </Typography.Text>
                        </div>

                        <Row gutter={[24, 24]} className="books-grid">
                            {paginatedBooks.map((book) => (
                                <Col xs={24} sm={12} lg={8} key={book.id}>
                                    <BookCard
                                        book={book}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                        // Add author info if available in your book model
                                        // author={book.author}
                                    />
                                </Col>
                            ))}
                        </Row>

                        {filteredBooks.length > pageSize && (
                            <div className="pagination-container">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredBooks.length}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} de ${total} libros`
                                    }
                                />
                            </div>
                        )}
                    </>
                )}

                <BookForm
                    open={isFormOpen}
                    onClose={handleCloseForm}
                    onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
                    book={editingBook}
                    title={editingBook ? "Editar Libro" : "Nuevo Libro"}
                />
            </div>


        </>
    )
}

export default BooksList