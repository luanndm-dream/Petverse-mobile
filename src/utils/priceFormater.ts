export function priceFormater(number: number) {
  // Kiểm tra nếu không phải số hợp lệ thì trả về '0 VND'
  if (isNaN(number) || number === null || number === undefined) {
    return '0 VND';
  }

  // Sử dụng phương thức toLocaleString để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}