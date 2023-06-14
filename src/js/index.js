import Notiflix from 'notiflix';
import { fetchImages } from './api_service';

const formEl = document.querySelector(`.search-form`);
const galleryEl = document.querySelector(`.gallery`);
const btnLoad = document.querySelector(`.load-more`);

let page = 1;
let searchQuery = ``;

formEl.addEventListener(`submit`, onFormSubmit);
btnLoad.style.display = `none`;

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === ``) {
    showErrorFetch();
    return;
  }
  page = 1;
  galleryEl.innerHTML = ``;

  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page);

    if (hits.length === 0) {
      
      showNotResolt();
      return;
    }
    renderImages(hits);
    checkTotalNumberImages(totalHits);
  } catch (error) {
    console.log('Error:', error);
    showErrorFetch();
  }
}

btnLoad.addEventListener(`click`, onLoadClick);

async function onLoadClick() {
  page += 1;
  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page);

    if (hits.length === 0) {
      showNotResolt();
      return;
    }
    renderImages(hits);
    checkTotalNumberImages(totalHits);
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

// function createCard(image) {
//   const card = `<div><img src="${image.webformatURL}" alt="${image.tags}" width="300"><div class="params-list"><p class="info-item">Likes: ${image.likes}</p><p class="info-item">Views: ${image.views}</p><p class="info-item">Comments: ${image.comments}</p><p class="info-item">Downloads: ${image.downloads}</p></div></div>`;

//   return card
// }

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

function showNotResolt() {
  btnLoad.style.display = `none`;

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showErrorFetch() {
  btnLoad.style.display = `none`;

  Notiflix.Notify.failure(
    'An error occurred while fetching the images. Please try again later.'
  );
}

function showEndOfImages() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results ."
  );
}
