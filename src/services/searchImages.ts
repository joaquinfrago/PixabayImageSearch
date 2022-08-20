import {API_KEY} from '../constants/PixabayApiKey';

export const searchImages = async ({q, page}: {q: string; page: number}) =>
  await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${q}&image_type=photo&page=${page}`,
  );
