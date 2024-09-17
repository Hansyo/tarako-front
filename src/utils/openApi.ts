import {
  Configuration,
  SectionApi,
  TaskApi,
  UserApi,
  ChatApi,
  UserDiaryApi,
} from '@/generated/typescript-axios';
import axios from 'axios';

// const mockApiConfig = new Configuration({
//   basePath: process.env.NEXT_PUBLIC_MOCK_API_URL,
// });

// const mockAxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
// });

const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL,
});

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const userApi = new UserApi(apiConfig, '', axiosInstance);
export const sectionApi = new SectionApi(apiConfig, '', axiosInstance);
export const taskApi = new TaskApi(apiConfig, '', axiosInstance);
export const chatApi = new ChatApi(apiConfig, '', axiosInstance);
export const userDiaryApi = new UserDiaryApi(apiConfig, '', axiosInstance);
