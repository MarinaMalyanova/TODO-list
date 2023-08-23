import { Todo, ControlPanel } from './components';
import { createTodo, readTodos, updateTodo, deleteTodo } from './api';
import { addTodoInTodos, findTodo, setTodoInTodos, removeTodoInTodos } from './utils';
import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { NEW_TODO_ID } from './constants';

function App() {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isAlphabetSorting, setIsAlphabetSorting] = useState(false);

	const onTodoAdd = () => {
		setTodos(addTodoInTodos(todos));
	};

	const onTodoSave = (todoId) => {
		const { title } = findTodo(todos, todoId) || {};

		if (todoId === NEW_TODO_ID) {
			createTodo({ title, completed: false }).then((todo) => {
				let updatedTodos = setTodoInTodos(todos, {
					id: NEW_TODO_ID,
					isEditing: false,
				});
				updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
				updatedTodos = addTodoInTodos(updatedTodos, todo);
				setTodos(updatedTodos);
			});
		} else {
			updateTodo({ id: todoId, title }).then(() => {
				setTodos(setTodoInTodos(todos, { id: todoId, isEditing: false }));
			});
		}
	};

	const onTodoEdit = (id) => {
		setTodos(setTodoInTodos(todos, { id, isEditing: true }));
	};

	const onTodoTitleChange = (id, newTitle) => {
		setTodos(setTodoInTodos(todos, { id, title: newTitle }));
	};

	const onTodoComplitedChange = (id, newComplited) => {
		updateTodo({ id, completed: newComplited }).then(() => {
			setTodos(setTodoInTodos(todos, { id, completed: newComplited }));
		});
	};

	const onTodoRemove = (id) => {
		deleteTodo(id).then(() => {
			setTodos(removeTodoInTodos(todos, id));
		});
	};

	useEffect(() => {
		readTodos(searchPhrase, isAlphabetSorting)
			.then((loadedData) => setTodos(loadedData.reverse()))
			.finally(() => setIsLoading(false));
	}, [searchPhrase, isAlphabetSorting]);

	return (
		<div className={styles.app}>
			<ControlPanel
				onTodoAdd={onTodoAdd}
				onSearch={setSearchPhrase}
				onSorting={setIsAlphabetSorting}
			/>

			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todos.map(({ id, title, completed, isEditing = false }) => (
					<Todo
						key={id}
						id={id}
						title={title}
						completed={completed}
						isEditing={isEditing}
						onEdit={() => onTodoEdit(id)}
						onTitleChange={(newTitle) => onTodoTitleChange(id, newTitle)}
						onCompletedChange={(newComplited) =>
							onTodoComplitedChange(id, newComplited)
						}
						onSave={() => onTodoSave(id)}
						onRemove={() => onTodoRemove(id)}
					/>
				))
			)}
		</div>
	);
}

export default App;
