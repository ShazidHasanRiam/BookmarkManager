const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal Event Listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Validate Form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please provide both name & web address.");
    return false;
  }

  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  // Valid
  return true;
}

// Building Bookmarks DOM
function buildBookmarks() {
  // Removing all bookmarks
  bookmarksContainer.textContent = " ";
  // Building Items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // console.log(name, url);

    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    //Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    //Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch bookmarks from local storage
function fetchBookmarks() {
  // Get bookmarks from local storage if any
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks array in local storage
    bookmarks = [
      // {
      //   name: "",
      //   url: "",
      // },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
  // console.log("delete URL", url);
  bookmarks.forEach((bookmark, i) => {
    if (bookmarks.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in local storage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}
// Manage Data from form input
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://", "https://")) {
    urlValue = `https://${urlValue}`;
  }
  // console.log(nameValue, urlValue);
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  // console.log(JSON.stringify(bookmarks));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On Load Fetching Bookmarks
fetchBookmarks();
