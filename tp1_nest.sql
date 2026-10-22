USE tp1_nest;
SHOW TABLES;
DESCRIBE todo;
INSERT INTO todo (name, description, status) VALUES
('Todo1', 'Description du todo 1', 'En attente'),
('Todo2', 'Description du todo 2', 'En attente'),
('Todo3', 'Description du todo 3', 'En cours');
   INSERT INTO todo (name, description, status) VALUES ('Todo4', 'Description du todo 4', 'Finalisé');
      UPDATE todo SET deletedAt = NOW() WHERE name = 'Todo1';
SELECT * FROM todo;