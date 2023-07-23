import { useEffect, useState } from 'react';
import styles from './app.module.css';

function App() {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [value, setValue] = useState('');
	const [updateTodoListFlag, setUpdateTodoListFlag] = useState(false);
	const [isSorting, setIsSorting] = useState(false);
	const [isSorted, setIsSorted] = useState(false);

	const updateTodoList = () => setUpdateTodoListFlag(!updateTodoListFlag);

	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3004/todoList')
			.then((rawResponse) => rawResponse.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
				if (isSorted === true) {
					setTodos(sortTasks);
					console.log(todos);
				}
			})
			.finally(() => setIsLoading(false));
	}, [updateTodoListFlag]);

	const onChange = ({ target }) => {
		setValue(target.value);
		// console.log(target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		setValue('');
		console.log({ value });
	};

	const requestAddTask = () => {
		setIsCreating(true);
		fetch('http://localhost:3004/todoList', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({
				text: value,
				complete: false,
			}),
		})
			.then((rawResponce) => rawResponce.json())
			.then((responce) => {
				console.log('Задача добавлена. Ответ сервера:', responce);
				updateTodoList();
			})
			.finally(() => setIsCreating(false));
		console.log(todos);
	};

	const requestUpdateTask = (event) => {
		const id = event.target.id;
		console.log(id);
		setIsUpdating(true);
		fetch(`http://localhost:3004/todoList/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({
				text: value,
				complete: false,
			}),
		})
			.then((rawResponce) => rawResponce.json())
			.then((responce) => {
				console.log('Задача обновлена. Ответ сервера:', responce);
				updateTodoList();
			})
			.finally(() => setIsUpdating(false));
	};
	const requestDeleteTask = (event) => {
		const id = event.target.id;
		console.log(id);
		setIsDeleting(true);
		fetch(`http://localhost:3004/todoList/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponce) => rawResponce.json())
			.then((responce) => {
				console.log('Задача удалена. Ответ сервера:', responce);
				updateTodoList();
			})
			.finally(() => setIsDeleting(false));
	};

	const sortTasks = () => {
		setIsSorting(true);
		fetch('http://localhost:3004/todoList?_sort=text')
			.then((rawResponce) => rawResponce.json())
			.then((sortArray) => {
				console.log('Задачи отсортированы. Ответ сервера:', sortArray);
				setIsSorted(true);
				// updateTodoList();
				setTodos(sortArray);
			})
			.finally(() => {
				setIsSorting(false);
				// setIsSorted(false);
			});
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
			<button disabled={isSorting} onClick={sortTasks}>
				Сортировать задачи по алфавиту
			</button>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todos.map(({ id, text }) => (
					<div className={styles.list} key={id}>
						<input type="checkbox" className={styles.checkbox}></input>
						{/* <span className={styles.id}>{id}</span>{' '} */}
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
