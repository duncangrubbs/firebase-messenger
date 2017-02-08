// Initialize Firebase
const config = {
  apiKey: 'AIzaSyACfmkuXODDLwrZpGaSL6AZtFKGnPWj3Hc',
  authDomain: 'duncan-test0.firebaseapp.com',
  databaseURL: 'https://duncan-test0.firebaseio.com',
  storageBucket: 'duncan-test0.appspot.com',
  messagingSenderId: '243968147627',
};

const app = firebase.initializeApp(config);

const $app = document.getElementById('app');
const $wrapper = document.getElementById('wrapper');

const $logIn = document.getElementById('logIn');
const $logOut = document.getElementById('logOut');

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

let user;

// BEGIN COMMENTED OUT STUFF

$logIn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;

    console.log(user.name);

    $wrapper.style.display = 'none';
    $app.style.display = 'block';
  }).catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential;

    console.log('ERRORS:');
    console.log(errorCode);
    console.log(errorMessage);
    console.log(email);
    console.log(credential);
  });
});

$logOut.addEventListener('click', () => {
  firebase.auth().signOut();
  $wrapper.style.display = 'flex';
  $app.style.display = 'none';
});

firebase.auth().onAuthStateChanged(fireBaseUser => {
  if (fireBaseUser) {
    user = fireBaseUser.email;
    $wrapper.style.display = 'none';
    $app.style.display = 'flex';
  } else {
    console.info('Not Logged In');
  }
});

// END COMMENTED OUT SECTION

const $send = document.getElementById('send');
const $message = document.getElementById('message');
const $messages = document.getElementById('messages');

function addMessage(chat) {
  const div = document.createElement('div');
  div.innerHTML = `<div class="name">${chat.name}</div><div class="lower">
                    <div class="text">${chat.message}</div></div>`;

  div.setAttribute('class', 'textMessage');
  $messages.appendChild(div);
  $message.value = '';
  $messages.scrollTop = $messages.scrollHeight;
}

const database = app.database();

const databaseRef = database.ref().child('chat');

$send.addEventListener('click', () => {
  const chat = { name: user, message: $message.value };

  databaseRef.push().set(chat);
});

databaseRef.on('child_added', snapshot => {
  const chat = snapshot.val();
  addMessage(chat);
});

$message.addEventListener('keyup', evt => {
  if (evt.keyCode === 13)
    $send.click();
});
