// Step 1: get an API keyYou can contact support at support@foleon.com for an API key. You will receive an api_key and an api_secret.

// Step 2: request an access tokencurl -X POST https://api.foleon.com/oauth
//      -F 'grant_type=client_credentials'
//      -F 'client_id={api_key}'
//      -F 'client_secret={api_secret}'

// Step 3: request a resource
// The access_token in the response from step 2 can now be used to request a resource that requires authorization:curl -X GET https://api.foleon.com/account
//      -H 'Authorization: Bearer {access_token}'

const accessToken = '0fd91df6b778d816d691614c0d49c7592857914b';

// Get all publications based on page and limit
const getPublications = async (page, limit) => {
  let res = await fetch(
    `https://api.foleon.com/v2/magazine/edition?page=${page}&limit=${limit}`,
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
  let res = await fetch(
    `https://api.foleon.com/v2/magazine/edition?filter[0][field]=${field}&filter[0][type]=${type}&filter[0][value]=${value}`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        Accept: 'application/vnd.becky.v2+json',
      },
    }
  );
  let data = await res.json();
  let publications = await data._embedded.edition;

  document.getElementById('page').innerHTML = 1;
  document.getElementById('pageCount').innerHTML = data.page_count;

  return publications;
};
