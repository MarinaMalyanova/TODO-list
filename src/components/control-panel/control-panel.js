import styles from './control-panel.module.css';
import { useState } from 'react';
import { Button } from '../button/button';
export const ControlPanel = ({ onTodoAdd }) => {
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isSortingEnabled, setIsSortingEnabled] = useState(false);

	const onSearchPhraseChange = ({ target }) => {
		setSearchPhrase(target.value);
	};
	const onSortingChange = ({ target }) => {
		setIsSortingEnabled(target.checked);
	};

	return (
		<div className={styles.controlPanel}>
			<input
				type="checkbox"
				className={styles.sortingButton}
				checked={isSortingEnabled}
				onChange={onSortingChange}
			/>
			<input
				className={styles.searchTask}
				type="text"
				value={searchPhrase}
				placeholder="Поиск..."
				onChange={onSearchPhraseChange}
			/>
			<Button onClick={onTodoAdd}>✚</Button>
		</div>
	);
};
