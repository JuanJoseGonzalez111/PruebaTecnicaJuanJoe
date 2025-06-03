import type React from "react"
import { useEffect, useState } from "react"
import {
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Space,
    notification,
    Alert,

} from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import type { Book } from "../../services/bookService"

const { TextArea } = Input;

interface BookFormProps {
    open: boolean
    onClose: () => void
    onSubmit: (book: Omit<Book, "id">) => Promise<void>
    book?: Book | null
    title: string
}

const BookForm: React.FC<BookFormProps> = ({ open, onClose, onSubmit, book, title }) => {
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

    // Limpiar alertas al abrir/cerrar modal
    useEffect(() => {
        if (open) {
            setAlertInfo({ show: false, type: 'success', message: '' });
            if (book) {
                form.setFieldsValue({
                    title: book.title,
                    description: book.description,
                    pageCount: book.pageCount,
                    excerpt: book.excerpt,
                    publishDate: book.publishDate ? dayjs(book.publishDate) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, book, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setAlertInfo({ show: false, type: 'success', message: '' });

        try {

            const formattedValues = {
                ...values,
                publishDate: values.publishDate ? values.publishDate.toISOString() : new Date().toISOString(),
            };

            await onSubmit(formattedValues);


            notification.success({
                message: book ? 'Libro actualizado' : 'Libro creado',
                description: `El libro "${values.title}" ha sido ${book ? 'actualizado' : 'creado'} exitosamente.`,
                placement: 'topRight',
                duration: 4,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });


            setAlertInfo({
                show: true,
                type: 'success',
                message: `¡Éxito! Libro ${book ? 'actualizado' : 'creado'}`,
                description: `El libro "${values.title}" se ha guardado correctamente.`
            });


            setTimeout(() => {
                form.resetFields();
                onClose();
                setAlertInfo({ show: false, type: 'success', message: '' });
            }, 2000);

        } catch (error) {
            console.error("Error submitting form:", error);


            notification.error({
                message: 'Error al guardar',
                description: `Ha ocurrido un error al ${book ? 'actualizar' : 'crear'} el libro. Por favor, inténtalo de nuevo.`,
                placement: 'topRight',
                duration: 5,
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
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
            width={600}
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
                    name="title"
                    label="Título"
                    rules={[
                        { required: true, message: 'Por favor ingresa el título del libro' },
                        { min: 2, message: 'El título debe tener al menos 2 caracteres' }
                    ]}
                >
                    <Input
                        placeholder="Ingresa el título del libro"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Descripción"
                    rules={[
                        { required: true, message: 'Por favor ingresa la descripción' },
                        { min: 5, message: 'La descripción debe tener al menos 5 caracteres' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Ingresa una descripción detallada del libro"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    name="pageCount"
                    label="Número de Páginas"
                    rules={[
                        { required: true, message: 'Por favor ingresa el número de páginas' },
                        { type: 'number', min: 1, message: 'El número de páginas debe ser mayor a 0' }
                    ]}
                >
                    <InputNumber
                        placeholder="Ej: 250"
                        style={{ width: '100%' }}
                        size="large"
                        min={1}
                        max={10000}
                    />
                </Form.Item>

                <Form.Item
                    name="excerpt"
                    label="Extracto"
                    rules={[
                        { min: 5, message: 'El extracto debe tener al menos 5 caracteres' }
                    ]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Ingresa un extracto o resumen breve del libro"
                        showCount
                        maxLength={300}
                    />
                </Form.Item>

                <Form.Item
                    name="publishDate"
                    label="Fecha de Publicación"
                    rules={[
                        { required: true, message: 'Por favor selecciona la fecha de publicación' }
                    ]}
                >
                    <DatePicker
                        placeholder="Selecciona la fecha"
                        style={{ width: '100%' }}
                        size="large"
                        format="DD/MM/YYYY"
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
                            {book ? "Actualizar" : "Crear"} Libro
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookForm;