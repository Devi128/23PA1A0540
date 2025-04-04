const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const path = require('path');

const app = express();
const firebaseConfig = {
    apiKey: "AIzaSyDqbx8YnLGcew35Mp9dIV3UFumc0pr-StA",
    authDomain: "fullstack-66508.firebaseapp.com",
    projectId: "fullstack-66508",
    storageBucket: "fullstack-66508.firebasestorage.app",
    messagingSenderId: "1040202079246",
    appId: "1:1040202079246:web:53feee820718ba5c1b705f",
    measurementId: "G-42WFQ35XEJ"
  };
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.post('/login', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { email, password } = req.body;
    const auth = getAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    res.json({ success: true, user: result.user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});
app.post('/register', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { email, password } = req.body;
    const auth = getAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    res.json({ success: true, user: result.user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const tasksRef = collection(db, 'tasks');
    await addDoc(tasksRef, {
      title,
      description,
      createdAt: new Date()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasksRef = collection(db, 'tasks');
    const snapshot = await getDocs(tasksRef);
    const tasks = [];
    snapshot.docs.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    res.json(tasks);
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
