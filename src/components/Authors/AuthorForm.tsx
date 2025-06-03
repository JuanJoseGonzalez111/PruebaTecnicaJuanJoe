import type React from "react"
import { useEffect, useState } from "react"
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Space,
    notification,
    Alert,
    message
} from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';

import type { Author } from "../../services/authorService"

interface AuthorFormProps {
    open: boolean
    onClose: () => void
    onSubmit: (author: Omit<Author, "id">) => Promise<void>
    author?: Author | null
    title: string
}

const AuthorForm: React.FC<AuthorFormProps> = ({ open, onClose, onSubmit, author, title }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState<{
        show: boolean;
        type: 'success' | 'error';
        message: string;
        description?: string;
    }>({
        show: false,
        type: 'success',
        message: ''
    });


    useEffect(() => {
        if (open) {
            setAlertInfo({ show: false, type: 'success', message: '' });
            if (author) {
                form.setFieldsValue({
                    firstName: author.firstName,
                    lastName: author.lastName,
                    idBook: author.idBook,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, author, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setAlertInfo({ show: false, type: 'success', message: '' });

        try {
            await onSubmit(values);


            notification.success({
                message: author ? 'Autor actualizado' : 'Autor creado',
                description: `${values.firstName} ${values.lastName} ha sido ${author ? 'actualizado' : 'creado'} exitosamente.`,
                placement: 'topRight',
                duration: 4,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });


            setTimeout(() => {
                form.resetFields();
                onClose();
                setAlertInfo({ show: false, type: 'success', message: '' });
            }, 2000);

        } catch (error) {
            console.error("Error submitting form:", error);


            message.error({
                content: `Error al ${author ? 'actualizar' : 'crear'} el autor`,
                duration: 4,
                style: { marginTop: '20vh' }
            });




        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setAlertInfo({ show: false, type: 'success', message: '' });
        onClose();
    };

    return (
        <Modal
            title={title}
            open={open}
            onCancel={handleCancel}
            width={500}
            footer={null}
            destroyOnClose
            maskClosable={!loading}
        >

            {alertInfo.show && (
                <Alert
                    message={alertInfo.message}
                    description={alertInfo.description}
                    type={alertInfo.type}
                    showIcon
                    style={{ marginBottom: 16 }}
                    closable
                    onClose={() => setAlertInfo({ show: false, type: 'success', message: '' })}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                disabled={loading}
            >
                <Form.Item
                    name="firstName"
                    label="Nombre"
                    rules={[
                        { required: true, message: 'Por favor ingresa el nombre del autor' },
                        { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },

                    ]}
                >
                    <Input
                        placeholder="Ingresa el nombre del autor"
                        size="large"
                        prefix={<UserOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Apellido"
                    rules={[
                        { required: true, message: 'Por favor ingresa el apellido del autor' },
                        { min: 2, message: 'El apellido debe tener al menos 2 caracteres' },

                    ]}
                >
                    <Input
                        placeholder="Ingresa el apellido del autor"
                        size="large"
                        prefix={<UserOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="idBook"
                    label="ID del Libro"
                    rules={[
                        { required: true, message: 'Por favor ingresa el ID del libro' },
                        { type: 'number', min: 1, message: 'El ID del libro debe ser mayor a 0' }
                    ]}
                    extra="ID del libro con el que está asociado este autor"
                >
                    <InputNumber
                        placeholder="Ej: 1"
                        style={{ width: '100%' }}
                        size="large"
                        min={1}
                        max={999999}
                        prefix={<BookOutlined />}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleCancel}
                            size="large"
                            icon={<CloseOutlined />}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            {author ? "Actualizar" : "Crear"} Autor
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuthorForm;