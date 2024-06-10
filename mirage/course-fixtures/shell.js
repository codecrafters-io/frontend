export default {
  "slug": "shell",
  "name": "Build your own Shell",
  "short_name": "Shell",
  "release_status": "beta",
  "description_md": "A shell is a command-line interface that executes commands and manages processes. In this challenge, you'll build your own\n[POSIX compliant](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html) shell that's capable of interpreting\nshell commands, running external programs and builtin commands like `cd`, `pwd`, `echo` and more.\n\nAlong the way, you'll learn about shell command parsing, REPLs, builtin commands, and more.",
  "short_description_md": "Learn about parsing shell commands, executing programs and more",
  "completion_percentage": 20,
  "languages": [
    {
      "slug": "go"
    },
    {
      "slug": "python"
    },
    {
      "slug": "rust"
    },
    {
      "slug": "java"
    },
    {
      "slug": "javascript",
      "release_status": "alpha"
    },
    {
      "slug": "c"
    },
    {
      "slug": "cpp"
    },
    {
      "slug": "typescript",
      "release_status": "alpha"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "Command History",
    "sample_extension_idea_description": "View and recall previously entered commands in your shell.",
    "testimonials": [
      {
        "author_name": "Ananthalakshmi Sankar",
        "author_description": "Automation Engineer at Apple",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/oxta.jpeg",
        "link": "https://github.com/anu294",
        "text": "There are few sites I like as much that have a step by step guide. The real-time feedback is so good, it's creepy!"
      },
      {
        "author_name": "Patrick Burris",
        "author_description": "Senior Software Developer, CenturyLink",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/patrick-burris.jpeg",
        "link": "https://github.com/Jumballaya",
        "text": "I think the instant feedback right there in the git push is really cool.\nDidn't even know that was possible!"
      }
    ]
  },
  "extensions": [
    {
      "slug": "navigation",
      "name": "Navigation",
      "description_markdown": "In this challenge extension, you'll add directory navigation support by implementing the `cd` and `pwd` commands.\n\nAlong the way, you'll learn about what the \"current working directory\" is, how to change it and more.\n"
    }
  ],
  "stages": [
    {
      "slug": "oo8",
      "name": "Print a prompt",
      "difficulty": "very_easy",
      "description_md": "In this stage, you'll implement printing a shell prompt (`$ `) and waiting for user input.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nThe tester will then check whether your shell prints the `$ ` prompt and waits for user input.\n\n### Notes\n\n- There's a space after the `$` character in the prompt.\n- Your program must not exit after printing `$ `, it should wait for user input.\n- We'll handle reading commands and executing them in later stages, this stage only deals with printing the prompt.",
      "marketing_md": "In this stage, you'll implement printing the shell prompt and waiting for user input."
    },
    {
      "slug": "cz2",
      "name": "Handle missing commands",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement support for handling missing commands in your shell.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt will then send the following command to your shell:\n\n```bash\n$ nonexistent\nnonexistent: command not found\n```\n\nThe tester will check whether your shell prints `<command_name>: command not found` for an unrecognized command.\n\n### Notes\n\n- The command name will be a random string (like `missing_command_234`), so the response can't be hardcoded.\n- We'll handle executing \"valid\" commands like `echo`, `cd` etc. in later stages, this stage only deals with unrecognized commands.\n- In this stage it's okay if your program exits soon after printing the `<command_name>: command not found` message. In later stages\n  we'll check for a REPL (Read-Eval-Print Loop), i.e. whether the shell prints a new prompt after processing each command.",
      "marketing_md": "In this stage, you'll implement handling unrecognized commands in your shell."
    },
    {
      "slug": "ff0",
      "name": "REPL",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement a [REPL (Read-Eval-Print Loop)](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).\n\nA REPL is an interactive loop that reads user input, evaluates it, prints the result, and then waits for the next input.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt will then send a series of commands to your shell:\n\n```bash\n$ invalid_command_1\ninvalid_command_1: command not found\n$ invalid_command_2\ninvalid_command_2: command not found\n$ invalid_command_3\ninvalid_command_3: command not found\n$\n```\n\nAfter each command, the tester will check if `<command_name>: command not found` is printed, and whether a prompt is printed for the next command.\n\n### Notes\n\n- The exact number of commands sent and the command names will be random.\n- Just like the previous stages, all commands will be invalid commands, so the response will always be `<command_name>: command not found`.",
      "marketing_md": "In this stage, you'll implement a REPL (Read-Eval-Print Loop) for your shell."
    },
    {
      "slug": "pn5",
      "name": "The exit builtin",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement the [exit](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#exit) builtin.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send an invalid command to your shell, followed by the `exit` command:\n\n```bash\n$ invalid_command_1\ninvalid_command_1: command not found\n$ exit 0\n```\n\nAfter issuing the `exit 0` command, the tester will verify whether your program terminates with [code/status](https://en.wikipedia.org/wiki/Exit_status) 0.\n\n### Notes\n\n- The tester will always pass in `0` as the argument to the `exit` command.",
      "marketing_md": "In this stage, you'll implement the `exit` builtin command."
    },
    {
      "slug": "iz3",
      "name": "The echo builtin",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement the [echo](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/echo.html) builtin.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo hello world\nhello world\n$ echo pineapple strawberry\npineapple strawberry\n$\n```\n\nAfter each command, the tester will check if the `echo` command correctly prints the provided text back.",
      "marketing_md": "In this stage, you'll implement the `echo` builtin command."
    },
    {
      "slug": "ez5",
      "name": "The type builtin: builtins",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement the `type` builtin command for your shell.\n\nThe `type` builtin is used to determine how a command would be interpreted if used. Example:\n\n```bash\n$ type echo\necho is a shell builtin\n$ type exit\nexit is a shell builtin\n$ type nonexistent\nnonexistent not found\n$ type cat\ncat is /bin/cat\n```\n\nIn this stage we'll only test two cases: builtin commands and unrecognized commands. We'll handle\nexecutable files in later stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a series of `type` commands to your shell:\n\n```bash\n$ type echo\necho is a shell builtin\n$ type exit\nexit is a shell builtin\n$ type type\ntype is a shell builtin\n$ type nonexistent\nnonexistent not found\n$\n```\n\nThe tester will check if the `type` command responds correctly based on the command provided:\n\n- If a command is a shell builtin, the expected output is `<command> is a shell builtin`.\n- If a command is not recognized, the expected output is `<command> not found`.\n\n### Notes\n\n- The tester will only check for builtin commands and unrecognized commands in this stage.\n- `type` itself is a shell builtin command, so `$ type type` should print `type is a shell builtin`.",
      "marketing_md": "In this stage, you'll implement the `type` builtin command."
    },
    {
      "slug": "mg5",
      "name": "The type builtin: executable files",
      "difficulty": "medium",
      "description_md": "In this stage, you'll extend the `type` builtin to search for executable files using [PATH](https://en.wikipedia.org/wiki/PATH_(variable)).\n\n[PATH](https://en.wikipedia.org/wiki/PATH_(variable)) is an environment variable that specifies a set of directories\nwhere executable programs are located. When a command is received, the program should search for the command in the\ndirectories listed in the PATH environment variable. If the command is found, the program should print the path to the command. If the command is not found, the program should print `<command>: command not found`.\n\n### Tests\n\nThe tester will execute your program with a custom `PATH` like this:\n\n```bash\nPATH=\"/usr/bin:/usr/local/bin\" ./your_shell.sh\n```\n\nIt'll then send a series of `type` commands to your shell:\n\n```bash\n$ type ls\nls is /usr/bin/ls\n$ type abcd\nabcd is /usr/local/bin/abcd\n$ type missing_cmd\nmissing_cmd: command not found\n$\n```\n\nThe tester will check if the `type` command correctly identifies executable files in the PATH.\n\n### Notes\n\n- The actual value of the `PATH` environment variable will be random for each test case.\n- `PATH` can contain multiple directories separated by colons (`:`), your program should\n  search for programs in each directory in order and return the first match.",
      "marketing_md": "In this stage, you'll implement the `type` builtin command for your shell."
    },
    {
      "slug": "ip1",
      "name": "Run a program",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for running external programs with arguments.\n\nExternal programs are located using the `PATH` environment variable, as described in previous stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a command that you need to execute:\n\n```bash\n$ program_1234 alice\nHello alice! The secret code is 1234.\n```\n\nThe command (`program_1234`) in the example above will be present in `PATH` and will be an executable file.\n\nThe tester will check if your shell correctly executes the given command and prints the output.\n\n### Notes\n\n- The program name, arguments and the expected output will be random for each test case.",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run external programs with arguments."
    },
    {
      "slug": "ei0",
      "primary_extension_slug": "navigation",
      "name": "The pwd builtin",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement the `pwd` builtin command.\n\n[pwd](https://en.wikipedia.org/wiki/Pwd) stands for \"print working directory\".\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a `pwd` command to your shell:\n\n```bash\n$ pwd\n/path/to/current/directory\n$\n```\n\nThe tester will check if the `pwd` command correctly prints the current working directory.\n\n### Notes\n\n- The `pwd` command must print the full absolute path of the current working directory.",
      "marketing_md": "In this stage, you'll implement the ability for your shell to print the current working directory."
    },
    {
      "slug": "ra6",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Absolute paths",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement the `cd` builtin command to handle absolute paths.\n\nThe `cd` command is used to change the current working directory. `cd` can receive multiple\nargument types. In this challenge we'll cover:\n\n- Absolute paths, like `/usr/local/bin`. (**This stage**)\n- Relative paths, like `./`, `../`, `./dir`. (Later stages)\n- The `~` character, which stands for the user's home directory (Later stages)\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr/local/bin\n$ pwd\n/usr/local/bin\n$ cd /does_not_exist\ncd: /does_not_exist: No such file or directory\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory when a valid path is provided. It'll\nalso check whether the message `cd: <directory>: No such file or directory` is printed if the provided path is invalid.\n\n### Notes\n\n- The `cd` command doesn't print anything if the directory is changed successfully. The tester will use `pwd` to verify\n  the current working directory after using `cd`.",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with absolute paths."
    },
    {
      "slug": "gq9",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Relative paths",
      "difficulty": "hard",
      "description_md": "In this stage, you'll extend your `cd` builtin command to handle relative paths.\n\nAs a recap, `cd` can receive multiple argument types:\n\n- Absolute paths, like `/usr/local/bin`. (Previous stages)\n- Relative paths, like `./`, `../`, `./dir`. (**This stage**)\n- The `~` character, which stands for the user's home directory (Later stages)\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr\n$ pwd\n/usr\n$ cd ./local/bin\n$ pwd\n/usr/local/bin\n$ cd ../../\n$ pwd\n/usr\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory when a valid path is provided. It'll\nalso check whether the message `cd: <directory>: No such file or directory` is printed if the provided path is invalid.\n\n### Notes\n\n- The actual directory names used will be random, so you can't hardcode the expected output.\n- Relative paths like `./`, `../`, and more complex relative paths should be handled correctly.\n- The `cd` command doesn't print anything if the directory is changed successfully. The tester will use `pwd` to verify\n  the current working directory after using `cd`.",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with relative paths."
    },
    {
      "slug": "gp4",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Home directory",
      "difficulty": "medium",
      "description_md": "In this stage, you'll extend your `cd` builtin command to handle the `~` character.\n\nAs a recap, `cd` can receive multiple argument types:\n\n- Absolute paths, like `/usr/local/bin`. (Previous stages)\n- Relative paths, like `./`, `../`, `./dir`. (Previous stages)\n- The `~` character, which stands for the user's home directory (**This stage**)\n\nThe `~` character is shorthand for the user's home directory. When `cd` is received with `~`, your shell should\nchange the current working directory to the user's home directory. The home directory is specified by the\n[`HOME`](https://unix.stackexchange.com/questions/123858/is-the-home-environment-variable-always-set-on-a-linux-system)\nenvironment variable.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_shell.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr/local/bin\n$ pwd\n/usr/local/bin\n$ cd ~\n$ pwd\n/home/user\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory to the user's home directory when `~` is used.\n\n### Notes\n\n- The `pwd` command will be used to verify the current working directory after using `cd ~`.\n- The home directory is specified by the `HOME` environment variable.",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with the `HOME` directory."
    }
  ]
}
