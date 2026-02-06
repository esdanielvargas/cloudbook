export const formatPhoneNumber = (phone, code) => {
  const cleanPhone = phone.replace(/\s/g, "");

  if (code === "503") {
    return cleanPhone.replace(/(\d{4})(\d{0,4})/, "$1 $2").trim();
  }

  if (cleanPhone.length === 9) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{0,4})/, "$1 $2 $3").trim();
  }

  return cleanPhone;
};