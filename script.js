const myform = document.querySelector('form');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const pages = document.querySelector('#pages');
const read = document.querySelector('#read');
const cancelButton = document.querySelector('#cancel');
const dialog = document.querySelector('dialog');
const grid = document.querySelector('.grid');
const titleError = document.querySelector('.title-error');

const booksQ = document.querySelector('.booksQ');
const readQ = document.querySelector('.readQ');

const searchBar = document.querySelector('#searchbar');
const searchButton = document.querySelector('#searchButton');


const filterSelect = document.querySelector('#filter-select');
document.querySelector('#btnReset').addEventListener('click', () => {
  gridUpdate();
  searchBar.value = '';
})

let myLibrary = [];

cancelButton.onclick = () => dialog.close();
myform.onsubmit = addBookToLibrary;

searchButton.onclick = searchBooks;

filterSelect.onchange = () => {
  if (filterSelect.value == 'title') sortByName();
  if (filterSelect.value == 'author') sortByAuthors();
  if (filterSelect.value == 'newFirst') sortNewFirst();
  if (filterSelect.value == 'oldFirst') sortOldFirst();
 
}


function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.date = Date.now();
  this.info = function() {
      return (`The ${this.title} by ${this.author}, ${this.pages}pages, ${this.read ? 'read.' : 'not read yet.'}`)
  }
}

function start() {
  const startCard = document.createElement('div');
  startCard.classList.add('newBook');
  startCard.classList.add('start');
  const showButton = document.createElement('button');
  showButton.innerText = '➕'
  startCard.appendChild(showButton);
  showButton.onclick = () => dialog.showModal();
  grid.appendChild(startCard);
}

function addBookToLibrary(e) {
  e.preventDefault();
  const myBook = new Book(title.value.trim(), author.value.trim(), pages.value, read.checked);
  if (!titleRepeats(myBook)) {
    myLibrary.push(myBook);
    gridUpdate();
    myform.reset();
    dialog.close();
  } 
}

function titleRepeats(newBook) {
  for (let book of myLibrary) {
    if (book.title === newBook.title) {
      titleError.classList.add('active');
      return true;
    }
    
  }
}

function gridUpdate() {
  grid.innerHTML = '';
  start();
  for (let item of myLibrary) {
    addBookToGrid(item);
  }
  booksQ.innerText = `Books: ${myLibrary.length}`;
  readQ.innerText = `Books read: ${myLibrary.filter((item) => item.read).length}`
}

function addBookToGrid(book) {
  titleError.classList.remove('active');
  const newBook = document.createElement('div');
  newBook.dataset.title = book.title;
  newBook.classList.add('newBook');
  createBookContainer(newBook, book);
  grid.appendChild(newBook);
}

function createBookContainer(container, object) {
  const newBookTitle = document.createElement('h2');
  newBookTitle.innerText = object.title;
  container.appendChild(newBookTitle);

  const newBookAuthor = document.createElement('h3');
  newBookAuthor.innerText = `By ${object.author}`;
  container.appendChild(newBookAuthor);

  const newBookPages = document.createElement('h4');
  newBookPages.innerText = `Pages: ${object.pages}`;
  container.appendChild(newBookPages);

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btnGroup');
  container.appendChild(btnGroup);

  createChangeButton(btnGroup, object);
  createRemoveButton(btnGroup, object);
}

function createChangeButton(container, object) {
  const newBookChange = document.createElement('button');
  object.read ? newBookChange.innerText = 'Read' : newBookChange.innerText = 'Not read';
  newBookChange.classList.add('changeRead');
  if (object.read) newBookChange.classList.toggle('active');
  newBookChange.addEventListener('click', function() {
    this.classList.toggle('active');
    if (object.read)  {
      object.read = false;
      newBookChange.innerText = 'Not read'; 
    } else {
      object.read = true;
      newBookChange.innerText = 'Read';
    }
    readQ.innerText = `Books read: ${myLibrary.filter((item) => item.read).length}`
  });
  container.appendChild(newBookChange);
  
}

function createRemoveButton(container, object) {
  const removeBook = document.createElement('button');
  removeBook.innerText = 'Remove';
  removeBook.classList.add('remove');
  removeBook.addEventListener('click', function() {
    myLibrary = myLibrary.filter((item) => item.title != object.title);
    gridUpdate();
  })
  container.appendChild(removeBook);
}

function searchBooks() {
  let searchArray = myLibrary.filter(searchFilter);
  grid.innerHTML = '';
  start();
  for (let item of searchArray) {
    addBookToGrid(item);
  }
}

function searchFilter(item) {
  return item.title.toLowerCase().startsWith(searchBar.value.toLowerCase()) || item.author.toLowerCase().startsWith(searchBar.value.toLowerCase());
}

function sortByName() {
  myLibrary.sort((a, b) => (a.title > b.title) ? 1 : -1);
  gridUpdate();
}

function sortByAuthors() {
  myLibrary.sort((a, b) => (a.author > b.author) ? 1 : -1);
  gridUpdate();
}

function sortNewFirst() {
  myLibrary.sort((a,b) => (a.date < b.date) ? 1 : -1);
  gridUpdate();
}

function sortOldFirst() {
  myLibrary.sort((a,b) => (a.date > b.date) ? 1 : -1);
  gridUpdate();
}

dialog.addEventListener("click", e => {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close()
    }
  })


start();