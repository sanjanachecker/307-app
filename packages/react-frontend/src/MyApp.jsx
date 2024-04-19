// src/MyApp.jsx
import React, {useState, useEffect} from "react";
import Table from "./Table"
import Form from "./Form"

function MyApp() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    fetchUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => { console.log(error); });
  }, [] );
  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    if (userToDelete) {
        fetch(`http://localhost:8000/users/${userToDelete.id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.status === 204) {
                const updatedCharacters = characters.filter((character, i) => i !== index);
                setCharacters(updatedCharacters);
            } else if (response.status === 404) {
                console.error('User not found, could not delete');            } else {
                throw new Error('Failed to delete the user');
            }
        })
        .catch(error => {
            console.error('Error deleting the user', error);
        });
    }
  }
  function updateList(person) {
    postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error('Failed, user not added.');
      }
    })
    .then((addedUser) => {
      setCharacters([...characters, addedUser]);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  function postUser(person){
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }
  return (
    <div className = "container">
        <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter} 
        />
        <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;