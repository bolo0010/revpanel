import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Birthday } from './Birthday';
import { Today } from './Today';
import "../../scss/Home/Home.scss"

const Home = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [todayBirthday, setTodayBirthDay] = useState({
		description: 'Dzisiaj nikt nie świętuje.',
		users: []
	});

	useEffect(() => {
		checkTodayBirthday();
	}, []);

	const checkTodayBirthday = async () => {
		setIsLoading(true);
		try {
			const res = await axios({
				method: 'GET',
				url: '/api/users/birthday',
				withCredentials: true,
			});
			if (res.data.success) {
					setTodayBirthDay({
						description: `Dzisiaj urodziny obchodz${res.data.users.count>1 ? 'ą' : 'i'}:`,
						users: [...res.data.users.rows]
					})
			} else {
				setTodayBirthDay((values) => ({
					...values,
					description: res.data.message
				}))
			}
		} catch (err) {
			setTodayBirthDay((values) => ({
				...values,
				description: err.response.data.message
			}))
		}
		setIsLoading(false);
	}

	return (
		<>
			<main className="home">
				<Today/>
				{isLoading ? null : <Birthday todayBirthday={todayBirthday}/>}
			</main>
		</>
	);
};

export default Home;