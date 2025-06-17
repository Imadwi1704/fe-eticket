import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    baseUrl
}