var rsa = require("node-rsa");
var cryptico = require("cryptico");

let rsaKey;
let rsaPublicKey;

export const cryptoObj = async (request, response) => {
   let bits = 512; 
   let passPhrase = request.passPhrase;
   rsaKey = cryptico.generateRSAKey(passPhrase,bits);
   rsaPublicKey = cryptico.publicKeyString(rsaKey);

}

export const encrypt = async (request, response) => {
  
    var result = cryptico.encrypt(request.message, request.key);
    return result.cipher;
}

export const publicKey = async (request, response) => {
   return rsaPublicKey;
}

export const privateKey = async (request, response) => {
    return rsaKey;
  }

  export const decrypt = async (request, response) => {
      cryptoObj(request.passPhrase);
      var result = cryptico.decrypt(request.message, rsaKey);
      return result.plaintext;
    }





// export const generatePair = (function () 
// {
//     var key = "null";
//     var publicKey, privateKey;

//     return function () 
//     {
//         if (key === "null") {
//           key = new rsa().generateKeyPair();
//           publicKey = key.exportKey("public");
//           privateKey = key.exportKey("private");

//         }
//         return { public: publicKey, private: privateKey};
//     }
// })();

// export const encryptMessage = async (request, response) => {

//   var receiverPublicKey = request.publicKey;

//   var publicKey = new rsa();

//   publicKey = publicKey.importKey(receiverPublicKey);

//   var encrypted = publicKey.encrypt(request.message);
//   request.message = "";

//   // console.log("Encrypted ", encrypted);
//   // console.log("Message ", message);
//   return encrypted;
// }

export const decryptMessage = async (request, response) => {

  let db, privateK;
  let requestNew = window.indexedDB.open('visper_db', 1);

  // onerror handler signifies that the database didn't open successfully
  requestNew.onerror = function() {
    response.status(500).json("Cannot fetch encryption keys, Database failed to open");
    return;
  };

  // onsuccess handler signifies that the database opened successfully
  requestNew.onsuccess = function() {
    console.log('Database opened successfully');

    // Store the opened database object in the db variable. This is used a lot below
    db = requestNew.result;

    let objectStore = db.transaction('visper_db').objectStore('visper_db');
    objectStore.openCursor().onsuccess = function(e) {
      // Get a reference to the cursor
      let cursor = e.target.result;
  
      // If there is still another data item to iterate through, keep running this code
      if(cursor) {
        privateK = cursor.value.private;
      }else{
        console.log("Unknown Error occured");
      }
    };

    let privateKey = new rsa();
    privateKey = privateKey.importKey(privateK);

    let message = privateKey.decrypt(request.message);

    return message;
  };
}

// var incre = (function () 
// {
//     var j = 1;

//     return function () 
//     {
//         return j++;
//     }
// })();

// incre(); // returns 1
// incre(); // returns 2