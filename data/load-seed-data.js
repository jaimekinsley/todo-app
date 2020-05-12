const client = require('../lib/client');
// import our seed data:
const todoData = require('./todo.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      todoData.map(todo => {
        return client.query(`
                    INSERT INTO todo (task, owner_id)
                    VALUES ($1, $2);
                `,
        [todo.task, user.id]);
      })
    );


    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
