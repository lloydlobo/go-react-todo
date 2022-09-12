// [[file:../../../docs.org::*AddTodo][AddTodo:1]]
import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { ENDPOINT, Todo } from "../App";
import { KeyedMutator } from "swr";

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo[]> }) {
  // Controls whether the addtood dialog is open or closed
  const [open, setOpen] = useState(false);

  // https://mantine.dev/form/use-form/
  const form = useForm({
    initialValues: {
      title: "",
      body: "",
      // email: "",
    },
    // validate: { email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'), },
  });

  async function createTodo(values: { title: string; body: string }) {
    const updated = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    }).then((response) => response.json());

    // Call KeyedMutator (from swr) with updated
    mutate(updated);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Modal
        title="Create todo" opened={open}
        onClose={() => setOpen(false)}
      >
        {/* Create HTML form element */}
        <form onSubmit={form.onSubmit(createTodo)}>
          {/* TextInput & Textarea from @mantine/core */}
          <TextInput
            required
            mb={12}
            label="Todo"
            placeholder="What do you want to do?"
            // spread form from useForm setup
            {...form.getInputProps("title")}
          />
          <Textarea required
            // autosize={true}
            mb={12}
            label="Description"
            placeholder="Tell me more..."
            {...form.getInputProps("body")}
          />
          <Button type="submit">Create Todo</Button>
        </form>
      </Modal>

      {/* // Button to set open to true @mantine/core */}
      <Group position="center" >
        <Button fullWidth mb={12} onClick={() => setOpen(true)}
        >
          ADD TODO
        </Button>
      </Group>

    </>
  )
}

export default AddTodo;
// AddTodo:1 ends here
