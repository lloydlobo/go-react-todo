// [[file:../../docs.org::*Imports][Imports:1]]
import { Box, List, ThemeIcon } from '@mantine/core'
import { CheckCircleFillIcon } from '@primer/octicons-react';
import useSWR from 'swr';
import './App.css'
import AddTodo from './components/AddTodo';
// Imports:1 ends here

// [[file:../../docs.org::*export interface Todo][export interface Todo:1]]
export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}
// export interface Todo:1 ends here

// [[file:../../docs.org::*constant ENDPOINT][constant ENDPOINT:1]]
export const ENDPOINT = "http://localhost:4000";
// constant ENDPOINT:1 ends here

// [[file:../../docs.org::*Functions][Functions:1]]
// const fetcher = (url: string) => fetch(url).then((r) => r.json());
const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

// TODO due to cors error, fix it in ../server in main.go
/* Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:4000/api/todos. (Reason: CORS request did not succeed). Status code: (null). */

function App() {
  // This prints out the result above ADD TODO button in UI
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  async function markTodoAsDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PATCH"
    }).then((response) => response.json());

    mutate(updated);
  }

  return (
    // style output result with sx from @mantine/style lib
    <Box
      sx={(theme) => ({
        padding: "2rem",
        width: "100%",
        maxWidth: "40rem",
        margin: "0 auto",
      })}
    >
      {/* pretty format collected todo json stringify data */}
      <List spacing="xs" size="sm" mb={12} center>
        {/* Map through the todos and remove testing stringify(data) */}
        {/* `?`since todo can be undefined while fetching the data */}
        {data?.map((todo) => {
          // todo__... is unique as an id
          return (
            <List.Item
              onClick={() => markTodoAsDone(todo.id)}
              key={`todo__${todo.id}`}
              icon={
                todo.done ? (
                  // if done colored else gray
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
            </List.Item>
          );
        })} {/* {JSON.stringify(data)} */}
      </List>

      {/* render AddTodo modal componenet */}
      <AddTodo mutate={mutate} />

    </Box>
  ); // # [] in Raw Data: http://localhost:5173/

}

export default App
// Functions:1 ends here
