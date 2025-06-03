import type React from "react"
import { Layout, Menu, Typography } from "antd"
import { Link, useLocation } from "react-router-dom"
import { BookOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"

const { Header } = Layout
const { Title } = Typography

const Navbar: React.FC = () => {
    const location = useLocation()

    const getSelectedKey = () => {
        if (location.pathname === "/") return "home"
        if (location.pathname.includes("/books")) return "books"
        if (location.pathname === "/authors") return "authors"
        return ""
    }

    const menuItems: MenuProps["items"] = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: "books",
            icon: <BookOutlined />,
            label: <Link to="/books">Books</Link>,
        },
        {
            key: "authors",
            icon: <UserOutlined />,
            label: <Link to="/authors">Authors</Link>,
        },
    ]

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#1976d2",
                padding: "0 24px",
            }}
        >
            <Title
                level={4}
                style={{
                    color: "white",
                    margin: 0,
                    marginRight: "auto",
                    fontWeight: 500,
                }}
            >
                Books & Authors App
            </Title>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[getSelectedKey()]}
                items={menuItems}
                style={{
                    backgroundColor: "transparent",
                    borderBottom: "none",
                    minWidth: "300px",
                    justifyContent: "flex-end",
                }}
            />
        </Header>
    )
}

export default Navbar
