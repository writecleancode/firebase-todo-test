import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, addDoc, query, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAp_qalqyu2oTzlMN0u76mdfkcoqE_ukqw',
	authDomain: 'hr-todo-e256c.firebaseapp.com',
	projectId: 'hr-todo-e256c',
	storageBucket: 'hr-todo-e256c.appspot.com',
	messagingSenderId: '870004517112',
	appId: '1:870004517112:web:4f082a9bdb47f9989d330d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const template = `
  <div>
    <h1>Hello Firebase!</h1>
    <form id="form" class="form">
      <input type="text" id="title">
      <button type="submit">Submit</button>
    </form>
    <ul class="todos"></ul>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = template;
const todosContainer = document.querySelector('.todos')!;
const form = document.querySelector('.form');

form?.addEventListener('submit', async e => {
	e.preventDefault();
	const inputValue = document.querySelector<HTMLInputElement>('#title')!.value;
	if (inputValue) {
		await addDoc(collection(db, 'todos'), {
			title: inputValue,
			done: false,
		});
	}
});

const createTask = (id: any, task: any) => {
	const li = document.createElement('li');
	li.classList.add('todo-task');
	li.innerHTML = `<p id="${id}">${task.done ? '✅' : '⭐'} ${task.title}</p>`;

	return li;
};

const tasksQuerry = query(collection(db, 'todos'));
export const unsub = onSnapshot(tasksQuerry, tasksSnapshot => {
	todosContainer.innerHTML = '';

	tasksSnapshot.forEach(task => {
		todosContainer?.append(createTask(task.id, task.data()));
	});
});

todosContainer?.addEventListener('click', async (e: any) => {
	if (!e.target.id) return;
	const taskRef = doc(db, 'todos', e?.target.id);
	await updateDoc(taskRef, {
		done: true,
	});
});
