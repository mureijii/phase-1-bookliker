document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
    const currentUser = { id: 1, username: "pouros" }; // Simulated logged-in user
  
    // Fetch books and display titles
    function fetchBooks() {
      fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => {
          bookList.innerHTML = "";
          books.forEach(displayBookTitle);
        });
    }
  
    // Display book titles in the list
    function displayBookTitle(book) {
      const li = document.createElement("li");
      li.textContent = book.title;
      li.addEventListener("click", () => displayBookDetails(book));
      bookList.appendChild(li);
    }
  
    // Show book details when clicked
    function displayBookDetails(book) {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnailUrl}" alt="${book.title}">
        <p>${book.description}</p>
        <ul id="users-list">
          ${book.users.map(user => `<li>${user.username}</li>`).join("")}
        </ul>
        <button id="like-button">${isUserInList(book.users) ? "Unlike" : "Like"}</button>
      `;
  
      document.querySelector("#like-button").addEventListener("click", () => toggleLike(book));
    }
  
    // Check if user has liked the book
    function isUserInList(users) {
      return users.some(user => user.id === currentUser.id);
    }
  
    // Handle liking/unliking a book
    function toggleLike(book) {
      let updatedUsers;
      if (isUserInList(book.users)) {
        updatedUsers = book.users.filter(user => user.id !== currentUser.id);
      } else {
        updatedUsers = [...book.users, currentUser];
      }
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: updatedUsers }),
      })
        .then(response => response.json())
        .then(updatedBook => displayBookDetails(updatedBook));
    }
  
    // Load books on page load
    fetchBooks();
  });
  
