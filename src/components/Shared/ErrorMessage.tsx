import type React from "react"
import { Alert, Button, Space } from "antd"
import { ReloadOutlined } from "@ant-design/icons"

interface ErrorMessageProps {
    message: string
    onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div style={{ margin: '16px 0' }}>
            <Alert
                message="Error"
                description={
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <span>{message}</span>
                        {onRetry && (
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={onRetry}
                                type="default"
                                size="small"
                            >
                                Try Again
                            </Button>
                        )}
                    </Space>
                }
                type="error"
                showIcon
            />
        </div>
    )
}

export default ErrorMessage