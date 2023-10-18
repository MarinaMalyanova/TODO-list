import styles from './todo.module.css';
import { Button } from '../button/button';
import { AppContext } from '../../context';
import { useContext } from 'react';

export const Todo = ({ id, title, completed, isEditing }) => {
	const {
		onTodoSave,
		onTodoEdit,
		onTodoTitleChange,
		onTodoComplitedChange,
		onTodoRemove,
	} = useContext(AppContext);

	return (
		<div className={styles.todo}>
			<input
				type="checkbox"
				checked={completed}
				onChange={({ target }) => onTodoComplitedChange(id, target.checked)}
			/>
			<div className={styles.todoTitle}>
				{isEditing ? (
					<input
						type="text"
						value={title}
						onChange={({ target }) => onTodoTitleChange(id, target.value)}
					/>
				) : (
					<div onClick={() => onTodoEdit(id)}>{title}</div>
				)}
			</div>
			<div>
				{isEditing ? (
					<Button onClick={() => onTodoSave(id)}>✎</Button>
				) : (
					<Button onClick={() => onTodoRemove(id)}>✗</Button>
				)}
			</div>
		</div>
	);
};
