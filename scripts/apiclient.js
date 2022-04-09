// Step 1: get an API keyYou can contact support at support@foleon.com for an API key. You will receive an api_key and an api_secret.

// Step 2: request an access token

// curl -X POST https://api.foleon.com/oauth -F 'grant_type=client_credentials' -F 'client_id={api_key}' -F 'client_secret={api_secret}'

// Step 3: request a resource
// The access_token in the response from step 2 can now be used to request a resource that requires authorization:curl -X GET https://api.foleon.com/account
//      -H 'Authorization: Bearer {access_token}'

let qs = require('qs');

const accessToken = '5d80218ef4f449552ba0f72dc1b8777218ec57ec';

// Get all publications based on page and limit
let page = 1;
let limit = 10;

const getPublications = async (page, limit) => {
  let allDocsfilter = qs.stringify({
    page: page,
    limit: limit,
    'order-by': [
      {
        field: 'name',
        type: 'field',
        direction: 'ASC',
      },
    ],
  });

  let res = await fetch(
    `https://api.foleon.com/v2/magazine/edition?${allDocsfilter}`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        Accept: 'application/vnd.becky.v2+json',
      },
    }
  );
  let data = await res.json();
  let publications = await data._embedded.edition;

  document.getElementById('page').innerHTML = page;
  document.getElementById('pageCount').innerHTML = data.page_count;

  return publications;
};

//  Filter the publications on field, type, and value
const getFiltered = async (field, type, value) => {
  let filter = qs.stringify({
    page: page,
    limit: limit,
    query: [
      {
        field: field,
        type: type,
        value: value,
      },
    ],
    'order-by': [
      {
        field: 'name',
        type: 'field',
        direction: 'ASC',
      },
    ],
  });

  let res = await fetch(
    `https://api.foleon.com/v2/magazine/edition?${filter}`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        Accept: 'application/vnd.becky.v2+json',
      },
    }
  );
  let data = await res.json();
  let publications = await data._embedded.edition;

  document.getElementById('page').innerHTML = page;
  document.getElementById('pageCount').innerHTML = data.page_count;

  return publications;
};

// APPLICATION SCRIPTS
// DOM Elements
const pubList = document.getElementById('publications');
const search = document.getElementById('search');
const filterEl = document.getElementById('filter');
const pageCount = document.getElementById('pageCount');
const pageDown = document.getElementById('pageDown');
const pageUp = document.getElementById('pageUp');

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
    page = 1;
    allPubsToDOM(getFiltered('category', 'eq', selection));
  }
};

// EVENT LISTENERS:
// Category Field
filterEl.addEventListener('change', () => {
  filterCategory(filterEl.value);
  return;
});

search.addEventListener('keyup', () => {
  if (search.value === '') {
    allPubsToDOM(getPublications(page, limit));
  } else {
    if (page > 1) {
      page = 1;
    } else {
      page == 1 ? searchOnName() : (page = 1);
      return;
    }
  }
  return;
});

// Buttons to go through the pages
pageUp.addEventListener('click', () => {
  if (page < pageCount.innerHTML) {
    if (search.value) {
      page++;
      searchOnName();
      return;
    } else if (filterEl.value) {
      page++;
      allPubsToDOM(getFiltered('category', 'eq', filterEl.value));
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
    if (search.value) {
      page--;
      searchOnName();
      return;
    } else if (filterEl.value) {
      page--;
      allPubsToDOM(getFiltered('category', 'eq', filterEl.value));
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
