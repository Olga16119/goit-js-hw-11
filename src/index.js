import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = `37098068-44e27cfa1b1d9a8c1939cc69f`;
const BASE_URL = `https://pixabay.com/api/`;

const formEl = document.querySelector(`.search-form`);
const galleryEl = document.querySelector(`.gallery`);
const btnLoad = document.querySelector(`.load-more`);

let page = 1;
let searchQuery = ``;

const params = {
  key: API_KEY,
  image_type: `photo`,
  orientation: `horizontal`,
  safesearch: true,
  q: searchQuery,
  per_page: 40,
  page: page,
};

formEl.addEventListener(`submit`, onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === ``) {
    return;
  }
  page = 1;
  galleryEl.innerHTML = ``;
  btnLoad.style.display=`none`;

  try {
    const response = await axios.get(BASE_URL, { params });
    console.log(response);
    const images = response.data.hits;

    if (images.length === 0) {
      showNotFined();
      return;
    } 
    renderImages(images);
    checkTotalNumberImages(response.data.totalHits)
  } catch (error) {
    console.log('Error:', error);
    showErrorFetch();
  }
}

btnLoad.addEventListener(`click`, onLoadClick);

async function onLoadClick() {
  page += 1;
  try {
    const response = await axios.get(BASE_URL, { params });
    console.log(response);
    const images = response.data.hits;

    if (images.length === 0) {
      showNotFined();
      return;
    } 
    renderImages(images);
    checkTotalNumberImages(response.data.totalHits)
  } catch (error) {
    console.log('Error:', error);
    showErrorFetch();
  }
}

function renderImages(images) {
    const ByImage = document.createElement(`div`);
    ByImage.classList.add(`card-list`);
 

  images.forEach(image => {
    const card = createCard(image);
    ByImage.appendChild(card);
  });
  galleryEl.appendChild(ByImage);
}

function createCard(image) {
    const card = document.createElement(`div`);
    

  const img = document.createElement(`img`);
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.width = '300';

  const infoByImage = document.createElement(`div`);
  infoByImage.classList.add(`params-list`);

  const likes = createInfo(`Likes`, image.likes);
  const views = createInfo(`Views`, image.views);
  const comments = createInfo(`Comments`, image.comments);
  const downloads = createInfo(`Downloads`, image.downloads);

  infoByImage.appendChild(likes);
  infoByImage.appendChild(views);
  infoByImage.appendChild(comments);
  infoByImage.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(infoByImage);

  return card;
}

function createInfo(label, value) {
  const item = document.createElement(`p`);
  item.classList.add('info-item');
  item.innerHTML = `<span>${label}: </span>${value}`;
  return item;
}

function checkTotalNumberImages(totalHits) {
  const chekImages = totalHits - page * 40;
  if (chekImages > 0) {
    btnLoad.style.display = 'block';
  } else {
    btnLoad.style.display = 'none';
    showEndOfImages();
  }
}

function showNotFined() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showErrorFetch() {
  Notiflix.Notify.failure(
    'An error occurred while fetching the images. Please try again later.'
  );
}

function showEndOfImages() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results ."
  );
}