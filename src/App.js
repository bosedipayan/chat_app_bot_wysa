import { useRef, useState } from 'react';
import './App.css';
import './index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ColorItems from './ColorItems';

firebase.initializeApp({
  apiKey: "AIzaSyBBTfhrEK6sTbprYZatk36Gd8Kjeq5NANY",
  authDomain: "react-chat-app-f78a3.firebaseapp.com",
  projectId: "react-chat-app-f78a3",
  storageBucket: "react-chat-app-f78a3.appspot.com",
  messagingSenderId: "570949990178",
  appId: "1:570949990178:web:d4ee78e38a73b820e6177b",
  measurementId: "G-NXXLFN4DQT"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const[user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>React Chat App</h1>

        
        <SignOut />
      </header>

      <section className='ds-color'>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign In</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });

  const dummy = useRef();
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const colors = ['#2d3436','#e84a3f','#be2edd','#f9ca24','#6ab04c','#30336b'];

  const setTheme = (color) => {
    document.documentElement.style.setProperty('--bg-color', color)
  }

  const setColor = (e) => {

    const currentColor = e.target.style.getPropertyValue('--bg-color');
    setTheme(currentColor);

    console.log(currentColor);
  }
  return (<>


    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

      <div className='color-switcher'>
          <h1 className='heading'>Select color</h1>

          <div className='color-list'>
            {colors.map((color,idx) => <ColorItems setColor={setColor} color={color} />  )}
          </div>
      </div>
    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" />

      <button type="submit" disabled={!formValue}>send</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'Sent' : 'Received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='' />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
