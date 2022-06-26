# Panel

This is a administration panel. It was created to manage flow of publications.

## Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://draftjs.org/">Draft.js</a></li>
    <li><a href="https://redux.js.org/">Redux</a></li>
    <li><a href="https://redux-toolkit.js.org/">Redux Toolkit</a></li>
    <li><a href="https://www.npmjs.com/package/react-table/">Redux Table</a></li>
    <li><a href="https://webpack.js.org/">Webpack</a></li>
    <li><a href="https://axios-http.com/">Axios</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://jwt.io/">JWT</a></li>
    <li><a href="https://sequelize.org/">Sequelize</a></li>
    <li><a href="https://www.passportjs.org/">Passport</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.mysql.com/">MySQL</a></li>
  </ul>
</details>

## Features

1. Creating, editing and deleting your publications.
2. Listing all publications.
3. Publishing, archivizing and commenting publications.
4. Creating and editing users.
5. Listing all users.
6. Changing your data and password.

## User groups

| Group             | Permissions                                                        |
| ----------------- | ------------------------------------------------------------------ |
| Reviewers | creating new publications; editing and sending to correction own publications; changing profile settings  |
| Correctors | taking publications for corrections; approving or sending back publications; archivizing and commenting publications |
| Moderators | publicating or sending back publications; |
| Admins | adding new users; editing and deactivating/reactivating users; editing terms pop-out |
| HeadAdmins | * |

Each group has the permissions of a group lower in the hierarchy.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:  
`DB_NAME`  
`DB_USERNAME`  
`DB_PASS`  

Also you will need a database. Models are defined in the folder: `api/db/models`

## Keys

You will have to generate public and private keys:
`id_rsa_priv.pem`  
`id_rsa_pub.pem`  

Algorithm: `RS256`

## Example account

Login: AdminUser  
Password: password1234

### Demo: [WWW](https://origami.networkmanager.pl/panel)



