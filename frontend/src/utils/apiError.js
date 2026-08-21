export function getApiErrorMessage(error, fallback = "Bir hata oluştu.") {
  if (!error?.response) {
    return "Sunucuya bağlanılamadı. Lütfen tekrar deneyin.";
  }

  const detail = error.response.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item?.msg === "string") {
          return item.msg;
        }

        return "Geçersiz alan";
      })
      .join(", ");
  }

  if (detail && typeof detail === "object" && typeof detail.message === "string") {
    return detail.message;
  }

  return fallback;
}
