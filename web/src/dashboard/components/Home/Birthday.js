import React from 'react';
import "../../scss/Home/Box.scss"
import "../../scss/Home/Birthday.scss"

export const Birthday = ({todayBirthday}) => {
    return (
        <section className='home-box birthday'>
            <h2 className='home-box__title birthday__title'>Urodziny</h2>
            <h3 className='birthday__description'>{todayBirthday.description}</h3>
            {todayBirthday.users.map(user => (
                <h4 className='birthday__user'
                    key={user.firstName + user.secondName + user.dateOfBirth}
                >
                    {user.firstName} {user.secondName}
                </h4>
            ))}
        </section>
    );
};