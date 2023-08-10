import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { ref, onValue, push, set, remove, orderByKey, get } from 'firebase/database';
import {
	query,
	orderBy,
	collection,
	QuerySnapshot,
	DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

function App() {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [value, setValue] = useState('');
	const [isSorting, setIsSorting] = useState(false);
	const [isSorted, setIsSorted] = useState(false);
	const [isSearch, setIsSearch] = useState(false);

	useEffect(() => {
		const todosDBRef = ref(db, 'todos');

		return onValue(todosDBRef, (snapshot) => {
			const loadedTodos = snapshot.val() || {};
			console.log(loadedTodos);
			const loadedTodosArr = Object.entries(loadedTodos).map(([id, { text }]) => {
				return {
					id: id,
					text: text,
				};
			});
			console.log(loadedTodosArr);
			isSorted ? setTodos(sortBy(loadedTodosArr)) : setTodos(loadedTodosArr);
			setIsLoading(false);
			setTodos(loadedTodos);
		});
	}, []);

	console.log('todos', todos);

	const onChange = ({ target }) => {
		setValue(target.value);
		setIsSearch(true);
		const todosArr = Object.entries(todos).map(([id, { text }]) => {
			return {
				id: id,
				text: text,
			};
		});
		const filter = todosArr.filter((todo) => todo.text.includes(target.value));
		setTodos(filter);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		setValue('');
		console.log({ value });
	};

	const requestAddTask = async () => {
		setIsCreating(true);

		const todosDBRef = ref(db, 'todos');
		push(todosDBRef, {
			text: value,
			complete: false,
		})
			.then((response) => {
				console.log('Задача добавлена. Ответ сервера:', response);
			})
			.finally(() => setIsCreating(false));
	};

	const requestUpdateTask = (event) => {
		const id = event.target.id;
		console.log(id);
		setIsUpdating(true);

		const updateTodosDBRef = ref(db, `todos/${id}`);
		set(updateTodosDBRef, {
			text: value,
			complete: false,
		})
			.then((responce) => {
				console.log('Задача обновлена. Ответ сервера:', responce);
				console.log(Object.entries(todos));
			})
			.finally(() => {
				setIsSearch(false);
				setIsUpdating(false);
			});
	};
	const requestDeleteTask = (event) => {
		const id = event.target.id;
		console.log(id);

		const removeTodosDBRef = ref(db, `todos/${id}`);
		console.log(removeTodosDBRef);
		setIsDeleting(true);
		remove(removeTodosDBRef)
			.then((responce) => {
				console.log('Задача удалена. Ответ сервера:', responce);
			})
			.finally(() => {
				setIsSearch(false);
				setIsDeleting(false);
			});
	};

	const sortBy = (data) => {
		data.sort((a, b) => (a.text > b.text ? 1 : -1));
		return data;
	};
	const sortTasks = () => {
		setIsSorted(true);
		const todosArr = Object.entries(todos).map(([id, { text }]) => {
			return {
				id: id,
				text: text,
			};
		});
		setTodos(sortBy(todosArr));
	};

	return (
		<div className={styles.app}>
			<form onSubmit={onSubmit} className={styles.todoForm}>
				<input
					type="text"
					name="text"
					value={value}
					className={styles.todoInput}
					placeholder="Введите задачу"
					onChange={onChange}
				></input>
				<button disabled={isCreating} onClick={requestAddTask}>
					Добавить задачу
				</button>
			</form>
			<div className={styles.buttons}>
				<button disabled={isSorting} onClick={sortTasks}>
					Сортировать задачи по алфавиту
				</button>
			</div>

			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				Object.entries(todos).map(([id, { text }]) => (
					<div className={styles.list} key={id} id={id}>
						<input type="checkbox" className={styles.checkbox}></input>
						<span className={styles.todo}>{text}</span>
						<button id={id} disabled={isUpdating} onClick={requestUpdateTask}>
							Изменить
						</button>
						<button id={id} disabled={isDeleting} onClick={requestDeleteTask}>
							Удалить
						</button>
					</div>
				))
			)}
		</div>
	);
}

export default App;
