export const UNITS = [
  {
    id: 1,
    title: "Python Basics",
    description: "Start from zero. Learn what coding is, what Python is, and speak your first lines.",
    icon: "🐍",
    color: "#58CC02",
    colorLight: "#D7FFB8",
    borderColor: "#45A800",
    lessons: [
      {
        id: 1,
        title: "Hello, World!",
        icon: "👋",
        xpReward: 20,
        learnMissions: [
          {
            type: 'concept',
            title: 'What is Programming?',
            text: 'A program is a set of instructions you give to a computer.\n\nComputers are incredibly fast — but completely literal. They do EXACTLY what you tell them. Nothing more, nothing less.\n\nProgramming is the art of writing the right instructions. In Pythoria, every spell you cast IS a program.',
            code: '# This is a Python program!\n# The # makes a comment — Python ignores it.\n# Comments are notes for you, not the computer.\n\nprint("My first spell!")',
            output: 'My first spell!',
          },
          {
            type: 'concept',
            title: 'What is Python?',
            text: 'Python is one of the most popular programming languages in the world.\n\nIt was designed to be easy to read — almost like plain English. Used by beginners AND professionals at Google, NASA, and Netflix.\n\nThe Python Codex of Pythoria is written entirely in it. Time to learn its language.',
            code: '# Python is readable!\nname = "Py"\ngreeting = "Hello, " + name\nprint(greeting)',
            output: 'Hello, Py',
          },
          {
            type: 'concept',
            title: 'Your First Spell: print()',
            text: 'print() sends a message to the screen — like casting your first spell!\n\nPut text inside quotes inside the parentheses. Python is case-sensitive: print() works, Print() does not.',
            code: 'print("Hello, World!")\nprint("I am learning Python!")',
            output: 'Hello, World!\nI am learning Python!',
          },
          {
            type: 'tap_correct',
            question: 'Which line correctly prints "Hello" to the screen?',
            options: [
              'Print("Hello")',
              'print("Hello")',
              'print(Hello)',
              'PRINT("Hello")',
            ],
            correct: 1,
          },
          {
            type: 'arrange',
            question: 'Put these lines in the correct order to print a greeting:',
            lines: ['print("Hello!")', 'print("I am Py")', 'print("Welcome!")'],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What does the # symbol do in Python?",
            options: ["Causes an error", "Starts a comment (Python ignores it)", "Prints text", "Multiplies numbers"],
            correct: 1,
            explanation: "# starts a comment — Python skips it completely. Comments are notes for humans. Use them to explain your code!"
          },
          {
            id: 2,
            type: "multiple_choice",
            question: "Which function displays text on the screen in Python?",
            options: ["show()", "print()", "display()", "write()"],
            correct: 1,
            explanation: "print() is Python's built-in function to show output! It's the very first spell every Python programmer learns."
          },
          {
            id: 3,
            type: "fill_blank",
            question: 'Complete the code to print "Hello, World!":',
            code: '_____("Hello, World!")',
            answer: "print",
            explanation: "print() sends your message to the screen. You're a natural!"
          },
          {
            id: 4,
            type: "fix_bug",
            question: "Fix the bug in this code:",
            code: 'Print("Hello, Dragon!")',
            answer: 'print("Hello, Dragon!")',
            hint: "Python is case-sensitive! Function names must be lowercase.",
            explanation: "Python is case-sensitive — print() must be lowercase. Print() with a capital P simply doesn't exist in Python!"
          }
        ]
      },
      {
        id: 2,
        title: "Variables",
        icon: "📦",
        xpReward: 25,
        learnMissions: [
          {
            type: 'concept',
            title: 'Variables — Named Boxes',
            text: 'A variable is like a labeled box. You put a value inside it and use the label to get it back later.\n\nUse = to store a value. You can store text, numbers, or True/False values.',
            code: 'name = "Py"\nscore = 42\nprint(name)\nprint(score)',
            output: 'Py\n42',
          },
          {
            type: 'match',
            question: 'Match each variable to its value:',
            pairs: [
              { left: 'hero = "Py"',    right: '"Py"' },
              { left: 'level = 5',      right: '5' },
              { left: 'alive = True',   right: 'True' },
            ],
          },
          {
            type: 'tap_correct',
            question: 'Which variable name is VALID in Python?',
            options: ['2player', 'player_name', 'player-name', 'player name'],
            correct: 1,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What is a variable in Python?",
            options: [
              "A fixed value that never changes",
              "A named container that stores data",
              "A type of loop",
              "A Python keyword"
            ],
            correct: 1,
            explanation: "Variables are named boxes — you store data inside them and use the name to access it. Change the box's contents any time!"
          },
          {
            id: 2,
            type: "fill_blank",
            question: "Store the number 42 in a variable called 'score':",
            code: "score _____ 42",
            answer: "=",
            explanation: "The = sign assigns a value to a variable. score = 42 puts 42 in the box called 'score'. Think of it as an arrow pointing left: score ← 42."
          },
          {
            id: 3,
            type: "output_predict",
            question: "What does this code print?",
            code: "name = \"Py\"\nprint(name)",
            options: ["name", '"Py"', "Py", "Error"],
            correct: 2,
            explanation: "When you print a variable, Python shows its VALUE — not the variable name and not the quotes. name holds 'Py', so Py is printed."
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which variable name is VALID in Python?",
            options: ["2player", "player_name", "player-name", "player name"],
            correct: 1,
            explanation: "Variable names can use letters, numbers, and underscores — but cannot start with a number or contain spaces/hyphens. player_name is perfect!"
          }
        ]
      },
      {
        id: 3,
        title: "Data Types",
        icon: "🔢",
        xpReward: 30,
        learnMissions: [
          {
            type: 'concept',
            title: 'The 4 Basic Types',
            text: 'Every value in Python has a TYPE. The four basics:\n\n• str — text inside quotes\n• int — whole numbers (no decimal)\n• float — decimal numbers\n• bool — only True or False\n\nPython uses these types to know what operations make sense.',
            code: 'message = "Hello"   # str\nhp = 100            # int\nspeed = 1.5         # float\nalive = True        # bool\nprint(type(hp))     # shows the type',
            output: "<class 'int'>",
          },
          {
            type: 'match',
            question: 'Match each value to its data type:',
            pairs: [
              { left: '"Dragon"',  right: 'str' },
              { left: '42',        right: 'int' },
              { left: '3.14',      right: 'float' },
              { left: 'False',     right: 'bool' },
            ],
          },
          {
            type: 'tap_correct',
            question: 'What does type(42) return?',
            code: 'print(type(42))',
            options: ["int", "<class 'int'>", "42", "number"],
            correct: 1,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: 'What data type is the value: "Hello"',
            options: ["int", "float", "str", "bool"],
            correct: 2,
            explanation: "Text wrapped in quotes is a string (str). Strings are sequences of characters — letters, spaces, symbols, anything you can type!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does type(42) return?",
            code: "print(type(42))",
            options: ["int", "<class 'int'>", "42", "number"],
            correct: 1,
            explanation: "type() reveals the data type. Python shows it as <class 'int'> — that's just how Python labels its types internally."
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "Which of these is a boolean value?",
            options: ['"True"', "1", "True", "yes"],
            correct: 2,
            explanation: "Boolean values are True and False — capitalized, no quotes. \"True\" with quotes is a string, not a boolean!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Convert the string \"42\" to an integer:",
            code: 'number = _____("42")',
            answer: "int",
            explanation: "int() converts a string to an integer. str() converts to string. float() converts to decimal. Type conversion is powerful magic!"
          }
        ]
      },
      {
        id: 4,
        title: "Strings & Input",
        icon: "✍️",
        xpReward: 30,
        learnMissions: [
          {
            type: 'concept',
            title: 'Working with Strings',
            text: 'Strings are text. You can join them with + (concatenation), repeat them with *, and use methods to transform them.\n\nf-strings let you embed variables directly inside text — super useful!',
            code: 'name = "Py"\ngreeting = "Hello, " + name + "!"\nprint(greeting)\n\n# f-string: easier way to insert variables\nprint(f"Hero: {name}, Level: {5}")',
            output: 'Hello, Py!\nHero: Py, Level: 5',
          },
          {
            type: 'concept',
            title: 'Getting Input from the User',
            text: 'input() pauses the program and waits for the user to type something. The result is always a string.\n\nUse int() or float() to convert it to a number if needed.',
            code: '# input() reads what the user types\nname = input("What is your name? ")\nprint(f"Welcome, {name}!")\n\n# Convert to number\nage = int(input("Your age: "))\nprint(f"You are {age} years old!")',
            output: 'What is your name? [user types]\nWelcome, [name]!',
          },
          {
            type: 'tap_correct',
            question: 'What does the + operator do with strings?',
            code: 'print("Hello" + " " + "World")',
            options: ['Adds numbers', 'Joins strings together', 'Causes an error', 'Multiplies text'],
            correct: 1,
          },
          {
            type: 'match',
            question: 'Match each string method to what it does:',
            pairs: [
              { left: '"hello".upper()',  right: '"HELLO"' },
              { left: '"HELLO".lower()',  right: '"hello"' },
              { left: 'len("Py")',        right: '2' },
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "output_predict",
            question: "What does this print?",
            code: 'name = "Dragon"\nprint("Hello, " + name + "!")',
            options: ['Hello, name!', 'Hello, Dragon!', '"Hello, " + name + "!"', 'Error'],
            correct: 1,
            explanation: "The + operator joins strings together. 'Hello, ' + 'Dragon' + '!' = 'Hello, Dragon!' — string concatenation!"
          },
          {
            id: 2,
            type: "fill_blank",
            question: "Complete the f-string to print: Hello, Py!",
            code: 'name = "Py"\nprint(f"Hello, {_____}!")',
            answer: "name",
            explanation: "In an f-string, {variable} inserts the variable's value into the string. Much cleaner than using + for concatenation!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What does input() always return?",
            options: ["An integer", "A float", "A string", "A boolean"],
            correct: 2,
            explanation: "input() always returns a string — even if the user types a number! Use int() or float() to convert it: age = int(input('Age: '))"
          },
          {
            id: 4,
            type: "output_predict",
            question: "What does this print?",
            code: 'word = "python"\nprint(word.upper())\nprint(len(word))',
            options: ["PYTHON\n6", "python\n6", "PYTHON\n5", "Error"],
            correct: 0,
            explanation: ".upper() converts all characters to uppercase. len() counts the characters — 'python' has 6 letters, so len returns 6."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Control Flow",
    description: "Teach your code to think. Make decisions and branch down different paths.",
    icon: "🔀",
    color: "#1CB0F6",
    colorLight: "#D0F0FF",
    borderColor: "#0099D7",
    lessons: [
      {
        id: 1,
        title: "If Statements",
        icon: "🤔",
        xpReward: 25,
        learnMissions: [
          {
            type: 'concept',
            title: 'Making Decisions with if',
            text: 'An if statement runs code ONLY when a condition is True. Think of it as a gate — it only opens when the condition passes.\n\nNote the colon : after the condition. Everything indented below it only runs if the condition is True.',
            code: 'hp = 90\nif hp >= 60:\n    print("You are healthy!")\n    print("Keep fighting!")',
            output: 'You are healthy!\nKeep fighting!',
          },
          {
            type: 'tap_correct',
            question: 'What does this code print?',
            code: 'score = 50\nif score >= 60:\n    print("Pass")\nelse:\n    print("Fail")',
            options: ['Pass', 'Fail', 'Nothing', 'Error'],
            correct: 1,
          },
          {
            type: 'arrange',
            question: 'Arrange this if-else block correctly:',
            lines: [
              'if hp > 0:',
              '    print("Alive!")',
              'else:',
              '    print("Game Over")',
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What does an 'if' statement do?",
            options: [
              "Repeats code multiple times",
              "Runs code only when a condition is True",
              "Defines a function",
              "Imports a module"
            ],
            correct: 1,
            explanation: "if statements are decision makers — the code inside only runs when the condition is True. False condition = skip the block!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this code print?",
            code: "score = 90\nif score >= 60:\n    print(\"You passed!\")",
            options: ["You passed!", "Nothing", "Error", "score"],
            correct: 0,
            explanation: "90 is greater than or equal to 60, so the condition is True and 'You passed!' gets printed!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "Fix the indentation bug:",
            code: "if True:\nprint(\"Fixed!\")",
            answer: "if True:\n    print(\"Fixed!\")",
            hint: "Python uses indentation (4 spaces) to define code blocks inside if statements.",
            explanation: "Python uses indentation instead of curly braces {}. Always indent the code inside an if block with 4 spaces (or 1 tab)!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Complete the if-else statement:",
            code: "if score > 50:\n    print(\"Pass\")\n_____:\n    print(\"Fail\")",
            answer: "else",
            explanation: "else is the fallback — it runs when the if condition is False. Together, if/else covers every possible case."
          }
        ]
      },
      {
        id: 2,
        title: "Comparisons",
        icon: "⚖️",
        xpReward: 25,
        learnMissions: [
          {
            type: 'concept',
            title: 'Comparison Operators',
            text: 'Comparison operators check relationships between values and always return True or False.\n\nCritical distinction: = assigns a value. == compares two values. Don\'t mix them up!',
            code: 'x = 10\nprint(x == 10)   # True  (equal?)\nprint(x != 5)    # True  (not equal?)\nprint(x > 20)    # False (greater?)\nprint(x >= 10)   # True  (greater or equal?)',
            output: 'True\nTrue\nFalse\nTrue',
          },
          {
            type: 'match',
            question: 'Match each operator to its meaning:',
            pairs: [
              { left: '==',  right: 'equal to' },
              { left: '!=',  right: 'not equal to' },
              { left: '>=',  right: 'greater or equal' },
              { left: '<',   right: 'less than' },
            ],
          },
          {
            type: 'tap_correct',
            question: 'What is the result of: 7 != 7',
            options: ['True', 'False', '0', 'Error'],
            correct: 1,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Which operator checks if two values are EQUAL?",
            options: ["=", "==", "!=", ">="],
            correct: 1,
            explanation: "== checks equality. = assigns values. This is one of the most common beginner mistakes — remember: one = assigns, two == compares!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "x = 5\nprint(x != 3)",
            options: ["True", "False", "5", "Error"],
            correct: 0,
            explanation: "!= means 'not equal to'. Since 5 is NOT equal to 3, the result is True!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What is the result of: 10 >= 10",
            options: ["True", "False", "0", "Error"],
            correct: 0,
            explanation: ">= means 'greater than OR equal to'. 10 equals 10, so the condition is True — it satisfies the 'equal to' part!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Complete to check if x is between 1 and 10:",
            code: "x = 7\nif x > 0 _____ x <= 10:\n    print(\"In range!\")",
            answer: "and",
            explanation: "'and' combines two conditions — BOTH must be True. 'or' means at least one must be True. 'not' flips True/False."
          }
        ]
      },
      {
        id: 3,
        title: "elif Chains",
        icon: "🪜",
        xpReward: 30,
        learnMissions: [
          {
            type: 'concept',
            title: 'Chaining Conditions with elif',
            text: 'elif (else if) lets you check multiple conditions in a chain. Python tests each one top-to-bottom and runs ONLY the first True branch — then skips the rest.',
            code: 'grade = 75\nif grade >= 90:\n    print("A — Outstanding!")\nelif grade >= 70:\n    print("B — Good work!")\nelif grade >= 50:\n    print("C — Passing")\nelse:\n    print("F — Try again")',
            output: 'B — Good work!',
          },
          {
            type: 'arrange',
            question: 'Arrange this grade checker correctly:',
            lines: [
              'if score >= 90:',
              '    print("A")',
              'elif score >= 70:',
              '    print("B")',
              'else:',
              '    print("C")',
            ],
          },
          {
            type: 'tap_correct',
            question: 'What does this code print when temp = 25?',
            code: 'temp = 25\nif temp > 35:\n    print("Hot")\nelif temp >= 20:\n    print("Warm")\nelse:\n    print("Cold")',
            options: ['Hot', 'Warm', 'Cold', 'Error'],
            correct: 1,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "When is elif used?",
            options: [
              "When you want to loop",
              "To check another condition if the previous if/elif was False",
              "To end a program",
              "To define a variable"
            ],
            correct: 1,
            explanation: "elif (else if) lets you chain conditions. Python checks each in order and runs the first True one — everything else is skipped."
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this code print?",
            code: "grade = 75\nif grade >= 90:\n    print(\"A\")\nelif grade >= 70:\n    print(\"B\")\nelse:\n    print(\"C\")",
            options: ["A", "B", "C", "AB"],
            correct: 1,
            explanation: "75 is not >= 90 (skip A), but 75 IS >= 70, so Python prints 'B' and stops checking the rest!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "Fix the bug:",
            code: "temp = 30\nif temp > 35:\n    print(\"Hot\")\nelif temp = 20:\n    print(\"Warm\")",
            answer: "temp = 30\nif temp > 35:\n    print(\"Hot\")\nelif temp >= 20:\n    print(\"Warm\")",
            hint: "In conditions, you need a comparison operator, not an assignment operator!",
            explanation: "elif needs a comparison (==, >=, etc.) not assignment (=). This is one of the most common Python bugs — watch for it!"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Loops",
    description: "Stop repeating yourself — let Python do it! Master loops to automate anything.",
    icon: "🔄",
    color: "#FF9600",
    colorLight: "#FFF0CC",
    borderColor: "#CC7A00",
    lessons: [
      {
        id: 1,
        title: "For Loops",
        icon: "🔁",
        xpReward: 30,
        learnMissions: [
          {
            type: 'concept',
            title: 'Repeating with for',
            text: 'A for loop repeats code for every item in a sequence.\n\nrange(n) generates numbers 0, 1, 2, ... up to (but NOT including) n. You can also loop over any string, list, or collection.',
            code: 'for i in range(3):\n    print("Attack!", i)\n\nfor letter in "Py":\n    print(letter)',
            output: 'Attack! 0\nAttack! 1\nAttack! 2\nP\ny',
          },
          {
            type: 'tap_correct',
            question: 'How many times does this loop print "Go!"?',
            code: 'for i in range(4):\n    print("Go!")',
            options: ['3 times', '4 times', '5 times', '0 times'],
            correct: 1,
          },
          {
            type: 'arrange',
            question: 'Arrange this for loop that prints 1 to 3:',
            lines: [
              'for i in range(1, 4):',
              '    print(i)',
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What does a for loop do?",
            options: [
              "Runs code once if a condition is true",
              "Repeats code for each item in a sequence",
              "Defines a function",
              "Stops the program"
            ],
            correct: 1,
            explanation: "A for loop iterates over a sequence — running the code block once for each item. Perfect for lists, ranges, strings, and more!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "How many times does this loop run?",
            code: "for i in range(3):\n    print(\"Go!\")",
            options: ["2 times", "3 times", "4 times", "Infinite"],
            correct: 1,
            explanation: "range(3) generates [0, 1, 2] — three numbers, so the loop runs exactly 3 times. range always starts at 0!"
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Complete the loop to print numbers 1 to 5:",
            code: "for i in _____(1, 6):\n    print(i)",
            answer: "range",
            explanation: "range(1, 6) generates 1, 2, 3, 4, 5. The start is included, the end is excluded. It stops just before 6!"
          },
          {
            id: 4,
            type: "output_predict",
            question: "What does this print?",
            code: "for letter in \"Py\":\n    print(letter)",
            options: ["Py", "P\ny", "P y", "Error"],
            correct: 1,
            explanation: "You can loop over a string! Python visits each character one at a time — P first, then y, each on its own line."
          }
        ]
      },
      {
        id: 2,
        title: "While Loops",
        icon: "⏳",
        xpReward: 30,
        learnMissions: [
          {
            type: 'concept',
            title: 'Looping with while',
            text: 'A while loop keeps running AS LONG AS a condition stays True.\n\nAlways update the variable inside the loop — otherwise the condition never becomes False and you get an infinite loop!',
            code: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1      # MUST decrease count!\nprint("Blast off!")',
            output: '3\n2\n1\nBlast off!',
          },
          {
            type: 'tap_correct',
            question: 'Why is this loop dangerous?',
            code: 'x = 1\nwhile x < 5:\n    print(x)',
            options: [
              'x is never updated — infinite loop!',
              'x starts too small',
              'while needs a colon',
              'print is wrong',
            ],
            correct: 0,
          },
          {
            type: 'arrange',
            question: 'Arrange the correct countdown loop:',
            lines: [
              'n = 3',
              'while n > 0:',
              '    print(n)',
              '    n -= 1',
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "When does a while loop stop?",
            options: [
              "After running exactly 10 times",
              "When the condition becomes False",
              "When you press a key",
              "After the program ends"
            ],
            correct: 1,
            explanation: "A while loop keeps running AS LONG AS the condition is True. The instant the condition becomes False, the loop stops!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1",
            options: ["3 2 1 0", "3\n2\n1", "0 1 2 3", "Infinite loop"],
            correct: 1,
            explanation: "Starts at 3, prints 3 → decreases to 2, prints 2 → decreases to 1, prints 1 → count is 0, condition fails, loop ends!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "This loop is infinite! Fix it:",
            code: "count = 1\nwhile count < 5:\n    print(count)",
            answer: "count = 1\nwhile count < 5:\n    print(count)\n    count += 1",
            hint: "The loop variable needs to change each iteration, otherwise the condition never becomes False!",
            explanation: "Without count += 1, count stays at 1 forever. The loop condition never becomes False. Always update your loop variable!"
          }
        ]
      },
      {
        id: 3,
        title: "Break & Continue",
        icon: "⏸️",
        xpReward: 35,
        learnMissions: [
          {
            type: 'concept',
            title: 'break and continue',
            text: 'break exits the loop immediately — no matter what.\ncontinue skips the rest of THIS iteration and jumps straight to the next one.\n\nThink of break as the emergency exit and continue as "skip this one, keep going."',
            code: '# break stops at 3\nfor i in range(5):\n    if i == 3:\n        break\n    print(i)\n\n# continue skips 2\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)',
            output: '0\n1\n2\n---\n0\n1\n3\n4',
          },
          {
            type: 'match',
            question: 'Match each keyword to what it does:',
            pairs: [
              { left: 'break',    right: 'exit loop immediately' },
              { left: 'continue', right: 'skip to next iteration' },
            ],
          },
          {
            type: 'tap_correct',
            question: 'What does this code print?',
            code: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)',
            options: ['0 1 2 3 4', '0\n1\n2\n3', '0\n1\n2', '3'],
            correct: 2,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What does 'break' do inside a loop?",
            options: [
              "Skips the current iteration",
              "Exits the loop immediately",
              "Restarts the loop",
              "Pauses the loop"
            ],
            correct: 1,
            explanation: "break is the emergency exit — it immediately stops the loop entirely, no matter what iteration you're on!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "for i in range(5):\n    if i == 3:\n        break\n    print(i)",
            options: ["0 1 2 3 4", "0\n1\n2\n3", "0\n1\n2", "3"],
            correct: 2,
            explanation: "Prints 0, 1, 2 — when i reaches 3, break fires and the loop stops BEFORE printing 3!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What does 'continue' do?",
            options: [
              "Stops the loop",
              "Skips the rest of THIS iteration and goes to the next",
              "Continues to the next program",
              "Starts the loop over from the beginning"
            ],
            correct: 1,
            explanation: "continue skips the rest of the current loop body and jumps to the next iteration. Unlike break, the loop keeps going after!"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Functions",
    description: "Write once, use forever. Functions are the building blocks of all real programs.",
    icon: "⚡",
    color: "#CE82FF",
    colorLight: "#F0D9FF",
    borderColor: "#9B59B6",
    lessons: [
      {
        id: 1,
        title: "Defining Functions",
        icon: "📝",
        xpReward: 35,
        learnMissions: [
          {
            type: 'concept',
            title: 'Creating Functions with def',
            text: 'A function is a reusable block of code with a name. Define it once with def, then call it as many times as you want.\n\nThe code inside a function only runs when you CALL it — not when you define it.',
            code: 'def cast_spell():\n    print("⚡ Zap!")\n    print("Bug defeated!")\n\ncast_spell()   # call it once\ncast_spell()   # call it again!',
            output: '⚡ Zap!\nBug defeated!\n⚡ Zap!\nBug defeated!',
          },
          {
            type: 'arrange',
            question: 'Arrange to define and call a function:',
            lines: [
              'def say_hi():',
              '    print("Hi!")',
              'say_hi()',
            ],
          },
          {
            type: 'tap_correct',
            question: 'What keyword defines a function in Python?',
            options: ['function', 'def', 'func', 'define'],
            correct: 1,
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What keyword defines a function in Python?",
            options: ["function", "def", "func", "define"],
            correct: 1,
            explanation: "def is short for 'define'. It tells Python: 'I'm creating a reusable block of code with this name!'"
          },
          {
            id: 2,
            type: "fill_blank",
            question: "Define a function called 'greet':",
            code: "_____ greet():\n    print(\"Hello!\")",
            answer: "def",
            explanation: "def greet(): creates a function named greet. The () holds parameters (inputs), the colon starts the function body."
          },
          {
            id: 3,
            type: "output_predict",
            question: "What does this code print?",
            code: "def say_hi():\n    print(\"Hi!\")\n\nsay_hi()\nsay_hi()",
            options: ["Hi!", "Hi!\nHi!", "say_hi()\nsay_hi()", "Nothing"],
            correct: 1,
            explanation: "Calling say_hi() twice runs the function body twice — that's the power of functions! Write once, run many times."
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "When does the code inside a function run?",
            options: [
              "When it's defined with def",
              "When it's called with the function name + ()",
              "Automatically when the file runs",
              "Never"
            ],
            correct: 1,
            explanation: "def just defines the function — it's a recipe, not the meal. You must CALL it using its name() to actually execute the code!"
          }
        ]
      },
      {
        id: 2,
        title: "Parameters & Return",
        icon: "🎯",
        xpReward: 40,
        learnMissions: [
          {
            type: 'concept',
            title: 'Parameters and return',
            text: 'Parameters let you pass data INTO a function — so the same function can work with different inputs.\n\nreturn sends a value BACK OUT to the caller. Without return, the function outputs None.',
            code: 'def add(a, b):\n    result = a + b\n    return result\n\nprint(add(3, 4))    # 7\nprint(add(10, 20))  # 30',
            output: '7\n30',
          },
          {
            type: 'tap_correct',
            question: 'What does a function return if there is no return statement?',
            options: ['0', 'Empty string', 'None', 'Error'],
            correct: 2,
          },
          {
            type: 'arrange',
            question: 'Arrange a function that doubles a number:',
            lines: [
              'def double(x):',
              '    return x * 2',
              'print(double(5))',
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "output_predict",
            question: "What does this print?",
            code: "def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)",
            options: ["a + b", "3 + 4", "7", "Error"],
            correct: 2,
            explanation: "add(3, 4) calls the function with a=3 and b=4. It returns 3+4=7, which gets stored in result and printed!"
          },
          {
            id: 2,
            type: "fill_blank",
            question: "Complete the function to return double the input:",
            code: "def double(x):\n    _____ x * 2",
            answer: "return",
            explanation: "return sends the value back to the caller. Without return, the function outputs None. Functions that calculate should always return their result!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What does a function return if there's no return statement?",
            options: ["0", "Empty string", "None", "Error"],
            correct: 2,
            explanation: "Python functions implicitly return None if there's no return statement. None represents 'no value' — it's Python's way of saying 'nothing here'."
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Lists & Dicts",
    description: "Collect your loot! Master Python's most powerful data structures.",
    icon: "🎒",
    color: "#FF4B4B",
    colorLight: "#FFD9D9",
    borderColor: "#D42C2C",
    lessons: [
      {
        id: 1,
        title: "Lists",
        icon: "📋",
        xpReward: 35,
        learnMissions: [
          {
            type: 'concept',
            title: 'Lists — Ordered Collections',
            text: 'A list holds multiple values in order, inside square brackets []. Access items by their INDEX — counting always starts at 0!\n\nLists are mutable — you can add, remove, or change items.',
            code: 'items = ["sword", "shield", "potion"]\nprint(items[0])    # first item\nprint(items[2])    # third item\nitems.append("torch")  # add to end\nprint(len(items))  # count items',
            output: 'sword\npotion\n4',
          },
          {
            type: 'tap_correct',
            question: 'What does items[2] return?',
            code: 'items = ["sword", "shield", "potion"]',
            options: ['"sword"', '"shield"', '"potion"', 'Error'],
            correct: 2,
          },
          {
            type: 'match',
            question: 'Match each method to what it does:',
            pairs: [
              { left: 'append(x)', right: 'add x to end' },
              { left: 'len(list)', right: 'get item count' },
              { left: 'list[0]',   right: 'get first item' },
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "How do you create a list in Python?",
            options: [
              "Using curly braces {}",
              "Using square brackets []",
              "Using parentheses ()",
              "Using angle brackets <>"
            ],
            correct: 1,
            explanation: "Lists use square brackets []. They hold items in order, allow duplicates, and can be changed after creation!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "items = [\"sword\", \"shield\", \"potion\"]\nprint(items[1])",
            options: ["sword", "shield", "potion", "Error"],
            correct: 1,
            explanation: "List indices start at 0! items[0] = 'sword', items[1] = 'shield', items[2] = 'potion'. Always count from zero!"
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Add 'torch' to the end of the list:",
            code: "items = [\"sword\", \"shield\"]\nitems._____(\"torch\")",
            answer: "append",
            explanation: "append() adds an item to the END of the list. It's one of the most-used list methods — grow your list one item at a time!"
          },
          {
            id: 4,
            type: "output_predict",
            question: "What does len() return here?",
            code: "heroes = [\"Alice\", \"Bob\", \"Carol\"]\nprint(len(heroes))",
            options: ["2", "3", "4", "0"],
            correct: 1,
            explanation: "len() returns the number of items. heroes has 3 items, so len(heroes) = 3. Works on lists, strings, and more!"
          }
        ]
      },
      {
        id: 2,
        title: "Dictionaries",
        icon: "📖",
        xpReward: 40,
        learnMissions: [
          {
            type: 'concept',
            title: 'Dictionaries — Key-Value Pairs',
            text: 'A dictionary stores data as key: value pairs in curly braces {}. Access values using their KEY — like looking up a word in a real dictionary.\n\nKeys must be unique. Values can be anything.',
            code: 'player = {\n    "name": "Py",\n    "level": 5,\n    "hp": 100\n}\nprint(player["name"])   # Py\nprint(player["level"])  # 5\nplayer["xp"] = 250      # add new key',
            output: 'Py\n5',
          },
          {
            type: 'tap_correct',
            question: 'How do you access the "level" key?',
            code: 'player = {"name": "Py", "level": 5}',
            options: ['player.level', 'player["level"]', 'player(level)', 'player->level'],
            correct: 1,
          },
          {
            type: 'match',
            question: 'Match each dict concept:',
            pairs: [
              { left: '"name"',        right: 'key' },
              { left: '"Py"',          right: 'value' },
              { left: 'dict["key"]',   right: 'access value' },
            ],
          },
        ],
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What makes a dictionary unique compared to a list?",
            options: [
              "It can hold more items",
              "It uses key-value pairs to store and access data",
              "It's faster to create",
              "It can only hold strings"
            ],
            correct: 1,
            explanation: "Dictionaries store data as key-value pairs — like a real dictionary where words (keys) have definitions (values). Access by name, not by position!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "player = {\"name\": \"Py\", \"level\": 5}\nprint(player[\"name\"])",
            options: ["Py", "name", "level", "5"],
            correct: 0,
            explanation: "Access dictionary values using their key in square brackets. player[\"name\"] looks up the value stored under the key \"name\" — which is \"Py\"."
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Add a new key 'hp' with value 100:",
            code: "player = {\"name\": \"Py\"}\nplayer[_____] = 100",
            answer: '"hp"',
            explanation: "Assign a new key just like a variable assignment. player[\"hp\"] = 100 creates a new key-value pair in the dictionary!"
          }
        ]
      }
    ]
  }
];

export const ACHIEVEMENTS = [
  { id: "first_lesson", title: "First Steps", desc: "Complete your first lesson", icon: "🌟" },
  { id: "unit_1_complete", title: "Python Hatchling", desc: "Complete Python Basics", icon: "🥚" },
  { id: "unit_2_complete", title: "Logic Mage", desc: "Complete Control Flow", icon: "🔮" },
  { id: "unit_3_complete", title: "Loop Master", desc: "Complete Loops", icon: "🌀" },
  { id: "unit_4_complete", title: "Spell Weaver", desc: "Complete Functions", icon: "⚡" },
  { id: "unit_5_complete", title: "Data Dragon", desc: "Complete Lists & Dicts", icon: "🐉" },
  { id: "streak_3", title: "On Fire!", desc: "3-day streak", icon: "🔥" },
  { id: "streak_7", title: "Unstoppable", desc: "7-day streak", icon: "💎" },
  { id: "xp_100", title: "Century", desc: "Earn 100 XP", icon: "💯" },
  { id: "xp_500", title: "XP Legend", desc: "Earn 500 XP", icon: "👑" },
];
