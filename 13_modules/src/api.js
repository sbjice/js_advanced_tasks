const API = 'http://localhost:3000/api/todos';


async function loadTodoItems() {
  const response = await fetch(API);
  const data = await response.json();
  return data;
}

async function createTodoItem(item) {
  const response = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  const data = await response.json();
  return data;
}

async function getTodoItem(id) {
  const response = await fetch(`${API}/${id}`);
  const data = await response.json();
  return data;
}

async function changeTodoItem(item) {
  const response = await fetch(`${API}/${item.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  const data = await response.json();
  return data;
}

async function deleteTodoItem(id) {
  const response = await fetch(`${API}/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404)
    console.log('Не удалось удалить дело, так как его не существует');
  const data = await response.json();
  return data;
}

export {
  loadTodoItems,
  createTodoItem,
  getTodoItem,
  changeTodoItem,
  deleteTodoItem
}
