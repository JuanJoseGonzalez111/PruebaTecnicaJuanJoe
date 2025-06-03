"use client"

import type React from "react"
import { Card, Typography, Button, Space, Tag, Tooltip, Avatar, Popconfirm } from "antd"
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CalendarOutlined,
    FileTextOutlined,
    BookOutlined,
    UserOutlined,
} from "@ant-design/icons"
import type { Book } from "../../services/bookService"
import { useNavigate } from "react-router-dom"

const { Title, Paragraph, Text } = Typography

interface BookCardProps {
    book: Book
    onEdit: (book: Book) => void
    onDelete: (id: number) => void
    author?: { firstName: string; lastName: string } | null
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, author }) => {
    const navigate = useNavigate()

    const handleViewDetails = () => {
        navigate(`/books/${book.id}`)
    }

    const handleDelete = () => {
        onDelete(book.id)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
        })
    }

    return (
        <Card
            hoverable
            className="modern-book-card"
            cover={
                <div className="book-card-header">
                    <div className="book-cover-modern">
                        <BookOutlined />
                        <div className="book-spine"></div>
                    </div>
                    <div className="book-actions-overlay">
                        <Space>
                            <Tooltip title="Ver detalles">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<EyeOutlined />}
                                    onClick={handleViewDetails}
                                    className="action-btn"
                                />
                            </Tooltip>
                            <Tooltip title="Editar">
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(book)}
                                    className="action-btn"
                                />
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <Popconfirm
                                    title="¿Eliminar libro?"
                                    description={`¿Estás seguro de que quieres eliminar "${book.title}"? Esta acción no se puede deshacer.`}
                                    onConfirm={handleDelete}
                                    okText="Eliminar"
                                    cancelText="Cancelar"
                                    okType="danger"
                                    placement="topRight"
                                >
                                    <Button
                                        danger
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        className="action-btn"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    </div>
                </div>
            }
            styles={{
                body: { padding: '16px' }
            }}
        >
            <div className="book-card-content">
                <div className="book-header-info">
                    <Title level={4} ellipsis={{ rows: 2 }} className="book-title-modern">
                        {book.title}
                    </Title>
                    {author && (
                        <div className="book-author-info">
                            <Avatar size="small" icon={<UserOutlined />} className="author-avatar-small" />
                            <Text className="author-name-small">
                                {author.firstName} {author.lastName}
                            </Text>
                        </div>
                    )}
                </div>

                <Paragraph ellipsis={{ rows: 3 }} className="book-description-modern">
                    {book.description}
                </Paragraph>

                <div className="book-metadata">
                    <div className="metadata-row">
                        <Tag icon={<FileTextOutlined />} color="blue" className="metadata-tag">
                            {book.pageCount} páginas
                        </Tag>
                        <Tag icon={<CalendarOutlined />} color="green" className="metadata-tag">
                            {formatDate(book.publishDate)}
                        </Tag>
                    </div>
                </div>
            </div>


        </Card>
    )
}

export default BookCard