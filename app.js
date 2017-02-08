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

const $email = document.getElementById('email');
const $password = document.getElementById('password');
const $logIn = document.getElementById('logIn');
const $signUp = document.getElementById('signUp');
const $logOut = document.getElementById('logOut');

let user;

$logIn.addEventListener('click', () => {
  const email = $email.value;
  const password = $password.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email,
                                                  password);
  promise.catch(evt => console.warn(evt.message));

  $wrapper.style.display = 'none';
  $app.style.display = 'block';
});

$signUp.addEventListener('click', () => {
  const email = $email.value;
  const password = $password.value;
  const auth = firebase.auth();
  // TODO check for real email
  const promise = auth.createUserWithEmailAndPassword(email,
                                                      password);
  promise
    .catch(e => console.warn(e.message));

  $wrapper.style.display = 'none';
  $app.style.display = 'flex';
});

$logOut.addEventListener('click', () => {
  firebase.auth().signOut();
  $email.value = '';
  $password.value = '';
  $wrapper.style.display = 'flex';
  $app.style.display = 'none';
});

$password.addEventListener('keyup', evt => {
  if (evt.keyCode === 13)
    $logIn.click();
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
