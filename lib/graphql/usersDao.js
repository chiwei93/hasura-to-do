import { fetchGraphQL } from "./fetch";

export async function checkIfEmailIsTaken(email) {
  try {
    const operationName = "MyQuery";

    const query = `
      query ${operationName} {
        users(where: {email: {_eq: "${email}"}}) {
          id
        }
      }
    `;

    const { errors, data } = await fetchGraphQL(query, operationName, {}, {});

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.users.length !== 0;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function createUser(email, password) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation MyMutation {
        insert_users_one(object: {email: "${email}", password: "${password}"}) {
          id
          email
        }
      }
    `;

    const { errors, data } = await fetchGraphQL(query, operationName, {}, {});

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function getUserByEmail(email) {
  try {
    const operationName = "MyQuery";

    const query = `
      query ${operationName} {
        users(where: {email: {_eq: "${email}"}}) {
          id
          email
          password
        }
      }
    `;

    const { errors, data } = await fetchGraphQL(query, operationName, {}, {});

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);

    throw err;
  }
}