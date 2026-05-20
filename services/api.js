import axios from 'axios';

const API_BASE_URL = 'http://10.1.15.171:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllHewans = async () => {
  try {
    const response = await api.get('/hewans');
    console.log('API Response FULL:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('API Error DETAIL:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      return error.response.data;
    }
    return { status: 500, message: 'Gagal mengambil data', data: null };
  }
};

export const getHewanByCategory = async (category) => {
  try {
    const response = await api.get(`/hewans/${category}`);  
    console.log(`API Response for category ${category}:`, JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      return error.response.data;
    }
    return { status: 500, message: 'Gagal mengambil data', data: null };
  }
};

export const getHewanById = async (id) => {
  try {
    const response = await api.get(`/hewans/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, message: 'Gagal mengambil detail', data: null };
  }
};

// export const createHewan = async (hewanData) => {
//   try {
//     const response = await api.post('/hewans', hewanData);
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error);
//     return { status: 500, message: 'Gagal menambahkan data', data: null };
//   }
// };

export const createHewan = async (hewanData) => {
  try {
    const response = await api.post('/hewans', hewanData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      return error.response.data;
    }
    return { status: 500, message: 'Gagal menambahkan data', data: null };
  }
};

export const deleteHewan = async (id) => {
  try {
    const response = await api.delete(`/hewans/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, message: 'Gagal menghapus data', data: null };
  }
};

export default api;