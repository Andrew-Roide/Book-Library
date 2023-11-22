const form = document.querySelector('.form-option');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
let resultsToDisplay = [];

function fetchAPI() {
  let searchValue = searchBar.value;
  const myRequest = `https://www.googleapis.com/books/v1/volumes?q={${searchValue}}`;

  fetch(myRequest)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      resultsToDisplay = extractResults(data);
      renderSearch(resultsToDisplay);
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}

function extractResults(data) {
  const numOfResultsToDisplay = 5;
  const extractedResults = [];

  for (let i = 0; i < numOfResultsToDisplay; i++) {
    const currentItem = data.items[i].volumeInfo;
    if (currentItem) {
      const result = {
        title: currentItem.title,
        author: currentItem.authors,
        numPages: currentItem.pageCount,
        isbn:
          currentItem.industryIdentifiers[0].type +
          ':' +
          currentItem.industryIdentifiers[0].identifier,
        previewLink: currentItem.imageLinks.thumbnail
      };
      extractedResults.push(result);
    }
  }
  return extractedResults;
}

searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  fetchAPI();
  form.reset();
});

// Issue 2 task
function renderSearch(resultsToDisplay) {
  const searchResultsContainer = document.querySelector('.search-results');

  resultsToDisplay.forEach((result) => {
    const searchResultsList = document.createElement('div');
    searchResultsList.classList.add('search-results-list');

    const bookDisplayInfo = document.createElement('div');
    bookDisplayInfo.classList.add('book-display-info');

    const bookImage = document.createElement('div');
    bookImage.classList.add('book-image');

    const bookImgPreview = document.createElement('img');
    bookImgPreview.classList.add('book-img-preview');
    bookImgPreview.src = result.previewLink;

    const bookInformation = document.createElement('div');
    bookInformation.classList.add('book-information');

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('book-title');
    bookTitle.textContent = result.title;

    const bookAuthor = document.createElement('div');
    bookAuthor.classList.add('book-author');
    bookAuthor.textContent = result.author;

    const bookNumPages = document.createElement('div');
    bookNumPages.classList.add('book-num-pages');
    bookNumPages.textContent = result.numPages;

    const bookISBN = document.createElement('div');
    bookISBN.classList.add('book-ISBN');
    bookISBN.textContent = result.isbn;

    const addBookBtnContainer = document.createElement('div');
    addBookBtnContainer.classList.add('add-book-btn-container');

    const addBookBtn = document.createElement('button');
    addBookBtn.classList.add('add-book-btn');
    addBookBtn.textContent = 'Add Book';

    bookInformation.appendChild(bookTitle);
    bookInformation.appendChild(bookAuthor);
    bookInformation.appendChild(bookNumPages);
    bookInformation.appendChild(bookISBN);
    bookDisplayInfo.appendChild(bookImage);
    bookImage.appendChild(bookImgPreview);
    bookDisplayInfo.appendChild(bookInformation);
    bookDisplayInfo.appendChild(addBookBtnContainer);
    addBookBtnContainer.appendChild(addBookBtn);
    searchResultsList.appendChild(bookDisplayInfo);
    searchResultsContainer.appendChild(searchResultsList);
  });
}
