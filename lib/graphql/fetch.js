export async function fetchGraphQL(query, operationName, variables, headers) {
  const modifiedHeaders = {
    "Content-Type": "application/json",
  };

  const headersArr = Object.keys(headers);

  if (headersArr.length > 0) {
    for (let i = 0; i < headersArr.length; i++) {
      modifiedHeaders[headersArr[i]] = headers[headersArr[i]];
    }
  } else {
    modifiedHeaders["x-hasura-admin-secret"] = process.env.HASURA_ADMIN_SECRET;
  }

  const result = await fetch(
    "https://included-troll-82.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        ...modifiedHeaders,
      },
      body: JSON.stringify({
        query,
        operationName,
        variables,
      }),
    }
  );

  return await result.json();
}
