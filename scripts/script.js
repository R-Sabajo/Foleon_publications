// DOM Elements
const pubList = document.getElementById('publications');
const search = document.getElementById('search');
const filterEl = document.getElementById('filter');
const currentPage = document.getElementById('page');
const pageCount = document.getElementById('pageCount');
const pageDown = document.getElementById('pageDown');
const pageUp = document.getElementById('pageUp');

let page = 1;
let limit = 10;

// Function to add publications to the dom as li
const allPubsToDOM = async anyPub => {
  const data = await anyPub;
  pubList.innerHTML = '';
  data.forEach(pub => {
    const date = new Date(pub.created_on).toString().slice(0, 21);
    const category = pub.category;
    const newLi = document.createElement('li');
    newLi.className = 'pubLi';
    newLi.innerHTML = `<p>${pub.name}</p>
    <span class="pubInfo">ID: ${pub.id} <br/> category: ${category} <br/> created on: ${date}</span>`;

    pubList.appendChild(newLi);
    return;
  });
};

// Run function to get All publications based on page and limit to the DOM
allPubsToDOM(getPublications(page, limit));

// FUNCTIONS:
// Function to search on name
const searchOnName = () => {
  filterEl.value = '';
  const term = `%${search.value.toLowerCase()}%`;
  allPubsToDOM(getFiltered('name', 'like', term));
};

// Function to filter on category selection
const filterCategory = selection => {
  search.value = '';
  if (selection === '') {
    allPubsToDOM(getPublications(page, limit));
  } else {
    allPubsToDOM(getFiltered('category', 'eq', selection));
  }
};

// EVENT LISTENERS:
// Category Field
filterEl.addEventListener('change', () => {
  filterCategory(filterEl.value);
});

search.addEventListener('keyup', () => {
  if (search.value === '') {
    allPubsToDOM(getPublications(page, limit));
  } else {
    searchOnName();
  }
  return;
});

// Buttons to go through the pages
// (Only works when all publications are displayed. Does not work when filtering on category or search name, couldn't figure out the correct querystring for the getFiltered API call without using qs.stringify())
pageUp.addEventListener('click', () => {
  if (page < pageCount.innerHTML) {
    if (search.value || filterEl.value) {
      console.log(search.value, filterEl.value);
      return;
    } else {
      page++;
      allPubsToDOM(getPublications(page, limit));
      return;
    }
  } else {
    return;
  }
});

pageDown.addEventListener('click', () => {
  if (page > 1) {
    if (search.value || filterEl.value) {
      console.log(search.value, filterEl.value);
      return;
    } else {
      page--;
      allPubsToDOM(getPublications(page, limit));
      return;
    }
  } else {
    return;
  }
});
