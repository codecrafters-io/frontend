export default {
  "slug": "shell",
  "name": "Build your own Shell",
  "short_name": "Shell",
  "release_status": "live",
  "description_md": "A shell is a command-line interface that executes commands and manages processes. In this challenge, you'll build your own\n[POSIX compliant](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html) shell that's capable of interpreting\nshell commands, running external programs and builtin commands like `cd`, `pwd`, `echo` and more.\n\nAlong the way, you'll learn about shell command parsing, REPLs, builtin commands, and more.",
  "short_description_md": "Learn about parsing shell commands, executing programs and more",
  "completion_percentage": 20,
  "languages": [
    {
      "slug": "c"
    },
    {
      "slug": "cpp"
    },
    {
      "slug": "csharp"
    },
    {
      "slug": "elixir"
    },
    {
      "slug": "gleam"
    },
    {
      "slug": "go"
    },
    {
      "slug": "java"
    },
    {
      "slug": "javascript"
    },
    {
      "slug": "kotlin"
    },
    {
      "slug": "php"
    },
    {
      "slug": "python"
    },
    {
      "slug": "ruby"
    },
    {
      "slug": "rust"
    },
    {
      "slug": "typescript"
    },
    {
      "slug": "zig"
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
    },
    {
      "slug": "quoting",
      "name": "Quoting",
      "description_markdown": "In this challenge extension, you'll add quoting support to your shell.\n\nQuoting allows you to preserve whitespace and special characters in your shell commands.\n"
    },
    {
      "slug": "redirection",
      "name": "Redirection",
      "description_markdown": "In this challenge extension, you'll add redirection support to your shell.\n\nRedirection allows you to redirect the output of a command to a file or another command.\n"
    },
    {
      "slug": "completions",
      "name": "Autocompletion",
      "description_markdown": "In this challenge extension, you'll add programmable completion support to your shell.\n\nProgrammable completion allows you to autocomplete commands and executable files.\n"
    },
    {
      "slug": "pipelines",
      "name": "Pipelines",
      "description_markdown": "In this challenge extension, you'll add support for pipelines to your shell.\n\nPipelines allow you to connect multiple commands together, so the output of one command becomes the input of the next command.\n"
    },
    {
      "slug": "history",
      "name": "History",
      "description_markdown": "In this challenge extension, you'll add support for viewing and recalling previously entered commands using the `history` builtin.\n\nHistory allows you to view and recall previously entered commands. Also, use it to re-run previous commands using the UP and DOWN arrow keys.\n"
    },
    {
      "slug": "history-persistence",
      "name": "History Persistence",
      "description_markdown": "In this challenge extension, you'll add support for persisting history to a file.\n\nHistory persistence allows you to save and load previously entered commands to and from a file.\n"
    }
  ],
  "stages": [
    {
      "slug": "oo8",
      "name": "Print a prompt",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll implement printing the shell prompt and waiting for user input.",
      "description_md": "In this stage, you'll implement printing a shell prompt (`$ `) and waiting for user input.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nThe tester will then check whether your shell prints the `$ ` prompt and waits for user input.\n\n### Notes\n\n- There's a space after the `$` character in the prompt.\n- Your program must not exit after printing `$ `, it should wait for user input.\n- We'll handle reading commands and executing them in later stages, this stage only deals with printing the prompt."
    },
    {
      "slug": "cz2",
      "name": "Handle invalid commands",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll implement handling invalid commands in your shell.",
      "description_md": "In this stage, you'll implement support for handling invalid commands in your shell.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send the following command to your shell:\n\n```bash\n$ invalid_command\ninvalid_command: command not found\n```\n\nThe tester will check whether your shell prints `<command_name>: command not found\\n` for an invalid command.\n\n### Notes\n\n- We're treating every command as \"invalid\" for now, but we'll handle executing \"valid\" commands like `echo`, `cd` etc. in later stages.\n- The command name will be a random string, so the response can't be hardcoded.\n- In this stage it's okay if your program exits soon after printing the `<command_name>: command not found\\n` message. In later stages\n  we'll check for a REPL (Read-Eval-Print Loop), i.e. whether the shell prints a new prompt after processing each command."
    },
    {
      "slug": "ff0",
      "name": "REPL",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement a REPL (Read-Eval-Print Loop) for your shell.",
      "description_md": "In this stage, you'll implement a [REPL (Read-Eval-Print Loop)](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).\n\nA REPL is an interactive loop that reads user input, evaluates it, prints the result, and then waits for the next input.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send a series of commands to your shell:\n\n```bash\n$ invalid_command_1\ninvalid_command_1: command not found\n$ invalid_command_2\ninvalid_command_2: command not found\n$ invalid_command_3\ninvalid_command_3: command not found\n$\n```\n\nAfter each command, the tester will check if `<command_name>: command not found` is printed, and whether a prompt is printed for the next command.\n\n### Notes\n\n- The exact number of commands sent and the command names will be random.\n- Just like the previous stages, all commands will be invalid commands, so the response will always be `<command_name>: command not found`."
    },
    {
      "slug": "pn5",
      "name": "The exit builtin",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll implement the `exit` builtin command.",
      "description_md": "In this stage, you'll implement the [exit](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#exit) builtin.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send an invalid command to your shell, followed by the `exit` command:\n\n```bash\n$ invalid_command_1\ninvalid_command_1: command not found\n$ exit 0\n```\n\nAfter issuing the `exit 0` command, the tester will verify whether your program terminates with [code/status](https://en.wikipedia.org/wiki/Exit_status) 0.\n\n### Notes\n\n- The tester will always pass in `0` as the argument to the `exit` command."
    },
    {
      "slug": "iz3",
      "name": "The echo builtin",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the `echo` builtin command.",
      "description_md": "In this stage, you'll implement the [echo](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/echo.html) builtin.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo hello world\nhello world\n$ echo pineapple strawberry\npineapple strawberry\n$\n```\n\nAfter each command, the tester will check if the `echo` command correctly prints the provided text back."
    },
    {
      "slug": "ez5",
      "name": "The type builtin: builtins",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the `type` builtin command.",
      "description_md": "In this stage, you'll implement the `type` builtin command for your shell.\n\nThe `type` builtin is used to determine how a command would be interpreted if used. Example:\n\n```bash\n$ type echo\necho is a shell builtin\n$ type exit\nexit is a shell builtin\n$ type invalid_command\ninvalid_command: not found\n```\n\nIn this stage we'll only test two cases: builtin commands and unrecognized commands. We'll handle\nexecutable files in later stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `type` commands to your shell:\n\n```bash\n$ type echo\necho is a shell builtin\n$ type exit\nexit is a shell builtin\n$ type type\ntype is a shell builtin\n$ type invalid_command\ninvalid_command: not found\n$\n```\n\nThe tester will check if the `type` command responds correctly based on the command provided:\n\n- If a command is a shell builtin, the expected output is `<command> is a shell builtin`.\n- If a command is not recognized, the expected output is `<command>: not found`.\n\n### Notes\n\n- The tester will only check for builtin commands and unrecognized commands in this stage.\n- `type` itself is a shell builtin command, so `$ type type` should print `type is a shell builtin`."
    },
    {
      "slug": "mg5",
      "name": "The type builtin: executable files",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the `type` builtin command for your shell.",
      "description_md": "In this stage, you'll extend the `type` builtin to search for executable files using [PATH](https://en.wikipedia.org/wiki/PATH_(variable)).\n\n[PATH](https://en.wikipedia.org/wiki/PATH_(variable)) is an environment variable that specifies a set of directories where executable programs are located. When a command is received, your shell should search for the command in the directories listed in the PATH environment variable.\n\nFor example, if PATH is `/dir1:/dir2:/dir3`, your shell should search in `/dir1`, then `/dir2`, and finally `/dir3`, in that order.\n\n- If a matching file is found but it does not have execute permissions, your shell should skip it and continue searching. \n- If a matching files is found and it has execute permissions, your shell should print the path to the file. \n- If no matching files are found, your shell should print `<command>: not found`.\n\n### Tests\n\nThe tester will execute your program with a custom `PATH` like this:\n\n```bash\nPATH=\"/usr/bin:/usr/local/bin:$PATH\" ./your_program.sh\n```\n\nIt'll then send a series of `type` commands to your shell:\n\n```bash\n$ type ls\nls is /usr/bin/ls\n$ type valid_command\nvalid_command is /usr/local/bin/valid_command\n$ type invalid_command\ninvalid_command: not found\n$\n```\n\nThe tester will check if the `type` command correctly identifies executable files in the PATH.\n\n### Notes\n\n- The actual value of the `PATH` environment variable will be random for each test case.\n- Some commands, such as `echo`, can exist as both builtin commands and executable files. In such cases, the `type` command should identify them as builtins.\n- PATH can include directories that don’t exist on disk, so your code should handle such cases gracefully."
    },
    {
      "slug": "ip1",
      "name": "Run a program",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run external programs with arguments.",
      "description_md": "In this stage, you'll add support for running external programs with arguments.\n\nExternal programs are located using the `PATH` environment variable, as described in previous stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a command that you need to execute:\n\n```bash\n$ custom_exe_1234 alice\nProgram was passed 2 args (including program name).\nArg #0 (program name): custom_exe_1234\nArg #1: alice\nProgram Signature: 5998595441\n```\n\nThe command (`custom_exe_1234`) in the example above will be present in `PATH` and will be an executable file.\n\nThe executable file will print information about the arguments it was passed along with a random \"program signature\". The tester will verify that your program prints output from the executable.\n\nThe tester will run multiple such commands and use a random number of arguments each time.\n\n### Notes\n\n- The program name, arguments and the expected output will be random for each test case.\n- The output in the example (\"Program was passed N args...\") comes from the executable. It's not something you need to implement manually."
    },
    {
      "slug": "ei0",
      "primary_extension_slug": "navigation",
      "name": "The pwd builtin",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll implement the ability for your shell to print the current working directory.",
      "description_md": "In this stage, you'll implement the `pwd` builtin command.\n\n[pwd](https://en.wikipedia.org/wiki/Pwd) stands for \"print working directory\".\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a `pwd` command to your shell:\n\n```bash\n$ pwd\n/path/to/current/directory\n$\n```\n\nThe tester will check if the `pwd` command correctly prints the current working directory.\n\n### Notes\n\n- The `pwd` command must print the full absolute path of the current working directory."
    },
    {
      "slug": "ra6",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Absolute paths",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with absolute paths.",
      "description_md": "In this stage, you'll implement the `cd` builtin command to handle absolute paths.\n\nThe `cd` command is used to change the current working directory. `cd` can receive multiple\nargument types. In this challenge we'll cover:\n\n- Absolute paths, like `/usr/local/bin`. (**This stage**)\n- Relative paths, like `./`, `../`, `./dir`. (Later stages)\n- The `~` character, which stands for the user's home directory (Later stages)\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr/local/bin\n$ pwd\n/usr/local/bin\n$ cd /does_not_exist\ncd: /does_not_exist: No such file or directory\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory when a valid path is provided. It'll\nalso check whether the message `cd: <directory>: No such file or directory` is printed if the provided path is invalid.\n\n### Notes\n\n- The `cd` command doesn't print anything if the directory is changed successfully. The tester will use `pwd` to verify\n  the current working directory after using `cd`."
    },
    {
      "slug": "gq9",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Relative paths",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with relative paths.",
      "description_md": "In this stage, you'll extend your `cd` builtin command to handle relative paths.\n\nAs a recap, `cd` can receive multiple argument types:\n\n- Absolute paths, like `/usr/local/bin`. (Previous stages)\n- Relative paths, like `./`, `../`, `./dir`. (**This stage**)\n- The `~` character, which stands for the user's home directory (Later stages)\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr\n$ pwd\n/usr\n$ cd ./local/bin\n$ pwd\n/usr/local/bin\n$ cd ../../\n$ pwd\n/usr\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory when a valid path is provided. It'll\nalso check whether the message `cd: <directory>: No such file or directory` is printed if the provided path is invalid.\n\n### Notes\n\n- The actual directory names used will be random, so you can't hardcode the expected output.\n- Relative paths like `./`, `../`, and more complex relative paths should be handled correctly.\n- The `cd` command doesn't print anything if the directory is changed successfully. The tester will use `pwd` to verify\n  the current working directory after using `cd`."
    },
    {
      "slug": "gp4",
      "primary_extension_slug": "navigation",
      "name": "The cd builtin: Home directory",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the ability for your shell to run the `cd` builtin command with the `HOME` directory.",
      "description_md": "In this stage, you'll extend your `cd` builtin command to handle the `~` character.\n\nAs a recap, `cd` can receive multiple argument types:\n\n- Absolute paths, like `/usr/local/bin`. (Previous stages)\n- Relative paths, like `./`, `../`, `./dir`. (Previous stages)\n- The `~` character, which stands for the user's home directory (**This stage**)\n\nThe `~` character is shorthand for the user's home directory. When `cd` is received with `~`, your shell should\nchange the current working directory to the user's home directory. The home directory is specified by the\n[`HOME`](https://unix.stackexchange.com/questions/123858/is-the-home-environment-variable-always-set-on-a-linux-system)\nenvironment variable.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `cd` commands to your shell:\n\n```bash\n$ cd /usr/local/bin\n$ pwd\n/usr/local/bin\n$ cd ~\n$ pwd\n/home/user\n$\n```\n\nThe tester will check if the `cd` command correctly changes the directory to the user's home directory when `~` is used.\n\n### Notes\n\n- The `pwd` command will be used to verify the current working directory after using `cd ~`.\n- The home directory is specified by the `HOME` environment variable."
    },
    {
      "slug": "ni6",
      "primary_extension_slug": "quoting",
      "name": "Single quotes",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for quoting with single quotes.",
      "description_md": "In this stage, you'll implement support for quoting with single quotes.\n\nEvery character within single quotes is interpreted literally, with no special treatment. Read more about quoting with single quotes [here](https://www.gnu.org/software/bash/manual/bash.html#Single-Quotes).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo 'shell hello'\nshell hello\n$ echo 'world     test'\nworld     test\n$\n```\n\nThe tester will check if the `echo` command correctly prints the quoted text.\n\nThen it will also send a `cat` command, with the file name parameter enclosed in single quotes:\n\n```bash\n$ cat '/tmp/file name' '/tmp/file name with spaces'\ncontent1 content2\n```\n\nThe tester will check if the `cat` command correctly prints the file content.\n\nHere are a few examples illustrating how quotes behave:\n\n| Command | Expected output | Explanation |\n| :---: | :-------------: | :---------: |\n| <code style=\"white-space: pre;\">echo 'hello    world'</code> | <code style=\"white-space: pre;\">hello    world</code> | Spaces are preserved within quotes. |\n| <code style=\"white-space: pre;\">echo hello    world</code> | `hello world` | Consecutive spaces are collapsed unless quoted. |\n| `echo 'hello''world'` | `helloworld` | Adjacent quoted strings `'hello'` and `'world'` are concatenated.\n| `echo hello''world` | `helloworld` | Empty quotes `''` are ignored.\n\n### Notes\n\n- The `cat` command is an executable available on most systems, so there's no need to implement it yourself."
    },
    {
      "slug": "tg6",
      "primary_extension_slug": "quoting",
      "name": "Double quotes",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for quoting with double quotes.",
      "description_md": "In this stage, you'll implement support for quoting with double quotes.\n\nMost characters within double quotes are treated literally, with a few exceptions that will be covered in later stages. Read more about quoting with double quotes [here](https://www.gnu.org/software/bash/manual/bash.html#Double-Quotes).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo \"quz  hello\"  \"bar\"\nquz  hello bar\n$ echo \"bar\"  \"shell's\"  \"foo\"\nbar shell's foo\n$\n```\n\nThe tester will check if the `echo` command correctly prints the quoted text.\n\nThen it will also send a `cat` command, with the file name parameter enclosed in double quotes:\n\n```bash\n$ cat \"/tmp/file name\" \"/tmp/'file name' with spaces\"\ncontent1 content2\n```\n\nThe tester will check if the `cat` command correctly prints the file content."
    },
    {
      "slug": "yt5",
      "primary_extension_slug": "quoting",
      "name": "Backslash outside quotes",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for quoting with backslashes only.",
      "description_md": "In this stage, you'll implement support for quoting with backslashes.\n\nA non-quoted backslash `\\` is treated as an escape character. It preserves the literal value of the next character. Read more about quoting with backslashes [here](https://www.gnu.org/software/bash/manual/bash.html#Escape-Character).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo \"before\\   after\"\nbefore\\   after\n$ echo world\\ \\ \\ \\ \\ \\ script\nworld      script\n$\n```\n\nThe tester will check if the `echo` command correctly prints the quoted text.\n\nThen it will also send a `cat` command, with the file name parameters consisting of backslashes inside quotes:\n\n```bash\n$ cat \"/tmp/file\\\\name\" \"/tmp/file\\ name\"\ncontent1 content2\n```\n\nThe tester will check if the `cat` command correctly prints the file content."
    },
    {
      "slug": "le5",
      "primary_extension_slug": "quoting",
      "name": "Backslash within single quotes",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for quoting with backslashes within single quotes.",
      "description_md": "In this stage, you'll implement support for quoting with backslashes within single quotes.\n\nWithin single quotes `'`, every character (including backslashes) is treated literally. No escaping is performed. Read more about quoting with backslashes within single quotes [here](https://www.gnu.org/software/bash/manual/bash.html#Single-Quotes).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo 'shell\\\\\\nscript'\nshell\\\\\\nscript\n$ echo 'example\\\"testhello\\\"shell'\nexample\\\"testhello\\\"shell\n$\n```\n\nThe tester will check if the `echo` command correctly prints the quoted text.\n\n\nThen it will also send a `cat` command, with the file name parameters consisting of backslashes inside single quotes:\n```bash\n$ cat \"/tmp/file/'name'\" \"/tmp/file/'\\name\\'\"\ncontent1 content2\n```\n\nThe tester will check if the `cat` command correctly prints the file content."
    },
    {
      "slug": "gu3",
      "primary_extension_slug": "quoting",
      "name": "Backslash within double quotes",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for quoting with backslashes within double quotes.",
      "description_md": "In this stage, you'll implement support for quoting with backslashes within double quotes.\n\nWithin double quotes `\"`, a backslash escapes the following characters: `\"`, `\\`, `$`, `` ` ``, or newline. Read more about quoting with backslashes within double quotes [here](https://www.gnu.org/software/bash/manual/bash.html#Double-Quotes).\n\nIn this stage, we’ll cover:\n\n- `\\\"` → escapes double quote, allowing \" to appear literally within the quoted string\n- `\\\\` → escapes backslash, resulting in a literal \\\n\nWe won’t cover the following cases in this stage:\n\n- `\\$` → escapes the dollar sign, preventing variable expansion\n-  `` \\` `` → escapes the backtick, preventing command substitution\n- `\\<newline>` → escapes a newline character, allowing line continuation\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of `echo` commands to your shell:\n\n```bash\n$ echo \"hello'script'\\\\n'world\"\nhello'script'\\n'world\n$ echo \"hello\\\"insidequotes\"script\\\"\nhello\"insidequotesscript\"\n$\n```\n\nThe tester will check if the `echo` command correctly prints the quoted text.\n\nThen it will also send a `cat` command, with the file name parameters consisting of backslashes inside double quotes:\n\n```bash\n$ cat \"/tmp/\"file\\name\"\" \"/tmp/\"file name\"\"\ncontent1 content2\n```\n\nThe tester will check if the `cat` command correctly prints the file content.\n\nHere are a few examples illustrating how backslashes behave within double quotes:\n\n| Command | Expected output |\n| :---: | :-------------: | \n| `echo \"A \\\\ escapes itself\"` | `A \\ escapes itself` | \n| `echo \"A \\\" inside double quotes\"` | `A \" inside double quotes` |"
    },
    {
      "slug": "qj0",
      "primary_extension_slug": "quoting",
      "name": "Executing a quoted executable",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for executing a quoted executable.",
      "description_md": "In this stage, you'll implement support for executing a quoted executable.\n\nThe tester will rename the `cat` executable to something containing spaces, quotes and backslashes.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of commands to your shell, executing the renamed `cat` executable:\n\n```bash\n$ 'exe with \"quotes\"' file\ncontent1\n$ \"exe with 'single quotes'\" file\ncontent2\n```\n\nThe tester will check if the commands correctly execute the renamed `cat` executable, and that the output is correct."
    },
    {
      "slug": "jv1",
      "primary_extension_slug": "redirection",
      "name": "Redirect stdout",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for redirecting the output of a command to a file.",
      "description_md": "In this stage, you'll implement support for redirecting the output of a command to a file.\n\nThe `1>` operator is used to redirect the output of a command to a file.\nBut, as a special case, if the file descriptor is not specified before the operator `>`, the output is redirected to the standard output by default, so `>` is equivalent to `1>`.\n\nLearn more about [Redirecting Output](https://www.gnu.org/software/bash/manual/bash.html#Redirecting-Output).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of commands to your shell, executing commands and redirecting their output to a file:\n\n```bash\n$ ls /tmp/baz > /tmp/foo/baz.md\n$ cat /tmp/foo/baz.md\napple\nblueberry\n$ echo 'Hello James' 1> /tmp/foo/foo.md\n$ cat /tmp/foo/foo.md\nHello James\n$ cat /tmp/baz/blueberry nonexistent 1> /tmp/foo/quz.md\ncat: nonexistent: No such file or directory\n$ cat /tmp/foo/quz.md\nblueberry\n```\n\nThe tester will check if the commands correctly execute commands and redirect their output to a file as specified.\nThe file contents will also be checked for correctness."
    },
    {
      "slug": "vz4",
      "primary_extension_slug": "redirection",
      "name": "Redirect stderr",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for redirecting the standard error of a command to a file.",
      "description_md": "In this stage, you'll implement support for redirecting the standard error of a command to a file.\n\nThe `2>` operator is used to redirect the standard error of a command to a file.\n\nLearn more about [Redirecting Stderr](https://www.gnu.org/software/bash/manual/bash.html#Redirecting-Output).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of commands to your shell, executing commands and redirecting their output to a file:\n\n```bash\n$ ls nonexistent 2> /tmp/quz/baz.md\n$ cat /tmp/quz/baz.md\nls: nonexistent: No such file or directory\n$ echo 'Maria file cannot be found' 2> /tmp/quz/foo.md\nMaria file cannot be found\n$ cat /tmp/bar/pear nonexistent 2> /tmp/quz/quz.md\npear\n$ cat /tmp/quz/quz.md\ncat: nonexistent: No such file or directory\n```\n\nThe tester will check if the commands correctly execute commands and redirect their error message to a file as specified.\n\nIt will also check that the file is created (if it doesn’t already exist), and that its contents match the expected output."
    },
    {
      "slug": "el9",
      "primary_extension_slug": "redirection",
      "name": "Append stdout",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for appending the output of a command to a file.",
      "description_md": "In this stage, you'll implement support for appending the output of a command to a file.\n\nThe `1>>` operator is used to append the output of a command to a file.\nAs a special case, if the file descriptor is not specified before the operator `>>`, the output is redirected to the standard output by default, so `>>` is equivalent to `1>>`.\n\nLearn more about [Appending Stdout](https://www.gnu.org/software/bash/manual/bash.html#Appending-Redirected-Output).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of commands to your shell, executing commands and appending their output to a file:\n\n```bash\n$ ls /tmp/baz >> /tmp/bar/bar.md\n$ cat /tmp/bar/bar.md\napple\nbanana\nblueberry\n$ echo 'Hello Emily' 1>> /tmp/bar/baz.md\n$ echo 'Hello Maria' 1>> /tmp/bar/baz.md\n$ cat /tmp/bar/baz.md\nHello Emily\nHello Maria\n$ echo \"List of files: \" > /tmp/bar/qux.md\n$ ls /tmp/baz >> /tmp/bar/qux.md\n$ cat /tmp/bar/qux.md\nList of files:\napple\nbanana\nblueberry\n```\n\nThe tester will check if the commands correctly execute commands and append their output to a file as specified.\nThe file contents will also be checked for correctness."
    },
    {
      "slug": "un3",
      "primary_extension_slug": "redirection",
      "name": "Append stderr",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for appending the standard error of a command to a file.",
      "description_md": "In this stage, you'll implement support for appending the standard error of a command to a file.\n\nThe `2>>` operator is used to append the standard error of a command to a file.\n\nLearn more about [Appending Stderr](https://www.gnu.org/software/bash/manual/bash.html#Appending-Redirected-Output).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send a series of commands to your shell, executing commands and appending their standard error to a file:\n\n```bash\n$ ls nonexistent >> /tmp/foo/baz.md\nls: nonexistent: No such file or directory\n$ ls nonexistent 2>> /tmp/foo/qux.md\n$ cat /tmp/foo/qux.md\nls: nonexistent: No such file or directory\n$ echo \"James says Error\" 2>> /tmp/foo/quz.md\nJames says Error\n$ cat nonexistent 2>> /tmp/foo/quz.md\n$ ls nonexistent 2>> /tmp/foo/quz.md\n$ cat /tmp/foo/quz.md\ncat: nonexistent: No such file or directory\nls: nonexistent: No such file or directory\n```\n\nThe tester will check if the commands correctly execute commands and append their standard error to a file as specified.\nThe file contents will also be checked for correctness."
    },
    {
      "slug": "qp2",
      "primary_extension_slug": "completions",
      "name": "Builtin completion",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for autocompleting builtin commands.",
      "description_md": "In this stage, you'll implement support for autocompleting builtin commands.\n\nYour shell should be able to complete builtin commands when the user presses the `<TAB>` key. Specifically, you'll need to implement completion for the `echo` and `exit` builtins.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send the following inputs, simulating user input and tab presses:\n\n1.  **Input:** `ech`<TAB>\n    * The tester expects the prompt to display `echo ` after the tab press.\n\n2.  **Input:** `exi`<TAB>\n    * The tester expects the prompt to display `exit ` after the tab press.\n\nThe tester checks if the completion works as expected and if your shell outputs the correct output for `echo` and `exit` command.\nNote the space at the end of the completion.\n\n### Notes\n\n- We recommend using a library like [readline](https://en.wikipedia.org/wiki/GNU_Readline) for your implementation. Most modern shells and REPLs (like the Python REPL) use readline under the hood. While you may need to override some of its default behaviors, it's typically less work than starting from scratch.\n- Different shells handle autocompletion differently. For consistency, we recommend using [Bash](https://www.gnu.org/software/bash/) for development and testing."
    },
    {
      "slug": "gm9",
      "primary_extension_slug": "completions",
      "name": "Completion with arguments",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for allowing arguments to be used after completion.",
      "description_md": "In this stage, you'll extend your shell's tab completion to handle commands with arguments.\n\nYour shell should now not only complete the command itself but also correctly handle the subsequent arguments that the user types.\nThis means that after completing the command with `<TAB>`, it should allow the user to continue typing arguments, and those arguments should also be interpreted correctly.\nYou'll need to ensure commands like `echo ` and `type` autocomplete and still function correctly with arguments.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nThe tests will simulate user input with tab presses and will execute builtin commands, similar to the previous stage, with added arguments:\n\n1.  **Input:** `ech<TAB>` `hello<ENTER>`\n    *   The tester expects the shell to first complete the `ech` to `echo` after `<TAB>`, then accept the `hello` argument, and after the `<ENTER>` key press, execute `echo hello`.\n    *   The shell should output `hello`.\n\n2.  **Input:** `exi<TAB>` `0<ENTER>`\n     *   The tester expects the shell to first complete `exi` to `exit` after `<TAB>`, then accept the `0` argument, and after the `<ENTER>` key press, execute `exit 0`.\n     *   The shell should exit with status code 0.\n\nThe tester will verify that your shell properly completes the commands and executes the commands with the given arguments."
    },
    {
      "slug": "qm8",
      "primary_extension_slug": "completions",
      "name": "Missing completions",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll implement support for handling invalid commands gracefully.",
      "description_md": "In this stage, you'll refine your shell's tab completion behavior to handle cases where the user types an invalid command.\n\nWhen the user types a command that is not a known builtin and presses `<TAB>`, your shell should not attempt to autocomplete it. Instead, it should just keep what the user typed and should ring a bell.\nThis means that if you type \"xyz\" and press `<TAB>`, the command should not change and you should hear a bell indicating that there are no valid completion options for \"xyz\".\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nThe tests will simulate the user typing an invalid command and pressing the `<TAB>` key:\n\n1.  **Input:** `xyz`<TAB>\n    *   The tester will first type `xyz` and then press `<TAB>`. The tester expects that the prompt still shows \"xyz\" and there is a bell sound.\n\nThe tester will verify that your shell does not attempt completion on invalid commands, the bell is sent.\nThe bell is sent by printing `\\x07`, the [bell character](https://en.wikipedia.org/wiki/Bell_character)."
    },
    {
      "slug": "gy5",
      "primary_extension_slug": "completions",
      "name": "Executable completion",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for autocompleting external executables.",
      "description_md": "In this stage, you'll extend your shell's tab completion to include external executable files in the user's `PATH`.\n\nYour shell should now be able to complete commands that are not built-ins, but exist as executable files in the directories listed in the `PATH` environment variable.\nWhen the user types the beginning of an external command and presses `<TAB>`, your shell should complete the command to the full executable file name.\nThis means that if you have a command `custom_executable` in the path and type `custom` and press `<TAB>`, the shell should complete that to `custom_executable`.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nBefore executing your shell, the tester will create an executable file named `custom_executable` and add its directory to the `PATH`.\n\nThe test will simulate the user typing the start of the external command and pressing `<TAB>`:\n\n1.  **Input:** `custom`<TAB>\n    *   The tester types \"custom\" and presses `<TAB>`. The tester expects that the prompt line changes to <code>custom_executable  </code>.\n\nThe tester will verify that your shell correctly completes the command to the external executable file name. Note the space at the end of the completion.\n\n### Notes\n\n- PATH can include directories that don't exist on disk, so your code should handle such cases gracefully."
    },
    {
      "slug": "wh6",
      "primary_extension_slug": "completions",
      "name": "Multiple completions",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll implement support for handling multiple completions.",
      "description_md": "In this stage, you'll implement tab completion for executables, specifically when multiple executables share a common prefix.\n\nWhen the user types a command prefix and presses `<TAB>`, your shell should:\n\n- Identify all executables in the `PATH` that match the prefix.\n- If there are multiple matches,\n  - On the first TAB press, just ring a bell. (`\\a` rings the bell)\n  - On the second TAB press, print all the matching executables separated by 2    spaces, on the next line, and follow it with the prompt on a new line.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then set up a specific `PATH` and place multiple executables starting with a common prefix into different directories in the `PATH`. Finally, it will type the common prefix, and then press the Tab key twice.\n\n```bash\n$ ./your_program.sh\n$ xyz_<TAB><TAB>\nxyz_bar  xyz_baz  xyz_quz\n$ xyz_\n```\n\nThe tester will verify that:\n\n1. Your shell displays the prompt with the common prefix after receiving the partial command.\n2. Upon the first Tab key press, your shell prints a bell character.\n3. Upon the second Tab key press, your shell prints the list of matching executables separated by 2 spaces, on the next line, and follow it with the prompt on a new line."
    },
    {
      "slug": "wt6",
      "primary_extension_slug": "completions",
      "name": "Partial completions",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll implement support for handling multiple completions with common prefixes.",
      "description_md": "In this stage, you'll extend your shell's tab completion to handle cases with multiple matching executables where one is a prefix of another.\n\nWhen the user types a partial command and presses the Tab key, your shell should attempt to complete the command name. If there are multiple executable files in the PATH that match the prefix, and one of those matches is a prefix of another, then the shell should complete to the longest common prefix of all matching executables. If there is only one match after performing completion, then the shell should complete the command name as in previous stages.\n\nFor example, if `xyz_foo`, `xyz_foo_bar`, and `xyz_foo_bar_baz` are all available executables and the user types `xyz_` and presses tab, then your shell should complete the command to `xyz_foo`. If the user then types `_` and presses tab again, it should complete to `xyz_foo_bar`. If the user then types `_` and presses tab again, it should complete to `xyz_foo_bar_baz`.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then set up a specific `PATH` and place executables `xyz_foo`, `xyz_foo_bar`, and `xyz_foo_bar_baz` into different directories in the `PATH`. Finally, it will type `xyz_` and then press Tab, then type `_` and press Tab, then type `_` and press Tab.\n\n```bash\n$ export PATH=/tmp/bar:$PATH\n$ export PATH=/tmp/baz:$PATH\n$ export PATH=/tmp/qux:$PATH\n$ ./your_program.sh\n$ xyz_<TAB>\n$ xyz_foo_<TAB>\n$ xyz_foo_bar_<TAB>\n$ xyz_foo_bar_baz\n```\nNote: The prompt lines above are on the same line.\n\nThe tester will verify that:\n\n1. After typing `xyz_` and pressing Tab, your shell completes to `xyz_foo`.\n2. After typing `_`, the prompt line matches `$ xyz_foo_`.\n3. After typing `_` and pressing Tab, your shell completes to `xyz_foo_bar`.\n4. After typing `_`, the prompt line matches `$ xyz_foo_bar_`.\n5. After typing `_` and pressing Tab, your shell completes to `xyz_foo_bar_baz`.\n6. The prompt line matches `$ xyz_foo_bar_baz ` after the final completion."
    },
    {
      "slug": "br6",
      "primary_extension_slug": "pipelines",
      "name": "Dual-command pipeline",
      "difficulty": "hard",
      "marketing_md": "Implement support for basic two-command pipelines like `command1 | command2`.",
      "description_md": "In this stage, you'll implement support for basic pipelines involving two external commands.\n\nA [pipeline](https://www.gnu.org/software/bash/manual/bash.html#Pipelines) connects the standard output of one command to the standard input of the next command using the `|` operator.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then execute multiple pipelines with two commands in them. Examples:\n\n```bash\n$ cat /tmp/foo/file | wc\n       5      10      77\n```\n\n```bash\n$ tail -f /tmp/foo/file-1 | head -n 5\nraspberry strawberry\npear mango\npineapple apple\n# (tester appends more lines to /tmp/foo/file-1)\n# (And expects the running command to keep printing new lines)\nThis is line 4.\nThis is line 5.\n$\n```\n\nThe tester will check if the final output matches the expected output after pipeline execution.\n\nFor the `tail -f` command, the tester will append content to the the input file while the pipeline is running.\n\n### Notes\n\n- The executables (`cat`, `wc`, `tail`, `head`) will be available in the `PATH`.\n- To execute a pipeline you'll need to create a [pipe](https://en.wikipedia.org/wiki/Anonymous_pipe), [fork](https://en.wikipedia.org/wiki/Fork_(system_call))\n  processes for each command, and set up the standard input/output redirection between them."
    },
    {
      "slug": "ny9",
      "primary_extension_slug": "pipelines",
      "name": "Pipelines with built-ins",
      "difficulty": "hard",
      "marketing_md": "Extend pipeline support to handle built-in commands like `echo` or `type` within pipelines.",
      "description_md": "In this stage, you'll extend pipeline support to include shell built-in commands.\n\nBuilt-in commands (like `echo`, `type`) need to be handled correctly when they appear as part of a pipeline, whether at the beginning, middle, or end.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send commands involving pipelines with built-ins:\n\n```bash\n$ echo raspberry\\\\nblueberry | wc\n       1       1      20\n$ ls | type exit\nexit is a shell builtin\n$\n```\n\nThe tester will check if the final output matches the expected output after the pipeline execution, correctly handling the built-in commands.\nFor the `type` command, the tester will check if the command correctly handles the built-in command and prints the correct output, the `ls` output is not supposed to be printed.\n\n### Notes\n\n-   Built-in commands don't typically involve creating a new process via `fork`/`exec`. You'll need to handle their execution within the shell process while still managing the input/output redirection required by the pipeline."
    },
    {
      "slug": "xk3",
      "primary_extension_slug": "pipelines",
      "name": "Multi-command pipelines",
      "difficulty": "hard",
      "marketing_md": "Implement support for multi-command pipelines like `command1 | command2 | command3`.",
      "description_md": "In this stage, you'll implement support for pipelines involving more than two commands.\n\nPipelines can chain multiple commands together, connecting the output of each command to the input of the next one.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt'll then send commands involving pipelines with three or more stages:\n\n```bash\n$ cat /tmp/foo/file | head -n 5 | wc\n       5       5      10\n$ ls -la /tmp/foo | tail -n 5 | head -n 3 | grep \"file\"\n-rw-r--r-- 1 user user     5 Apr 29 10:06 file\n$\n```\n\nThe tester will check if the final output matches the expected output after the multi-stage pipeline execution.\n\n### Notes\n\n-   This requires managing multiple pipes and processes.\n-   Ensure correct setup of stdin/stdout for each command in the chain (except the first command's stdin and the last command's stdout, which usually connect to the terminal or file redirections).\n-   Proper process cleanup and waiting are crucial."
    },
    {
      "slug": "bq4",
      "primary_extension_slug": "history",
      "name": "The history builtin",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for the `history` builtin command in `type`.",
      "description_md": "In this stage, you'll add support for [history](https://www.gnu.org/software/bash/manual/html_node/Bash-History-Builtins.html#index-history) as a shell builtin.\n\n### The history builtin\n\n[history](https://www.gnu.org/software/bash/manual/html_node/Bash-History-Builtins.html#index-history) as a shell builtin that lists previously executed commands. Example usage: \n```bash\n$ history\n    1  previous_command_1\n    2  previous_command_2\n    3  history\n```\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nThe tester will then execute the `type history` command.\n\n```bash\n$ type history\nhistory is a shell builtin\n$\n```\n\nThe tester will then execute the `type history` command and expect the output to be `history is a shell builtin`."
    },
    {
      "slug": "yf5",
      "primary_extension_slug": "history",
      "name": "Listing history",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement the `history` builtin.",
      "description_md": "In this stage, you'll implement the `history` builtin.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send multiple commands to your shell, followed by the `history` command:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n$ invalid_command\ninvalid_command: command not found\n$ history\n    1  echo hello\n    2  echo world\n    3  invalid_command\n    4  history\n$\n```\n\nThe tester expects a history list with the commands that were executed, formatted and indexed like in the example above.\n\n### Notes\n\n- Some shells like *zsh* don't add the `history` command to the history list, but the tester expects it to be present."
    },
    {
      "slug": "ag6",
      "primary_extension_slug": "history",
      "name": "Limiting history entries",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for limiting history entries.",
      "description_md": "In this stage, you'll add support for limiting history entries using the `history <n>` syntax.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send multiple commands to your shell, followed by the `history <n>` command:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n$ invalid_command\ninvalid_command: command not found\n$ history 2\n    3  invalid_command\n    4  history 2\n$\n```\n\nThe tester expects the history list to be limited to the last `n` commands.\n\n### Notes\n\n- The tester expects the history command to be present in the history list."
    },
    {
      "slug": "rh7",
      "primary_extension_slug": "history",
      "name": "Up-arrow navigation",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for recalling history with the up arrow key.",
      "description_md": "In this stage, you'll add support for recalling history with the up arrow key.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send multiple commands to your shell, followed by the up arrow to recall the history:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n<UP ARROW>\n$ echo world\n<UP ARROW>\n$ echo hello\n```\n\nThe tester will expect the previous commands to be displayed when the up arrow key is pressed.\n\n### Notes\n\n- We recommend using a library like [readline](https://en.wikipedia.org/wiki/GNU_Readline) for your implementation. Most modern shells and REPLs (like the Python REPL) use readline under the hood. While you may need to override some of its default behaviors, it's typically less work than starting from scratch."
    },
    {
      "slug": "vq0",
      "primary_extension_slug": "history",
      "name": "Down-arrow navigation",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for recalling history with the down arrow key.",
      "description_md": "In this stage, you'll add support for recalling history with the down arrow key.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send multiple commands to your shell, followed by the up and then down arrow keys to recall the history:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n<UP ARROW>\n$ echo world\n<UP ARROW>\n$ echo hello\n<DOWN ARROW>\n$ echo world\n```\n\nThe tester will expect the previous commands to be displayed when the down arrow key is pressed.\n\n### Notes\n\n- We recommend using a library like [readline](https://en.wikipedia.org/wiki/GNU_Readline) for your implementation. Most modern shells and REPLs (like the Python REPL) use readline under the hood. While you may need to override some of its default behaviors, it's typically less work than starting from scratch."
    },
    {
      "slug": "dm2",
      "primary_extension_slug": "history",
      "name": "Executing commands from history",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for being able to press enter to execute a command recalled using UP-DOWN arrows.",
      "description_md": "In this stage, you'll implement support for being able to press enter to execute a command recalled using UP-DOWN arrows.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send multiple commands to your shell, followed by the up and then down arrow keys to recall the history and then press enter to execute the command:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n<UP ARROW>\n$ echo world\n<UP ARROW>\n$ echo hello\n<DOWN ARROW>\n$ echo world\n<ENTER>\nworld\n$\n```\n\nThe tester will expect the command to be executed when the enter key is pressed."
    },
    {
      "slug": "za2",
      "primary_extension_slug": "history-persistence",
      "name": "Read history from file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for reading history from a file.",
      "description_md": "In this stage, you will read history from a file using the `history -r <path_to_history_file>` command.\n\n### Tests\n\nThe tester will write the following commands to the history file:\n\n```txt\necho hello\necho world\n<|EMPTY LINE|>\n```\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ history -r <path_to_history_file>\n$ history\n    1  history -r <path_to_history_file>\n    2  echo hello\n    3  echo world\n    4  history\n$\n```\n\n### Notes\n- The tester will expect the history commands to also be present in the history list.\n- `history -r` should append the history file's contents to the history list in memory."
    },
    {
      "slug": "in3",
      "primary_extension_slug": "history-persistence",
      "name": "Write history to file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for writing history to a file.",
      "description_md": "In this stage, you will add support for writing commands from memory to the history file using the `history -w <path_to_history_file>` command.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n$ history -w <path_to_history_file>\n$\n```\n\nThe tester will then expect the history file's contents to look like:\n\n```txt\necho hello\necho world\nhistory -w <path_to_history_file>\n<|EMPTY LINE|>\n```\n\n### Notes\n- If the file doesn't exist when running `history -w`, your shell should create the file and then write the commands to it.\n- The tester will expect the `history -w` command to also be present in the history file.\n- The history file should include a trailing newline character (displayed as an empty line)."
    },
    {
      "slug": "sx3",
      "primary_extension_slug": "history-persistence",
      "name": "Append history to file",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll implement support for appending history to a file.",
      "description_md": "In this stage, you will add support for appending commands from memory to the history file using the `history -a <path_to_history_file>` command.\n\n### Tests\n\nThe tester will write the following commands to the history file:\n\n```txt\necho initial_command_1\necho initial_command_2\n<|EMPTY LINE|>\n```\n\nThe tester will execute your program like this:\n\n```bash\n./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ echo new_command\nnew_command\n$ history -a <path_to_history_file>\n$\n```\n\nThe tester will then expect the history file's contents to include the new commands:\n\n```txt\necho initial_command_1\necho initial_command_2\necho new_command\nhistory -a <path_to_history_file>\n<|EMPTY LINE|>\n```\n\n### Notes\n- The tester will expect the `history -a` command to also be present in the history file.\n- Running `history -a` multiple times should only append commands that have been executed since the last time `history -a` was run."
    },
    {
      "slug": "zp4",
      "primary_extension_slug": "history-persistence",
      "name": "Read history on startup",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll ensure that your shell loads history from the file into memory on startup.",
      "description_md": "In this stage, you'll ensure that your shell loads history from the file into memory on startup.\n\n### The `HISTFILE` environment variable\n\nThe [`HISTFILE` environment variable](https://www.gnu.org/software///bash/manual/bash.html#index-HISTFILE) specifies the path to the history file. \nIt is the path used to load history from the file into memory on startup and to save the in-memory history to the file when exiting.\n\n\n### Tests\n\nThe tester will write the following commands to the history file:\n\n```txt\necho hello\necho world\n<|EMPTY LINE|>\n```\n\nThe tester will execute your program like this:\n\n```bash\nHISTFILE=<path_to_history_file> ./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ history\n    1  echo hello\n    2  echo world\n    3 history\n$\n```"
    },
    {
      "slug": "kz7",
      "primary_extension_slug": "history-persistence",
      "name": "Write history on exit",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll implement support for persisting history on exit.",
      "description_md": "In this stage, you'll add support for writing the in-memory history to the history file when exiting.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\nHISTFILE=<path_to_history_file> ./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ echo hello\nhello\n$ echo world\nworld\n$ exit 0\n```\n\nThe tester will then expect the history file's contents to look like:\n\n```txt\necho hello\necho world\nexit 0\n<|EMPTY LINE|>\n```"
    },
    {
      "slug": "jv2",
      "primary_extension_slug": "history-persistence",
      "name": "Append history on exit",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll implement support for appending the in-memory history to the history file when exiting.",
      "description_md": "In this stage, you'll add support for appending the in-memory history to the history file when exiting.\n\n### Tests\n\nThe tester will write the following commands to the history file:\n\n```txt\necho initial_command_1\necho initial_command_2\n<|EMPTY LINE|>\n```\n\nThe tester will execute your program like this:\n\n```bash\nHISTFILE=<path_to_history_file> ./your_program.sh\n```\n\nIt will then send the following commands to your shell:\n\n```bash\n$ echo new_command\nnew_command\n$ exit 0\n```\n\nThe tester will then expect the history file's contents to look like:\n\n```txt\necho initial_command_1\necho initial_command_2\necho new_command\nexit 0\n<|EMPTY LINE|>\n```"
    }
  ]
}
