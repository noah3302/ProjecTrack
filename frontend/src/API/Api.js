/*
 * This file contains the REST methods get, post, delete, put and patch in an
 * encapsuled format for easier use throughout the project. The prefix "api"
 * was added because "delete" is a reserved word in JavaScript and for
 * consistent naming conventions it was added to every function name.
 */

// GET
//  The get-function returns a promise which has to be resolved in another
//  promise while in usage to be able to set a state. Because of the nature of
//  promises we can't store a returned value from a promise object inside a
//  variable but await the response inside another promise since it can't get
//  resolved outside of a promise(-chain).
//  Example:
//   async function get_users() {
//     setState(await get('/users'))
//   }

// Dev baseURL
const baseURL = '/projectrack/'

export function apiget(endpoint) {
  // the endpoint marks the exact location of the resource under the namespace
  // of the api
  return fetch(`${baseURL}${endpoint}`)
    .then((response) => { 
        console.log(response);
      try {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Server Error");
        }
      } catch (error) {
        console.log(error);
      }
    });
}

// DELETE
/* export function apidelete(endpoint, id) {
  return fetch(`${baseURL}${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(data)
  });
} */

export function apidelete(endpoint, id) {
  return fetch(`${baseURL}${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(data)
  });
}

// POST
export function apipost(endpoint, data) {
  return fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    // the parameter "data" must be an Object (key-value-pairs) for this 
    // function to work  
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("A server error happend!");
      }
    })
    .catch((error) => console.log(`a ${error} happend!`));
}

// PUT
// id parameter points to the exact location of the ressource
export function apiput(endpoint, id, data) {
  return fetch(`${baseURL}${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    // the parameter "data" must be an Object (key-value-pairs) for this
    // function to work
    body: JSON.stringify(data),
  });
}

// TODO: functionality of the patch request (if required)
// PATCH
export function apipatch(endpoint, data) {
  return fetch(`${baseURL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    // the parameter "data" must be an Object (key-value-pairs) for this 
    // function to work  
    body: JSON.stringify(data)
  })
}