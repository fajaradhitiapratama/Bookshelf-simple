(() => {
    let bookList = [];
    
    function handleBookSubmit(event) {
      event.preventDefault();
      const titleInput = document.querySelector("#inputBookTitle"),
            authorInput = document.querySelector("#inputBookAuthor"),
            yearInput = document.querySelector("#inputBookYear"),
            isCompleteInput = document.querySelector("#inputBookIsComplete"),
            newBook = {
              id: +new Date(),
              title: titleInput.value,
              author: authorInput.value,
              year: yearInput.value,
              isComplete: isCompleteInput.checked,
            };
      console.log(newBook);
      bookList.push(newBook);
      document.dispatchEvent(new Event("bookListUpdated"));
    }
    
    function handleBookSearch(event) {
      event.preventDefault();
      const searchInput = document.querySelector("#searchBookTitle");
      const query = searchInput.value;
      query
        ? renderBooks(bookList.filter(book => book.title.toLowerCase().includes(query.toLowerCase())))
        : renderBooks(bookList);
    }
    
    function markAsComplete(event) {
      const bookId = Number(event.target.id);
      const bookIndex = bookList.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        bookList[bookIndex] = {
          ...bookList[bookIndex],
          isComplete: true,
        };
        document.dispatchEvent(new Event("bookListUpdated"));
      }
    }
    
    function markAsIncomplete(event) {
      const bookId = Number(event.target.id);
      const bookIndex = bookList.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        bookList[bookIndex] = {
          ...bookList[bookIndex],
          isComplete: false,
        };
        document.dispatchEvent(new Event("bookListUpdated"));
      }
    }
    
    function removeBook(event) {
      const bookId = Number(event.target.id);
      const bookIndex = bookList.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        bookList.splice(bookIndex, 1);
        document.dispatchEvent(new Event("bookListUpdated"));
      }
    }
    
    function renderBooks(books) {
      const incompleteBookshelf = document.querySelector("#incompleteBookshelfList"),
            completeBookshelf = document.querySelector("#completeBookshelfList");
      incompleteBookshelf.innerHTML = "";
      completeBookshelf.innerHTML = "";
      
      for (const book of books) {
        const bookElement = document.createElement("article");
        bookElement.classList.add("book_item");
        
        const titleElement = document.createElement("h2");
        titleElement.innerText = book.title;
        const authorElement = document.createElement("p");
        authorElement.innerText = "Author: " + book.author;
        const yearElement = document.createElement("p");
        yearElement.innerText = "Year: " + book.year;
        
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(yearElement);
        
        if (book.isComplete) {
          const actionContainer = document.createElement("div");
          actionContainer.classList.add("action");
          
          const incompleteButton = document.createElement("button");
          incompleteButton.id = book.id;
          incompleteButton.innerText = "Not finished reading yet";
          incompleteButton.classList.add("green");
          incompleteButton.addEventListener("click", markAsIncomplete);
          
          const deleteButton = document.createElement("button");
          deleteButton.id = book.id;
          deleteButton.innerText = "Delete book";
          deleteButton.classList.add("red");
          deleteButton.addEventListener("click", removeBook);
          
          actionContainer.appendChild(incompleteButton);
          actionContainer.appendChild(deleteButton);
          bookElement.appendChild(actionContainer);
          completeBookshelf.appendChild(bookElement);
        } else {
          const actionContainer = document.createElement("div");
          actionContainer.classList.add("action");
          
          const completeButton = document.createElement("button");
          completeButton.id = book.id;
          completeButton.innerText = "Done reading";
          completeButton.classList.add("green");
          completeButton.addEventListener("click", markAsComplete);
          
          const deleteButton = document.createElement("button");
          deleteButton.id = book.id;
          deleteButton.innerText = "Delete book";
          deleteButton.classList.add("red");
          deleteButton.addEventListener("click", removeBook);
          
          actionContainer.appendChild(completeButton);
          actionContainer.appendChild(deleteButton);
          bookElement.appendChild(actionContainer);
          incompleteBookshelf.appendChild(bookElement);
        }
      }
    }
    
    function saveBooks() {
      localStorage.setItem("bookList", JSON.stringify(bookList));
      renderBooks(bookList);
    }
    
    window.addEventListener("load", () => {
      bookList = JSON.parse(localStorage.getItem("bookList")) || [];
      renderBooks(bookList);
      
      const bookForm = document.querySelector("#inputBook"),
            searchForm = document.querySelector("#searchBook");
      bookForm.addEventListener("submit", handleBookSubmit);
      searchForm.addEventListener("submit", handleBookSearch);
      document.addEventListener("bookListUpdated", saveBooks);
    });
  })();
  