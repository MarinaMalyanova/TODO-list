import styles from './control-panel.module.css';
import { Button } from '../button/button';
import { Search, Sorting } from './components';
export const ControlPanel = ({ onTodoAdd, onSearch, onSorting }) => {
	return (
		<div className={styles.controlPanel}>
			<Search onSearch={onSearch} />
			<Sorting onSorting={onSorting} />
			<Button onClick={onTodoAdd}>✚</Button>
		</div>
	);
};
