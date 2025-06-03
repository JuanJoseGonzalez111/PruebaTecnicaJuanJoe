import type React from "react"
import { Card, Typography, Button, Tag, Popconfirm } from "antd"
import { EditOutlined, DeleteOutlined, UserOutlined, BookOutlined } from "@ant-design/icons"
import type { Author } from "../../services/authorService"

const { Text, Title } = Typography

interface AuthorCardProps {
    author: Author
    bookCount?: number
    onEdit: (author: Author) => void
    onDelete: (id: number) => void
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, bookCount = 0, onEdit, onDelete }) => {
    const handleDelete = () => {
        onDelete(author.id)
    }

    return (
        <Card
            className="author-card"
            hoverable
            actions={[
                <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(author)}
                    className="action-button"
                >
                    Editar
                </Button>,
                <Popconfirm
                    key="delete"
                    title="¿Eliminar autor?"
                    description="¿Estás seguro de que quieres eliminar este autor? Esta acción no se puede deshacer."
                    onConfirm={handleDelete}
                    okText="Eliminar"
                    cancelText="Cancelar"
                    okType="danger"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="action-button"
                    >
                        Eliminar
                    </Button>
                </Popconfirm>
            ]}
            styles={{
                body: { padding: '20px' },
                actions: {
                    backgroundColor: '#fafafa',
                    borderTop: '1px solid #f0f0f0'
                }
            }}
        >
            <div className="author-card-content">
                <div className="author-header">
                    <UserOutlined className="author-icon" />
                    <Title level={4} className="author-name">
                        {author.firstName} {author.lastName}
                    </Title>
                </div>

                <div className="author-info">
                    <Text type="secondary" className="author-id">
                        ID: {author.id}
                    </Text>
                </div>

                <div className="author-stats">
                    <Tag
                        icon={<BookOutlined />}
                        color={bookCount > 0 ? "blue" : "default"}
                        className="book-count-tag"
                    >
                        {bookCount} {bookCount === 1 ? "libro" : "libros"}
                    </Tag>
                </div>
            </div>

        </Card>
    )
}

export default AuthorCard