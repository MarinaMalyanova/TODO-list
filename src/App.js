import { useEffect, useState } from 'react';
import styles from './app.module.css';

function App() {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [value, setValue] = useState('');
	const [isSorting, setIsSorting] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [isSorted, setIsSorted] = useState(false);
	const [isSearch, setIsSearch] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3004/todoList')
			.then((rawResponse) => rawResponse.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setIsLoading(false));
	}, []);

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
				const newArray = todos.push(responce);
				console.log(newArray);
			})
			.finally(() => {
				setIsSearch(false);
				setIsCreating(false);
			});
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
				setTodos(
					todos.map((todo) => {
						if (todo.id === id) {
							todo.text = value;
						}
						return todo;
					}),
				);
			})
			.finally(() => {
				setIsSearch(false);
				setIsUpdating(false);
			});
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
				setTodos(todos.filter((todo) => todo.id !== id));
			})
			.finally(() => {
				setIsSearch(false);
				setIsDeleting(false);
			});
	};

	const sortTasks = () => {
		setIsSorting(true);
		fetch('http://localhost:3004/todoList?_sort=text')
			.then((rawResponce) => rawResponce.json())
			.then((sortArray) => {
				console.log('Задачи отсортированы. Ответ сервера:', sortArray);
				setIsSorted(true);
				setTodos(sortArray);
			})
			.finally(() => {
				setIsSorting(false);
				setIsSearch(false);
			});
	};
	const searchTask = () => {
		setIsSearching(true);
		fetch(`http://localhost:3004/todoList?q=${value}`)
			.then((rawResponce) => rawResponce.json())
			.then((responce) => {
				console.log('Задача найдена. Ответ сервера:', responce);
				responce.map((searchTodo) => {
					const searchTodoId = searchTodo.id;
					console.log(searchTodoId);
					const searchTodoIndex = todos.findIndex(
						(todo) => todo.id === searchTodoId,
					);
					console.log(searchTodoIndex);
					// if (searchTodoIndex >= 0) {
					todos.forEach((todo) => {
						if (searchTodoIndex >= 0) {
							console.log(todo.id === searchTodoId);
							console.log('isSearch', isSearch);
							setIsSearch(true);

							return todo.id === searchTodoId;
						}
					});
				});
			})
			.finally(() => setIsSearching(false));
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
				<button disabled={isSearching} onClick={searchTask}>
					Поиск задачи
				</button>
			</div>

			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todos.map(({ id, text }) => (
					<div className={styles.list} key={id}>
						<input type="checkbox" className={styles.checkbox}></input>
						<span className={isSearch ? styles.searchTask : styles.todo}>
							{text}
						</span>
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
