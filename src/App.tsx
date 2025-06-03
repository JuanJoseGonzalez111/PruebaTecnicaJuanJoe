import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ConfigProvider, theme } from "antd"
import { Layout } from "antd"
import Navbar from "./components/Shared/Navbar"
import BooksList from "./pages/BooksList"
import BookDetail from "./pages/BookDetail"
import AuthorsList from "./pages/AuthorsList"
import Home from "./pages/Home"
import "./styles/global.css"

const { Content } = Layout

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1890ff",
                    borderRadius: 6,
                    colorSuccess: "#52c41a",
                    colorWarning: "#faad14",
                    colorError: "#ff4d4f",
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            <Router>
                <Layout className="layout">
                    <Navbar />
                    <Content className="site-content">
                        <div className="site-content-container">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/books" element={<BooksList />} />
                                <Route path="/books/:id" element={<BookDetail />} />
                                <Route path="/authors" element={<AuthorsList />} />
                            </Routes>
                        </div>
                    </Content>
                </Layout>
            </Router>
        </ConfigProvider>
    )
}

export default App
