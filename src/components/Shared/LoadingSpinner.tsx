import type React from "react"
import { Spin, Typography } from "antd"

const { Text } = Typography

interface LoadingSpinnerProps {
    message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            gap: '16px'
        }}>
            <Spin size="large" />
            <Text type="secondary" style={{ fontSize: '16px' }}>
                {message}
            </Text>
        </div>
    )
}

export default LoadingSpinner