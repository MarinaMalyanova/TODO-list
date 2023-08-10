import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAJroNlFw-l67uTzldSgPQSbRVbq7Cr2E4',
	authDomain: 'todoproj-481d1.firebaseapp.com',
	projectId: 'todoproj-481d1',
	storageBucket: 'todoproj-481d1.appspot.com',
	messagingSenderId: '454240634961',
	appId: '1:454240634961:web:c9e0077ad45d5337ab1070',
	databaseURL: 'https://todoproj-481d1-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
