import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { generatePair, cryptoObj, privateKey } from './service/encryption-handler';
import { getGoogleId } from './components/account/LoginDialog';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

let db, key, overwriteKeys;
cryptoObj({ passPhrase: getGoogleId() });
    let privateK = privateKey();


overwriteKeys = false;

window.onload = function() {
  db_init();
};

function db_init() {
  var request = indexedDB.open("visper_db");
  var dbShouldInit = false;
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    dbShouldInit = true;
    
    

    //store 1
    db.createObjectStore("visper_db", {
      keypath: "id",
      autoIncrement: true
    });

  }
  request.onsuccess = function(e) {
    e.target.result.close();
    if(dbShouldInit)//executes only if DB init happened
      db_populate(); //close the db first and then call init
  }

}

function db_populate() {
  init_store1();
}

function init_store1() {
  var request = indexedDB.open("visper_db");
  request.onsuccess = function(e) {
    var db = e.target.result;
    var tx = db.transaction("visper_db", "readwrite");
    var store = tx.objectStore("visper_db");

    let newItem = privateK;
    store.add(newItem);

    tx.oncomplete = function(e) {
      overwriteKeys=true;
      console.log('Database setup complete');
    };
  }
}

// window.onload = function() {
//   let request = window.indexedDB.open('visper_db', 1);

//   // onerror handler signifies that the database didn't open successfully
//   request.onerror = function() {
//     console.log('Database failed to open');
//   };

//   // onsuccess handler signifies that the database opened successfully
//   request.onsuccess = function() {
//     console.log('Database opened successfully');

//     // Store the opened database object in the db variable. This is used a lot below
//     db = request.result;

//   };

//   // Setup the database tables if this has not already been done
//   request.onupgradeneeded = function(e) {
//     // Grab a reference to the opened database
//     let db = e.target.result;

//     // generating keys

//     key = generatePair();

//     // Create an objectStore to store our notes in (basically like a single table)
//     // including a auto-incrementing key
//     let objectStore = db.createObjectStore('visper_db', { keyPath: 'id', autoIncrement:true });

//     // Define what data items the objectStore will contain
//     objectStore.createIndex('private', 'private', { unique: false });
//     var transaction = e.target.transaction;

//     let newItem = { private: key.private };

//     transaction.oncomplete =
//             function(event) { 
//               db.close();   
//               let requestNew = window.indexedDB.open('visper_db', 1);
//               requestNew.onsuccess = function() {
//                 db = requestNew.result;
//                 let txn = db.transaction(['visper_db'], 'readwrite');

//                 objectStore.add(newItem);
//                 console.log('Initial Data added');
//               };
              
//             }
//     console.log('Database setup complete');
//     overwriteKeys=true;
//   };
// };

export const isOverwriteKeys = async (request, response) => {

  return overwriteKeys;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




