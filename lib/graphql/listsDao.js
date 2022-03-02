import { fetchGraphQL } from "./fetch";

export async function getUserLists(token) {
  try {
    const operationName = "MyQuery";

    const query = `
      query ${operationName} {
        lists {
          id
          name
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);
    console.log(err.message);

    throw err;
  }
}

export async function createList(listName, userId, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        insert_lists_one(object: {name: "${listName}", user_id: ${userId}}) {
          id
          name
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);
    console.log(err.message);

    throw err;
  }
}

export async function getListById(id, token) {
  try {
    const operationName = "MyQuery";

    const query = `
      query ${operationName} {
        lists_by_pk(id: ${id}) {
          id
          name
          user {
            id
          }
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function updateListNameById(id, name, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        update_lists_by_pk(pk_columns: {id: ${id}}, _set: {name: "${name}"}) {
          id
          name
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function deleteListById(id, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        delete_lists_by_pk(id: ${id}) {
          id
          name
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      { Authorization: `Bearer ${token}` }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (err) {
    console.log(err);

    throw err;
  }
}
