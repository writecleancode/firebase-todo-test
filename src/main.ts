import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, addDoc, query, onSnapshot, DocumentData, getDoc } from 'firebase/firestore';
import './style.css';

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
const todosQuery = query(collection(db, 'todos'));

const template = `
  <div>
    <h1>Hello Firebase!</h1>
    <form id="form" class="form">
      <input type="text" id="title">
      <button type="submit">Submit</button>
    </form>
    <ul class="todos-list"></ul>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = template;
const todosContainer = document.querySelector<HTMLUListElement>('.todos-list')!;
const form = document.querySelector<HTMLFormElement>('.form')!;

const createTodo = (id: string, todo: DocumentData) => {
	const li = document.createElement('li');
	li.classList.add('todo-task');
	li.innerHTML = `<p id="${id}">${todo.done ? '✅' : '⭐'} ${todo.title}</p>`;

	return li;
};

const unsub = onSnapshot(todosQuery, todosSnapshot => {
	todosContainer.innerHTML = ``;

	todosSnapshot.forEach(todo => {
		todosContainer.append(createTodo(todo.id, todo.data()));
	});
});

todosContainer.addEventListener('click', async (e: MouseEvent) => {
	if (!(<HTMLElement>e.target).id) return;

	const todoRef = doc(db, 'todos', (<HTMLElement>e.target).id);
	const todo: any = await getDoc(todoRef);
	try {
		await updateDoc(todoRef, {
			// done: true,
			done: !todo.data().done,
		});
	} catch (error) {
		console.log(error);
	}
});

form.addEventListener('submit', async (e: SubmitEvent) => {
	e.preventDefault();
	const inputValue = form.querySelector<HTMLInputElement>('#title')!.value;

	if (!inputValue) return;
	try {
		await addDoc(collection(db, 'todos'), {
			title: inputValue,
			done: false,
		});
	} catch (error) {
		console.log(error);
	}
});
