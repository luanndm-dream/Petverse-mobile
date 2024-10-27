export const ageFormatter = (birthDateString:any) => {
    if (!birthDateString) return 'Không xác định';
  
    const [day, month, year] = birthDateString.split('/').map(Number);
    if (!day || !month || !year) return 'Không xác định'; // Kiểm tra ngày sinh hợp lệ
  
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
  
    const diffYears = today.getFullYear() - birthDate.getFullYear();
    const diffMonths = today.getMonth() - birthDate.getMonth();
    const diffDays = today.getDate() - birthDate.getDate();
  
    let ageInMonths = diffYears * 12 + diffMonths;
  
    if (diffDays < 0) {
      ageInMonths -= 1;
    }
  
    if (ageInMonths >= 12) {
      const ageInYears = Math.floor(ageInMonths / 12);
      return `${ageInYears} tuổi`;
    } else {
      return `${ageInMonths} tháng`;
    }
  };