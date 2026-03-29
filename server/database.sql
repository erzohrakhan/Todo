CREATE DATABASE pern_todo;

\c pern_todo;

CREATE TABLE todo (
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false
);
