import { useEffect, useState } from 'react';
import moment from 'moment';
import '../../scss/Home/Box.scss'
import '../../scss/Home/Today.scss'

export const Today = () => {
    const [time, setTime] = useState(moment(new Date()).format('HH:mm:ss'));
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    useEffect( () => {
        const interval = setInterval(() => {
            setTime(moment(new Date()).format('HH:mm:ss'))
            setDate(moment(new Date()).format('YYYY-MM-DD'))
        }, 1000);
        return () => clearInterval(interval);
    }, [time])

    return (
        <section className='home-box today'>
            <h2 className='home-box__title today_title'>Aktualny czas </h2>
            <h3 className='today__date'>{date} / {time}</h3>
        </section>
    )
}
