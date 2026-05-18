export const UNITS = [
  {
    id: 1,
    title: "Python Basics",
    description: "Your adventure begins! Learn how to speak Python.",
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
            title: 'The print() Function',
            text: 'Every Python journey starts with print(). It sends a message to the screen — like casting your first spell!\n\nPut text inside quotes inside the parentheses.',
            code: 'print("Hello, World!")\nprint("My name is Py")',
            output: 'Hello, World!\nMy name is Py',
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
            question: "Which function displays text on the screen in Python?",
            options: ["show()", "print()", "display()", "write()"],
            correct: 1,
            explanation: "print() is Python's built-in function to show output! Every quest starts with knowing how to speak."
          },
          {
            id: 2,
            type: "fill_blank",
            question: 'Complete the code to print "Hello, World!":',
            code: '_____("Hello, World!")',
            answer: "print",
            explanation: "print() sends your message to the screen. You're a natural!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: 'What does this code output?\n\nprint("CodeQuest")',
            options: ["CodeQuest", '"CodeQuest"', "print(CodeQuest)", "Error"],
            correct: 0,
            explanation: "Python prints the text inside the quotes, without the quotes themselves."
          },
          {
            id: 4,
            type: "fix_bug",
            question: "Fix the bug in this code:",
            code: 'Print("Hello, Dragon!")',
            answer: 'print("Hello, Dragon!")',
            hint: "Python is case-sensitive! Function names must be lowercase.",
            explanation: "Python is case-sensitive — print() must be lowercase. Print() with a capital P doesn't exist!"
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
            text: 'A variable is like a labeled box. You put a value inside it and use the label to get it back later.\n\nUse = to store a value in a variable.',
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
              "A container that stores data",
              "A type of loop",
              "A Python keyword"
            ],
            correct: 1,
            explanation: "Variables are like named boxes — you store data inside them and use the name to access it!"
          },
          {
            id: 2,
            type: "fill_blank",
            question: "Store the number 42 in a variable called 'score':",
            code: "score _____ 42",
            answer: "=",
            explanation: "The = sign assigns a value to a variable. score = 42 stores 42 in the box called 'score'."
          },
          {
            id: 3,
            type: "output_predict",
            question: "What does this code print?",
            code: "name = \"Py\"\nprint(name)",
            options: ["name", '"Py"', "Py", "Error"],
            correct: 2,
            explanation: "When you print a variable, Python shows its value — not the variable name, not the quotes."
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which variable name is VALID in Python?",
            options: ["2player", "player_name", "player-name", "player name"],
            correct: 1,
            explanation: "Variable names can use letters, numbers, and underscores — but can't start with a number or have spaces/hyphens."
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
            text: 'Python has four basic data types you\'ll use constantly:\n\n• str — text in quotes\n• int — whole numbers\n• float — decimal numbers\n• bool — True or False',
            code: 'message = "Hello"   # str\nhp = 100            # int\nspeed = 1.5         # float\nalive = True        # bool',
            output: '',
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
            question: "What data type is this value: \"Hello\"",
            options: ["int", "float", "str", "bool"],
            correct: 2,
            explanation: "Text in quotes is a string (str). Strings are sequences of characters!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does type(42) return?",
            code: "print(type(42))",
            options: ["int", "<class 'int'>", "42", "number"],
            correct: 1,
            explanation: "type() returns the class name in the format <class 'typename'>. Python is telling you exactly what it is!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "Which of these is a boolean value?",
            options: ["\"True\"", "1", "True", "yes"],
            correct: 2,
            explanation: "Boolean values in Python are True and False — capitalized, no quotes. They're the simplest data type!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Convert the string \"42\" to an integer:",
            code: 'number = _____(\"42\")',
            answer: "int",
            explanation: "int() converts a string to an integer. str() converts to string, float() to decimal. Type conversion is powerful!"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Control Flow",
    description: "Make decisions! Teach your code to think.",
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
            text: 'An if statement runs code ONLY when a condition is True. Think of it as a gate — it only opens when the condition passes.\n\nNote the colon : and the indentation (4 spaces)!',
            code: 'hp = 90\nif hp >= 60:\n    print("You are healthy!")',
            output: 'You are healthy!',
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
            explanation: "if statements are decision makers — the code inside only runs when the condition is True!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this code print?",
            code: "score = 90\nif score >= 60:\n    print(\"You passed!\")",
            options: ["You passed!", "Nothing", "Error", "score"],
            correct: 0,
            explanation: "90 is greater than 60, so the condition is True and 'You passed!' gets printed!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "Fix the indentation bug:",
            code: "if True:\nprint(\"Fixed!\")",
            answer: "if True:\n    print(\"Fixed!\")",
            hint: "Python uses indentation (4 spaces) to define code blocks inside if statements.",
            explanation: "Python is unique — it uses indentation instead of curly braces {}. Always indent code inside an if block!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Complete the if-else statement:",
            code: "if score > 50:\n    print(\"Pass\")\n_____:\n    print(\"Fail\")",
            answer: "else",
            explanation: "else catches everything the if condition misses. It's the fallback path when if is False."
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
            text: 'Comparison operators check relationships between values and return True or False.\n\nRemember: = assigns, == compares!',
            code: 'x = 10\nprint(x == 10)   # True\nprint(x != 5)    # True\nprint(x > 20)    # False\nprint(x >= 10)   # True',
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
            explanation: "== checks equality (is this equal to that?). = is for assigning values. Easy to confuse — remember: one = assigns, two == compares!"
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
            explanation: ">= means 'greater than OR equal to'. 10 is equal to 10, so it's True!"
          },
          {
            id: 4,
            type: "fill_blank",
            question: "Complete to check if x is between 1 and 10:",
            code: "x = 7\nif x > 0 _____ x <= 10:\n    print(\"In range!\")",
            answer: "and",
            explanation: "'and' combines two conditions — both must be True. 'or' means at least one must be True."
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
            text: 'elif (else if) lets you check multiple conditions in a chain. Python tests each one top-to-bottom and runs only the FIRST True branch.',
            code: 'grade = 75\nif grade >= 90:\n    print("A")\nelif grade >= 70:\n    print("B")\nelse:\n    print("C")',
            output: 'B',
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
              "To check another condition if the first if was False",
              "To end a program",
              "To define a variable"
            ],
            correct: 1,
            explanation: "elif (else if) lets you chain multiple conditions. Python checks each one in order and runs the first True one."
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this code print?",
            code: "grade = 75\nif grade >= 90:\n    print(\"A\")\nelif grade >= 70:\n    print(\"B\")\nelse:\n    print(\"C\")",
            options: ["A", "B", "C", "AB"],
            correct: 1,
            explanation: "75 is not >= 90 (skip A), but 75 IS >= 70, so Python prints 'B' and stops checking!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "Fix the bug:",
            code: "temp = 30\nif temp > 35:\n    print(\"Hot\")\nelif temp = 20:\n    print(\"Warm\")",
            answer: "temp = 30\nif temp > 35:\n    print(\"Hot\")\nelif temp >= 20:\n    print(\"Warm\")",
            hint: "In conditions, you need a comparison operator, not an assignment operator!",
            explanation: "elif needs a comparison (==, >=, etc.), not assignment (=). This is one of the most common Python bugs!"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Loops",
    description: "Repeat yourself like a pro — let Python do the heavy lifting!",
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
            text: 'A for loop repeats code for every item in a sequence. range(n) generates numbers from 0 up to (but not including) n.',
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
            explanation: "A for loop iterates over a sequence, running the code block once for each item. Perfect for lists, ranges, and strings!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "How many times does this loop run?",
            code: "for i in range(3):\n    print(\"Go!\")",
            options: ["2 times", "3 times", "4 times", "Infinite"],
            correct: 1,
            explanation: "range(3) generates [0, 1, 2] — three numbers, so the loop runs 3 times!"
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Complete the loop to print numbers 1 to 5:",
            code: "for i in _____(1, 6):\n    print(i)",
            answer: "range",
            explanation: "range(1, 6) generates 1, 2, 3, 4, 5. The end number is excluded — it stops just before 6!"
          },
          {
            id: 4,
            type: "output_predict",
            question: "What does this print?",
            code: "for letter in \"Py\":\n    print(letter)",
            options: ["Py", "P\ny", "P y", "Error"],
            correct: 1,
            explanation: "You can loop over a string! Python goes through each character one at a time, printing P then y on separate lines."
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
            text: 'A while loop keeps running AS LONG AS a condition stays True. Always update the variable inside, or you get an infinite loop!',
            code: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("Blast off!")',
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
            explanation: "A while loop keeps running AS LONG AS the condition is True. The moment the condition is False, it stops!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1",
            options: ["3 2 1 0", "3\n2\n1", "0 1 2 3", "Infinite loop"],
            correct: 1,
            explanation: "Starts at 3, prints 3, decreases to 2, prints 2, decreases to 1, prints 1, then count is 0 — condition is False, loop ends!"
          },
          {
            id: 3,
            type: "fix_bug",
            question: "This loop is infinite! Fix it:",
            code: "count = 1\nwhile count < 5:\n    print(count)",
            answer: "count = 1\nwhile count < 5:\n    print(count)\n    count += 1",
            hint: "The loop variable needs to change each iteration, otherwise the condition never becomes False!",
            explanation: "Without count += 1, count stays at 1 forever and the loop never ends. Always update your loop variable!"
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
            text: 'break exits the loop immediately.\ncontinue skips the rest of this iteration and jumps to the next one.',
            code: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)\n\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)',
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
            explanation: "break is the emergency exit — it immediately stops the loop, no matter what!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "for i in range(5):\n    if i == 3:\n        break\n    print(i)",
            options: ["0 1 2 3 4", "0\n1\n2\n3", "0\n1\n2", "3"],
            correct: 2,
            explanation: "Prints 0, 1, 2 — when i reaches 3, break fires and the loop stops before printing 3!"
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
            explanation: "continue skips the rest of the current loop body and jumps to the next iteration. Unlike break, the loop keeps going!"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Functions",
    description: "Create reusable spells — write once, cast forever!",
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
            text: 'A function is a reusable block of code. Define it once with def, call it many times.\n\nThe code inside only runs when you CALL the function — not when you define it.',
            code: 'def greet():\n    print("Hello, hero!")\n\ngreet()\ngreet()',
            output: 'Hello, hero!\nHello, hero!',
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
            explanation: "def greet(): creates a function named greet. The () holds parameters, and the colon starts the function body."
          },
          {
            id: 3,
            type: "output_predict",
            question: "What does this code print?",
            code: "def say_hi():\n    print(\"Hi!\")\n\nsay_hi()\nsay_hi()",
            options: ["Hi!", "Hi!\nHi!", "say_hi()\nsay_hi()", "Nothing"],
            correct: 1,
            explanation: "Calling say_hi() twice runs it twice — that's the power of functions! Write once, run many times."
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
            explanation: "def just defines the function — it doesn't run it. You must call it using its name() to execute the code inside!"
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
            text: 'Parameters let you pass data INTO a function.\nreturn sends a value BACK OUT of the function to the caller.',
            code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)',
            output: '7',
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
            explanation: "return sends a value back from the function to whoever called it. Without return, the function outputs None!"
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What does a function return if there's no return statement?",
            options: ["0", "Empty string", "None", "Error"],
            correct: 2,
            explanation: "Python functions implicitly return None if there's no return statement. None represents 'no value'."
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
            text: 'A list holds multiple values in order. Use square brackets [] and access items by index — starting at 0!\n\nappend() adds items to the end.',
            code: 'items = ["sword", "shield", "potion"]\nprint(items[0])    # sword\nprint(items[1])    # shield\nitems.append("torch")\nprint(len(items))  # 4',
            output: 'sword\nshield\n4',
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
            explanation: "Lists use square brackets []. They can hold any type of data, in any order, and you can change them!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "items = [\"sword\", \"shield\", \"potion\"]\nprint(items[1])",
            options: ["sword", "shield", "potion", "Error"],
            correct: 1,
            explanation: "List indices start at 0! items[0] = 'sword', items[1] = 'shield', items[2] = 'potion'."
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Add 'torch' to the end of the list:",
            code: "items = [\"sword\", \"shield\"]\nitems._____(\"torch\")",
            answer: "append",
            explanation: "append() adds an item to the END of the list. It's one of the most-used list methods!"
          },
          {
            id: 4,
            type: "output_predict",
            question: "What does len() return here?",
            code: "heroes = [\"Alice\", \"Bob\", \"Carol\"]\nprint(len(heroes))",
            options: ["2", "3", "4", "0"],
            correct: 1,
            explanation: "len() returns the number of items in the list. heroes has 3 items, so len(heroes) = 3."
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
            text: 'A dictionary stores data as key: value pairs. Use curly braces {} and access values with their key — like looking up a word in a real dictionary.',
            code: 'player = {"name": "Py", "level": 5}\nprint(player["name"])   # Py\nplayer["hp"] = 100\nprint(player["hp"])     # 100',
            output: 'Py\n100',
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
              "It uses key-value pairs to store data",
              "It's faster to create",
              "It can only hold strings"
            ],
            correct: 1,
            explanation: "Dictionaries store data as key-value pairs — like a real dictionary where words (keys) have definitions (values)!"
          },
          {
            id: 2,
            type: "output_predict",
            question: "What does this print?",
            code: "player = {\"name\": \"Py\", \"level\": 5}\nprint(player[\"name\"])",
            options: ["Py", "name", "level", "5"],
            correct: 0,
            explanation: "Access dictionary values using their key in square brackets. player[\"name\"] looks up the value for the key \"name\"."
          },
          {
            id: 3,
            type: "fill_blank",
            question: "Add a new key 'hp' with value 100:",
            code: "player = {\"name\": \"Py\"}\nplayer[_____] = 100",
            answer: '"hp"',
            explanation: "Assign a new key just like a variable — player[\"hp\"] = 100 creates a new key-value pair in the dictionary!"
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
