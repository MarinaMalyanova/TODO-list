import { AppContext } from '../../context';
import { useContext } from 'react';
import { Todo } from '../../components';

export const Todos = () => {
	const { todos } = useContext(AppContext);
	return todos.map(({ id, title, completed, isEditing = false }) => (
		<Todo
			key={id}
			id={id}
			title={title}
			completed={completed}
			isEditing={isEditing}
			// onEdit={() => onTodoEdit(id)}
			// onTitleChange={(newTitle) => onTodoTitleChange(id, newTitle)}
			// onCompletedChange={(newComplited) =>
			// 	onTodoComplitedChange(id, newComplited)
			// }
			// onSave={() => onTodoSave(id)}
			// onRemove={() => onTodoRemove(id)}
		/>
	));
};
