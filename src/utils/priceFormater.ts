export function priceFormater(number: number) {
    if (isNaN(number)) return 'Invalid number';
  
    // Sử dụng phương thức toLocaleString để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }
  