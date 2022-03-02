import { fetchGraphQL } from "./fetch";

export async function getTaskByListId(id, token) {
  try {
    const operationName = "MyQuery";

    const query = `
      query MyQuery {
        lists_by_pk(id: ${id}) {
          id
          name
          tasks {
            id
            name
            completed
          }
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

    return data.lists_by_pk;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function createTask(name, listId, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        insert_tasks_one(object: {list_id: ${listId}, name: "${name}"}) {
          id
          name
          completed
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.insert_tasks_one;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function getTaskById(id, token) {
  try {
    const operationName = "MyQuery";

    const query = `
      query ${operationName} {
        tasks_by_pk(id: ${id}) {
          id
          name
          completed
        }
      }
    `;

    const { data, errors } = await fetchGraphQL(
      query,
      operationName,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.tasks_by_pk;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function updateTaskNameById(id, name, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        update_tasks_by_pk(pk_columns: {id: ${id}}, _set: {name: "${name}"}) {
          id
          name
          completed
          list {
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

    return data.update_tasks_by_pk;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function updateTaskCompletedById(id, completed, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        update_tasks_by_pk(pk_columns: {id: ${id}}, _set: {completed: ${completed}}) {
          id
          name
          completed
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

    return data.update_tasks_by_pk;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function deleteTaskById(id, token) {
  try {
    const operationName = "MyMutation";

    const query = `
      mutation ${operationName} {
        delete_tasks_by_pk(id: ${id}) {
          id
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

    return data.delete_tasks_by_pk;
  } catch (err) {
    console.log(err);

    throw err;
  }
}
