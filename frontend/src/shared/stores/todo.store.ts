import { defineStore } from 'pinia';
import type { Todo, TodoForm, TodoUpdateForm } from '../interfaces';
import { createTodo, deleteTodo, fetchAllTodo, fetchSearchTodo, updateTodo } from '../services';
import type { ResponseData } from '../helpers';

interface ResponseTodoData {
  id: number;
  date: string;
  text: string;
  completed: boolean;
  message?: string;
}

interface TodoState {
  allTodo: Todo[] | null;
  loading: boolean | false;
}

export const useTodo = defineStore('todo', {
  state: (): TodoState => ({
    allTodo: null,
    loading: false
  }),
  actions: {
    async createTodo(todoForm: TodoForm) {
      this.loading = true;
      await createTodo(todoForm).then((response: ResponseData) => {
        const todoResponse = response as unknown as ResponseTodoData;
        // normalize response to Todo (convert date string to Date)
        const todo: Todo = {
          id: todoResponse.id,
          date: new Date(todoResponse.date),
          text: todoResponse.text,
          completed: todoResponse.completed
        };
        // ajoute le todo dans le tableau
        if (this.allTodo) {
          this.allTodo.push(todo);
          this.allTodo = this.allTodo.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
        this.loading = false;
      });
    },
    async updateTodo(id: string, todoForm: TodoUpdateForm) {
      await updateTodo(id, todoForm).then((response: ResponseData) => {
        const todoResponse = response as unknown as ResponseTodoData;
        if (this.allTodo) {
          // mets à jour le todo dans le tableau
          this.allTodo = this.allTodo.map((todo) =>
            todo.id === todoResponse.id
              ? {
                  ...todo,
                  id: todoResponse.id,
                  date: new Date(todoResponse.date),
                  text: todoResponse.text,
                  completed: todoResponse.completed
                }
              : todo
          );
        }
      });
    },
    async deleteTodo(id: string) {
      await deleteTodo(id).then((response: ResponseData) => {
        const todoResponse = response as unknown as ResponseTodoData;
        if (this.allTodo) {
          // supprime le todo du tableau
          this.allTodo = this.allTodo.filter((todo) => todo.id !== Number(todoResponse.id));
        }
      });
    },
    async fetchAllTodo() {
      this.loading = true;
      this.allTodo = await fetchAllTodo();
      this.loading = false;
    },
    async fetchSearchTodo(query: string) {
      this.loading = true;
      this.allTodo = await fetchSearchTodo(query);
      if(!this.allTodo) {
        this.allTodo = [];
      }
      this.loading = false;
    }
  }
});
