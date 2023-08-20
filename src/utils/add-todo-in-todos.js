import { NEW_TODO_ID } from '../constants';

export const addTodoInTodos = (todos, todo) => {
	const newtodo = todo || {
		id: NEW_TODO_ID,
		title: '',
		isEditing: true,
		completed: false,
	};
	return [newtodo, ...todos];
};
