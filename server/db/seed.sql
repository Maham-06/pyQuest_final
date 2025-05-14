-- Seed data for chapters
INSERT INTO chapters (title, description, difficulty, display_order, image_path, is_active) VALUES
('Python Basics', 'Begin your adventure with the fundamentals of Python programming. Learn about variables, data types, and basic operations.', 'beginner', 1, '/images/chapters/basics.png', true),
('Control Flow', 'Navigate through the decision paths and loops in Python. Master if statements, loops, and logical operations.', 'beginner', 2, '/images/chapters/control-flow.png', true),
('Functions & Modules', 'Discover the power of reusable code blocks. Learn to create functions, import modules, and organize your code.', 'intermediate', 3, '/images/chapters/functions.png', true),
('Data Structures', 'Explore the various ways to store and manipulate data in Python. Master lists, dictionaries, sets, and tuples.', 'intermediate', 4, '/images/chapters/data-structures.png', true),
('Object-Oriented Programming', 'Embark on a journey to understand classes, objects, inheritance, and polymorphism in Python.', 'advanced', 5, '/images/chapters/oop.png', true);

-- Seed data for levels in Python Basics chapter
INSERT INTO levels (title, description, chapter_id, display_order, content, instructions, test_cases, xp_reward, is_active) VALUES
('Hello, World!', 'Start your Python journey by printing your first message.', 
 (SELECT id FROM chapters WHERE title = 'Python Basics'), 
 1, 
 '{"type": "text", "data": "In Python, you can use the print() function to display text on the screen. Let''s start by printing \"Hello, World!\""}',
 'Write a Python program that prints the message "Hello, World!" to the console.',
 '[{"input": "", "expected": "Hello, World!"}]',
 50,
 true),
 
('Variables', 'Learn how to store and manipulate data using variables.', 
 (SELECT id FROM chapters WHERE title = 'Python Basics'), 
 2, 
 '{"type": "text", "data": "Variables are containers for storing data values. In Python, you don''t need to declare a variable type, and you can change the value later."}',
 'Create a variable called name and assign your name to it. Then print "Hello, " followed by the value of the name variable.',
 '[{"input": "", "expected_pattern": "Hello, .*"}]',
 50,
 true),
 
('Data Types', 'Explore the different types of data in Python.', 
 (SELECT id FROM chapters WHERE title = 'Python Basics'), 
 3, 
 '{"type": "text", "data": "Python has several built-in data types including strings, integers, floats, and booleans."}',
 'Create variables of different types: an integer called age with value 25, a float called height with value 5.9, and a boolean called is_student with value True. Print each variable on a new line.',
 '[{"input": "", "expected_pattern": "25\\n5\\.9\\nTrue"}]',
 75,
 true);

-- Seed data for levels in Control Flow chapter
INSERT INTO levels (title, description, chapter_id, display_order, content, instructions, test_cases, xp_reward, is_active) VALUES
('If Statements', 'Learn how to make decisions in your code using if statements.', 
 (SELECT id FROM chapters WHERE title = 'Control Flow'), 
 1, 
 '{"type": "text", "data": "If statements allow you to execute code conditionally based on whether a condition is true or false."}',
 'Write a program that asks for a number and prints "Positive" if the number is greater than 0, "Negative" if less than 0, and "Zero" if equal to 0.',
 '[{"input": "5", "expected": "Positive"}, {"input": "-3", "expected": "Negative"}, {"input": "0", "expected": "Zero"}]',
 75,
 true),
 
('For Loops', 'Discover how to repeat actions using for loops.', 
 (SELECT id FROM chapters WHERE title = 'Control Flow'), 
 2, 
 '{"type": "text", "data": "For loops are used to iterate over a sequence (like a list, tuple, dictionary, set, or string) and execute code for each element."}',
 'Write a program that prints the numbers from 1 to 5, each on a new line, using a for loop.',
 '[{"input": "", "expected": "1\\n2\\n3\\n4\\n5"}]',
 75,
 true);

-- Seed data for badges
INSERT INTO badges (name, description, icon, criteria_type, criteria_value) VALUES
('First Steps', 'Complete your first Python exercise', 'badge-first-steps.png', 'level_completion', '{"count": 1}'),
('Code Explorer', 'Complete 5 different exercises', 'badge-explorer.png', 'level_completion', '{"count": 5}'),
('Python Apprentice', 'Earn 500 XP', 'badge-apprentice.png', 'xp', '{"amount": 500}'),
('Consistent Coder', 'Maintain a 3-day streak', 'badge-streak.png', 'streak', '{"days": 3}'),
('Perfect Solution', 'Complete a level with a perfect score', 'badge-perfect.png', 'stars', '{"count": 3}');
