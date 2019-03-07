// Book class - Represents book

class Book{

	// Runs every time we instatiate a book
	constructor(name, author, isbn){
		this.name = name;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI class - Handles UI

class UI{
	static displayBooks(){

		// Getting books from local storage
		const books = Store.getBooks();

		// Looping through elements
		books.forEach((book) => UI.addBookToList(book));
	}

	// Adding book to table row
	static addBookToList(book){
		const list = document.getElementById('book-list');

		// Creating a HTML row & displaying data
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.name}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;

		// Appending data to row
		list.appendChild(row);
	}

	// Delete Book
	static deleteBook(el){
		if (el.classList.contains('delete')) {

			// Removing the 'X' then the '<td>' then the '<tr>'
			el.parentElement.parentElement.remove();
		}
	}

	// Show alert
	static showAlert(message, className){
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.getElementById('book-form');

		container.insertBefore(div, form);

		// Stay for 3 secs
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	// Clear fields
	static clearFields(){
		document.getElementById('bookName').value = '';
		document.getElementById('bookAuthor').value = '';
		document.getElementById('bookISBN').value = '';
	}
}

// Store class - Handles storage

class Store{
	static getBooks(){
		let books;
		if(localStorage.getItem('books') === null){
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		} return books;
	}

	static addBook(book){
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books',JSON.stringify(books));
	}

	static removeBook(isbn){
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if(book.isbn === isbn){
				books.splice(index, 1);
			}
		});

		// Saving to local storage
		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event - Display books

document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Event - Add book

document.getElementById('book-form').addEventListener('submit',(e) => {

	// Preventing actual 'submit' action to server side
	e.preventDefault();

	// Getting values from input
	const name = document.getElementById('bookName').value;
	const author = document.getElementById('bookAuthor').value;
	const isbn = document.getElementById('bookISBN').value;

	// Validation i.e to check if all fields filled
	if(name === '' || author === '' || isbn === ''){

		// Passing the (messsage, className)
		UI.showAlert('Please fill in all fields.','danger');
	} else {

		// Instantiate book
		const book = new Book(name, author, isbn);

		// Displaying on console
		console.log(book);

		// Adding book to UI
		UI.addBookToList(book);

		// Add book to storage
		Store.addBook(book);


		// Show success message 
		UI.showAlert('Book added.','success');

		// Clear input fields
		UI.clearFields();
	}
});

// Event - Remove a book

document.getElementById('book-list').addEventListener('click', (e) => {

	// Remove book from UI
	UI.deleteBook(e.target);

	// Remove book from storage
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	// Show success message 
	UI.showAlert('Book removed.','warning');
});