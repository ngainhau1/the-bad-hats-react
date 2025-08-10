import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Product } from '../data/products';

// Định nghĩa các props mà component modal sẽ nhận
interface Props {
  show: boolean;                                  // Cờ để điều khiển việc hiện/ẩn modal
  onHide: () => void;                             // Hàm callback để đóng modal
  onSave: (product: Omit<Product, 'id'> | Product) => void; // Hàm callback để lưu thay đổi
  productToEdit: Product | null;                  // Dữ liệu sản phẩm cần sửa (nếu là null, tức là chế độ Thêm mới)
}

// Dữ liệu mặc định cho form khi ở chế độ Thêm mới
const initialFormData = {
  name: '',
  price: 0,
  image: '',
  description: '',
};

/**
 * Component Modal đa năng, dùng cho cả việc Thêm và Sửa sản phẩm.
 */
const ProductModal = ({ show, onHide, onSave, productToEdit }: Props) => {
  // State để quản lý dữ liệu của các ô input trong form
  const [formData, setFormData] = useState<Omit<Product, 'id'> | Product>(initialFormData);

  // useEffect sẽ chạy mỗi khi `productToEdit` hoặc `show` thay đổi
  useEffect(() => {
    // Nếu có `productToEdit` (chế độ Sửa), điền dữ liệu của sản phẩm đó vào form
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      // Nếu không (chế độ Thêm mới), reset form về trạng thái rỗng
      setFormData(initialFormData);
    }
  }, [productToEdit, show]);

  // Xử lý sự kiện khi người dùng thay đổi giá trị trong các ô input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Cập nhật formData một cách linh hoạt, xử lý riêng cho trường `price` là kiểu số
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  // Xử lý sự kiện khi nhấn nút "Lưu"
  const handleSave = () => {
    // Gọi hàm onSave được truyền từ component cha (ProductPage) với dữ liệu hiện tại của form
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        {/* Tiêu đề của modal sẽ thay đổi tùy theo chế độ Thêm hay Sửa */}
        <Modal.Title>{productToEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá sản phẩm</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Đường dẫn hình ảnh</Form.Label>
            <Form.Control type="text" name="image" placeholder="/imgs/ten_file_anh.png" value={formData.image} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả sản phẩm</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" onClick={handleSave}>Lưu thay đổi</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;