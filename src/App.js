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
		const filter = todos.filter((todo) => todo.text.includes(target.value));
		setTodos(filter);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		setValue('');
		console.log({ value });
	};

	const requestAddTask = async () => {
		let newTask = {};

		setIsCreating(true);
		const response = await fetch('http://localhost:3004/todoList', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({
				text: value,
				complete: false,
			}),
		});
		const json = await response.json();
		console.log('Задача добавлена. Ответ сервера:', json);
		newTask = { text: json.text, id: json.id };
		console.log(newTask);

		fetch('http://localhost:3004/todoList')
			.then((rawResponce) => rawResponce.json())
			.then((data) => {
				setTodos(data);
				console.log('data', data);
			})
			.finally(() => {
				setIsSearch(false);
				setIsCreating(false);
			});
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
				todos.map(({ id, text }) => (
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
