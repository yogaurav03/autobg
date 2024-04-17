// api.js
import axios from 'axios';
import {BASE_URL} from '../constants';

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'Application/json',
  },
});

// GET method
const get = async (url, token, params = {}) => {
  try {
    const response = await api.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('GET Error:', error.response);
    throw error;
  }
};

// POST method
const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('POST Error:', error.response);
    throw error;
  }
};

// PUT method
const put = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('PUT Error:', error.response);
    throw error;
  }
};

// DELETE method
const del = async url => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('DELETE Error:', error.response);
    throw error;
  }
};

// POST method for multipart/form-data
const postFormData = async (url, data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('POST (multipart/form-data) Error:', error.response);
    throw error;
  }
};

export default {
  get,
  post,
  put,
  delete: del,
  postFormData,
};
