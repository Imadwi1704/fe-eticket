import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://be.museumlampung.store';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  baseUrl
};
