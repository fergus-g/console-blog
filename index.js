const createBlogEntry = document.getElementById("create");
const line = document.getElementById("First");
let title = "";
let body = "";
createBlogEntry.addEventListener("click", createBlogHandler);

function createBlogHandler() {
  title = prompt("Add a title");

  line.textContent(title);
}
