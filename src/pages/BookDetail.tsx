"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Card, Button, Descriptions, Tag, Divider, Avatar, Row, Col, Breadcrumb, Space } from "antd"
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    FileTextOutlined,
    UserOutlined,
    BookOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons"
import { bookService, type Book } from "../services/bookService"
import { authorService, type Author } from "../services/authorService"
import LoadingSpinner from "../components/Shared/LoadingSpinner"
import ErrorMessage from "../components/Shared/ErrorMessage"

const { Title, Paragraph, Text } = Typography

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [book, setBook] = useState<Book | null>(null)
    const [author, setAuthor] = useState<Author | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookAndAuthor = async () => {
            if (!id) return

            try {
                setLoading(true)
                setError(null)

                const bookData = await bookService.getById(Number.parseInt(id))
                setBook(bookData)

                // Try to find the author for this book
                try {
                    const authorsData = await authorService.getAll()
                    const bookAuthor = authorsData.find((a) => a.idBook === bookData.id)
                    setAuthor(bookAuthor || null)
                } catch (authorError) {
                    console.warn("Could not fetch author data:", authorError)
                }
            } catch (err) {
                setError("Error fetching book details")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchBookAndAuthor()
    }, [id])

    if (loading) return <LoadingSpinner message="Cargando detalles del libro..." />
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    if (!book) return <ErrorMessage message="Libro no encontrado" />

    return (
        <div className="book-detail-container">
            {/* Navigation */}
            <div className="book-detail-navigation">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/books")} className="back-button">
                    Volver a Libros
                </Button>
                <Breadcrumb className="book-breadcrumb">
                    <Breadcrumb.Item>Biblioteca</Breadcrumb.Item>
                    <Breadcrumb.Item>Libros</Breadcrumb.Item>
                    <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            {/* Hero Section */}
            <Card className="book-hero-card">
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={6}>
                        <div className="book-cover">
                            <BookOutlined />
                        </div>
                    </Col>
                    <Col xs={24} md={18}>
                        <div className="book-hero-content">
                            <Title level={1} className="book-hero-title">
                                {book.title}
                            </Title>
                            {author && (
                                <Title level={3} className="book-hero-author">
                                    por {author.firstName} {author.lastName}
                                </Title>
                            )}
                            <Space size="middle" wrap className="book-hero-tags">
                                <Tag icon={<FileTextOutlined />} color="blue" className="hero-tag">
                                    {book.pageCount} páginas
                                </Tag>
                                <Tag icon={<CalendarOutlined />} color="green" className="hero-tag">
                                    {new Date(book.publishDate).getFullYear()}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} color="orange" className="hero-tag">
                                    Publicado el {new Date(book.publishDate).toLocaleDateString()}
                                </Tag>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Content Section */}
            <Row gutter={[32, 32]} className="book-content-section">
                <Col xs={24} lg={16}>
                    {/* Description */}
                    <Card className="content-card">
                        <Title level={3} className="section-title">
                            Descripción
                        </Title>
                        <Paragraph className="book-description">{book.description}</Paragraph>
                    </Card>

                    {/* Excerpt */}
                    {book.excerpt && (
                        <Card className="content-card">
                            <Title level={3} className="section-title">
                                Extracto
                            </Title>
                            <div className="book-excerpt">
                                <Paragraph italic className="excerpt-text">
                                    "{book.excerpt}"
                                </Paragraph>
                            </div>
                        </Card>
                    )}

                    {/* Book Information */}
                    <Card className="content-card">
                        <Title level={3} className="section-title">
                            Información del Libro
                        </Title>
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2 }}
                            size="middle"
                            className="book-descriptions"
                            labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa" }}
                        >
                            <Descriptions.Item label="ID del Libro">{book.id}</Descriptions.Item>
                            <Descriptions.Item label="Número de Páginas">{book.pageCount}</Descriptions.Item>
                            <Descriptions.Item label="Fecha de Publicación">
                                {new Date(book.publishDate).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Año">{new Date(book.publishDate).getFullYear()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {/* Author Information */}
                    <Card className="sidebar-card">
                        <div className="author-section">
                            <Title level={3} className="section-title">
                                Información del Autor
                            </Title>
                            {author ? (
                                <div className="author-info">
                                    <div className="author-avatar-section">
                                        <Avatar size={80} icon={<UserOutlined />} className="author-avatar" />
                                        <div className="author-details">
                                            <Title level={4} className="author-name">
                                                {author.firstName} {author.lastName}
                                            </Title>
                                            <Text type="secondary">Autor</Text>
                                        </div>
                                    </div>
                                    <Divider />
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="ID del Autor">{author.id}</Descriptions.Item>
                                        <Descriptions.Item label="Libro Asociado">ID: {author.idBook}</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            ) : (
                                <div className="no-author">
                                    <Avatar size={80} icon={<UserOutlined />} className="author-avatar-empty" />
                                    <Text type="secondary" className="no-author-text">
                                        No se encontró información del autor
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="sidebar-card">
                        <Title level={4} className="section-title">
                            Estadísticas Rápidas
                        </Title>
                        <div className="quick-stats">
                            <div className="stat-item">
                                <div className="stat-number">{book.pageCount}</div>
                                <div className="stat-label">Páginas</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{new Date(book.publishDate).getFullYear()}</div>
                                <div className="stat-label">Año</div>
                            </div>

                        </div>

                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookDetail
