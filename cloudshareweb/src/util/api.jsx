const BASE_URL = "http://localhost:8080/api/v1.0";

export const api = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    CAPTURE_ORDER: (orderId) => `${BASE_URL}/payments/${orderId}/capture`,
    GET_ORDER: (orderId) => `${BASE_URL}/payments/${orderId}`,
    GET_TRANSACTIONS: `${BASE_URL}/payments/history`,
    PUBLIC_FILE_VIEW: (fileId) => `${BASE_URL}/files/public/${fileId}`
};