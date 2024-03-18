class Book {
  constructor (title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.date = Date.now();
  }
}

class Libarary {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (this.titleRepeats(newBook)) return;
    this.books.push(newBook);
    gridUpdate();
    myform.reset();
    dialog.close();
  }

  titleRepeats(newBook) {
    for (let book of this.books) {
      if (book.title === newBook.title) {
        titleError.classList.add('active');
        return true;
      }
    }
  }

  removeBook(newBook) {
    this.books = this.books.filter((item) => item.title != newBook.title);
    gridUpdate();
  }

  sort(order) {
    if (order === 'title') this.books.sort((a, b) => (a.title > b.title) ? 1 : -1);
    if (order === 'author') this.books.sort((a, b) => (a.author > b.author) ? 1 : -1);
    if (order === 'newFirst') this.books.sort((a, b) => (a.date < b.date) ? 1 : -1);
    if (order === 'oldFirst') this.books.sort((a, b) => (a.date > b.date) ? 1 : -1);
    gridUpdate();
  }
  
}

const library = new Libarary();

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
const resetButton = document.querySelector('#btnReset');

// Functions

function setFirstCard() {
  const startCard = document.createElement('div');
  startCard.classList.add('newBook');
  startCard.classList.add('start');
  const showButton = document.createElement('button');
  showButton.innerText = '➕'
  startCard.appendChild(showButton);
  showButton.onclick = () => dialog.showModal();
  grid.appendChild(startCard);
};


const addBookToLibrary = function(e) {
  e.preventDefault();
  const myBook = new Book(title.value.trim(), author.value.trim(), pages.value, read.checked);
  library.addBook(myBook);  
}

const gridUpdate = function() {
  grid.innerHTML = '';
  setFirstCard();
  for (let book of library.books) {
    addBookToGrid(book);
  }
  booksQ.innerText = `Books: ${library.books.length}`;
  readQ.innerText = `Books read: ${library.books.filter((item) => item.read).length}`
}

const addBookToGrid = function(book) {
  titleError.classList.remove('active');
  const newBookCard = document.createElement('div');
  newBookCard.dataset.title = book.title;
  newBookCard.classList.add('newBook');
  createBookContainer(newBookCard, book);
  grid.appendChild(newBookCard);
}

const createBookContainer = function(container, object) {
  function createEl(type, text, classList) {
    const el = document.createElement(type)
    el.innerText = text
    el.classList.add = classList
    container.appendChild(el)
    return {el}
  }
  createEl('h2', object.title)
  createEl('h3', `By ${object.author}`)
  createEl('h4', `Pages: ${object.pages}`)
  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btnGroup');
  container.appendChild(btnGroup);
  createChangeButton(btnGroup, object);
  createRemoveButton(btnGroup, object);
}

const createChangeButton = function(container, object) {
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
    readQ.innerText = `Books read: ${library.books.filter((item) => item.read).length}`
  });
  container.appendChild(newBookChange);
  
}

const createRemoveButton = function(container, object) {
  const removeBook = document.createElement('button');
  removeBook.innerText = 'Remove';
  removeBook.classList.add('remove');
  removeBook.addEventListener('click', function() {
    library.removeBook(object);
  })
  container.appendChild(removeBook);
}

const searchBooks = function() {
  let searchArray = library.books.filter((item) => {
    return item.title.toLowerCase().includes(searchBar.value.toLowerCase()) || item.author.toLowerCase().includes(searchBar.value.toLowerCase());
  });
  grid.innerHTML = '';
  setFirstCard();
  for (let item of searchArray) {
    addBookToGrid(item);
  }
}

const resetSearch = function(){
  gridUpdate();
  searchBar.value = '';
}

// DOM elements events

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

myform.onsubmit = addBookToLibrary;
searchButton.onclick = searchBooks;
resetButton.onclick = resetSearch;
cancelButton.onclick = () => dialog.close();
filterSelect.onchange = () => library.sort(filterSelect.value);

setFirstCard();










