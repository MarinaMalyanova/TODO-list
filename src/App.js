import { useEffect, useState } from 'react';
import styles from './app.module.css';

function App() {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		setIsLoading(true);

		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((rawResponse) => rawResponse.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setIsLoading(false));
	}, []);
	return (
		<div className={styles.app}>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todos.map(({ id, title }) => (
					<div className={styles.list} key={id}>
						<span className={styles.id}>{id}</span>{' '}
						<span className={styles.todo}>{title}</span>
					</div>
				))
			)}
		</div>
	);
}

export default App;
