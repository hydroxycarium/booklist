class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(Book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${Book.title}</td>
        <td>${Book.author}</td>
        <td>${Book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(row);
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        };
    }
}

class Store {
    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = [];

        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function (book) {
            const ui = new UI();
            ui.addBookToList(book);
        })
    }
    static addBooks(Book) {
        const books = Store.getBooks();
        books.push(Book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBooks(isbn) {
        const books = Store.getBooks();
        books.forEach(function (book, index) {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM load event

document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener for addBook
document.getElementById('book-form').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill all fields', 'error');
    } else {
        ui.addBookToList(book);
        Store.addBooks(book);
        ui.clearFields(book);
        Store.getBooks();
        ui.showAlert('Congratulation', 'success');
    }

    e.preventDefault();
});

// Event listener for deleteBook

document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteBook(e.target);
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
    ui.showAlert('Book removed', 'success');

    e.preventDefault();
});

