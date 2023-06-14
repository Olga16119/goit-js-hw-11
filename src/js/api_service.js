import axios from 'axios';

const API_KEY = `37098068-44e27cfa1b1d9a8c1939cc69f`;
const BASE_URL = `https://pixabay.com/api/`;



export async function fetchImages(searchQuery, page) {
    const params = {
  key: API_KEY,
  image_type: `photo`,
  orientation: `horizontal`,
  safesearch: true,
  q: searchQuery,
  per_page: 40,
  page: page,
};
    const { data } = await axios.get(BASE_URL, { params });
    return data
}