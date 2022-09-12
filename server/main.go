// [[file:../docs.org::*header][header:1]]
package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)
// header:1 ends here

// [[file:../docs.org::*to do struct][to do struct:1]]
type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}
// to do struct:1 ends here

// [[file:../docs.org::*main][main:1]]
// Function main fiber endpoints
func main() {
	fmt.Printf("Hello, world")

	// Automatically assign fiber type to app variable
	app := fiber.New()

	// CORS config - Allow port 5173 (vite default)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Create a slice (array) of Todo
	todos := []Todo{}

	// GET endpoint to check server health with 200 return "OK" status.
	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// POST endpoint
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		todo.ID = len(todos) + 1

		// append a * pointer to todo
		todos = append(todos, *todo)

		// Return slice(list/array) of todos
		return c.JSON(todos)
	})

	// PATCH endpoint: Get id out of the url as an integer
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		// To update a single todo Loop through all the todos.
		// Find the id through the url and mark it as done.
		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
				break
			}
		} // http://127.0.0.1:4000/api/todos/1/done

		return c.JSON(todos)
	})

	// GET endpoint: Get back all todos
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	}) // http://127.0.0.1:4000/api/todos/

	log.Fatal(app.Listen(":4000"))

}
// main:1 ends here
