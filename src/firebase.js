import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAa_Etgb1NBTsZnGR_OWEq8KzqjwRM1QBw',
	authDomain: 'todo-fe4b3.firebaseapp.com',
	projectId: 'todo-fe4b3',
	storageBucket: 'todo-fe4b3.appspot.com',
	messagingSenderId: '420881264806',
	appId: '1:420881264806:web:87dca6f2917ca5d8b18467',
	databaseURL: 'https://todo-fe4b3-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
