"use client"

import React, {useMemo} from "react"
import {Typography, Row, Col, Card, Button, Statistic, Spin} from "antd"
import {BookOutlined, UserOutlined, ReadOutlined, RocketOutlined, AppstoreOutlined} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import {useBooks} from "../hooks/useBooks.ts";
import {useAuthors} from "../hooks/useAuthors.ts";

const { Title, Paragraph } = Typography
const { Meta } = Card

const Home: React.FC = () => {
    const navigate = useNavigate()

    const { books, loading: booksLoading } = useBooks()
    const { authors, loading: authorsLoading } = useAuthors()


    const stats = useMemo(() => {

        const totalPages = books.reduce((sum, book) => sum + book.pageCount, 0)

        const uniqueFirstLetters = new Set(books.map((book) => book.title.charAt(0).toUpperCase()))
        const categoriesCount = uniqueFirstLetters.size

        return {
            books: books.length,
            authors: authors.length,
            pages: totalPages,
            categories: categoriesCount,
        }
    }, [books, authors])

    const isLoading = booksLoading || authorsLoading

    return (
        <div className="home-container">
            <div className="hero-section">
                <Title level={1}>Biblioteca Digital</Title>
                <Paragraph className="hero-subtitle">Gestiona tu colección de libros y autores de manera eficiente</Paragraph>
                <div className="hero-actions">
                    <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => navigate("/books")}>
                        Explorar Libros
                    </Button>
                    <Button size="large" onClick={() => navigate("/authors")}>
                        Ver Autores
                    </Button>
                </div>
            </div>

            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={12} md={6}>
                    <Card>
                        {isLoading ? (
                            <div className="stat-loading">
                                <Spin size="small" />
                            </div>
                        ) : (
                            <Statistic
                                title="Libros"
                                value={stats.books}
                                prefix={<BookOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        {isLoading ? (
                            <div className="stat-loading">
                                <Spin size="small" />
                            </div>
                        ) : (
                            <Statistic
                                title="Autores"
                                value={stats.authors}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        {isLoading ? (
                            <div className="stat-loading">
                                <Spin size="small" />
                            </div>
                        ) : (
                            <Statistic
                                title="Páginas Totales"
                                value={stats.pages}
                                prefix={<ReadOutlined />}
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        {isLoading ? (
                            <div className="stat-loading">
                                <Spin size="small" />
                            </div>
                        ) : (
                            <Statistic
                                title="Categorías"
                                value={stats.categories}
                                prefix={<AppstoreOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} className="features-row">
                <Col xs={24} md={8}>
                    <Card
                        hoverable
                        cover={<BookOutlined className="feature-icon" />}
                        onClick={() => navigate("/books")}
                        className="feature-card"
                    >
                        <Meta
                            title="Gestión de Libros"
                            description="Añade, edita y elimina libros de tu colección. Visualiza detalles completos de cada libro."
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        hoverable
                        cover={<UserOutlined className="feature-icon" />}
                        onClick={() => navigate("/authors")}
                        className="feature-card"
                    >
                        <Meta
                            title="Gestión de Autores"
                            description="Administra los autores y visualiza cuántos libros ha publicado cada uno en tu colección."
                        />
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default Home
