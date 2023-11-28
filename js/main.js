const form = document.querySelector('.form-option');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
let resultsToDisplay;

function fetchVolumes() {
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
      viewSwap('searchResults');
      renderSearch(resultsToDisplay);
    })
    .catch((error) => {
      renderSearch(resultsToDisplay);
      throw error;
    });
}

function extractResults(data) {
  const extractedResults = [];
  const newArry = data.items.slice(0,8);

  newArry.forEach(item => {
    const currentItem = item.volumeInfo;
    const industryIdentifiers = currentItem.industryIdentifiers || [];
    const firstIdentifier = industryIdentifiers[0] || {};

    const result = {
      title: currentItem.title || 'Title not available',
      author: currentItem.authors
        ? currentItem.authors.join(', ')
        : 'Author not available',
      numPages: currentItem.pageCount
        ? `${currentItem.pageCount} pages`
        : 'Number of pages not available',
      isbn: `${firstIdentifier.type || 'Type not available'} : ${
        firstIdentifier.identifier || 'Identifier not available'
      }`,
      previewLink:
        currentItem.imageLinks?.smallThumbnail || './images/default-image-url.png',
    };
    extractedResults.push(result);
  });

  return extractedResults;
}

function viewSwap(elementToSwap) {
  const search = document.querySelector('.search');

  if(elementToSwap === 'searchResults'){
    search.style.display = 'none';
  }
  // will build on this when clicking find a book, your bookshelf, or adding book to bookshelf
}

function renderSearch(resultsToDisplay) {
  if (!resultsToDisplay) {
    const targetElement = document.querySelector('.tag-line');
    const closestParent = targetElement.closest('.row');
    const noBooksContainer = document.createElement('div');

    closestParent.insertAdjacentElement('afterend', noBooksContainer);
    noBooksContainer.innerHTML = '<p>No Books Found! Search Again.</p>';
  } else {
    const searchContainer = document.querySelector('.search-results');

    const searchResultsTitleContainer = document.createElement('div');
    searchResultsTitleContainer.classList.add('search-results-title-container');

    const searchResultsH2 = document.createElement('h2');
    searchResultsH2.classList.add('search-results-title');
    searchResultsH2.textContent = 'Search Results';

    const searchListContainer = document.createElement('div');
    searchListContainer.classList.add('search-list-container');

    searchResultsTitleContainer.appendChild(searchResultsH2);
    searchContainer.appendChild(searchResultsTitleContainer);
    searchContainer.appendChild(searchListContainer);

    resultsToDisplay.forEach((result) => {
      const searchResultsContainer = document.querySelector('.search-list-container');

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
}

searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  fetchVolumes();
  form.reset();
});
