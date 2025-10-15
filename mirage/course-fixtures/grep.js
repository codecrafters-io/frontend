export default {
  "slug": "grep",
  "name": "Build your own grep",
  "short_name": "grep",
  "release_status": "live",
  "description_md": "Regular expressions (or Regexes) are patterns used to match character combinations in strings. In this challenge, you'll build a Regex engine from scratch by recreating grep, a CLI tool for regex-based searching.\n\nAlong the way you'll learn about Regex syntax, character classes, quantifiers and more.",
  "short_description_md": "Learn about regex syntax: character classes, quantifiers and more",
  "completion_percentage": 30,
  "languages": [
    {
      "slug": "cpp"
    },
    {
      "slug": "csharp"
    },
    {
      "slug": "gleam"
    },
    {
      "slug": "go"
    },
    {
      "slug": "haskell"
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
      "slug": "odin"
    },
    {
      "slug": "php"
    },
    {
      "slug": "python"
    },
    {
      "slug": "rust"
    },
    {
      "slug": "typescript"
    },
    {
      "slug": "ruby",
      "release_status": "alpha",
      "alpha_tester_usernames": [
        "sreeram-venkitesh"
      ]
    },
    {
      "slug": "zig"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "Lookahead assertions",
    "sample_extension_idea_description": "A grep implementation that can handle lookahead assertions like x(?=y)",
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
      "slug": "backreferences",
      "name": "Backreferences",
      "description_markdown": "In this challenge extension, you'll add support for [backreferences][1] to your Grep implementation.\n\nAlong the way, you'll learn about how capture groups and backreferences work.\n[1]: https://learn.microsoft.com/en-us/dotnet/standard/base-types/backreference-constructs-in-regular-expressions#numbered-backreferences\n"
    },
    {
      "slug": "file-search",
      "name": "File Search",
      "description_markdown": "In this challenge extension, you'll add support for searching files.\n\nAlong the way, you'll learn about how to implement efficient file I/O, directory traversal and pattern matching on file contents.\n"
    }
  ],
  "stages": [
    {
      "slug": "cq2",
      "name": "Match a literal character",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll handle the simplest regex possible: a single character.\n\n**Example:**\n\n`a` should match \"apple\", but not \"dog\".",
      "description_md": "In this stage, we'll handle the simplest regex possible: a single character.\n\n**Example:** `a` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"apple\" | ./your_program.sh -E \"a\"\n```\n\nThe `-E` flag instructs `grep` to interpret patterns as extended regular expressions (with support\nfor metacharacters like `+`, `?` etc.). We'll use this flag in all stages.\n\nYour program must [exit](https://en.wikipedia.org/wiki/Exit_status) with 0 if the character is found, and 1 if not.\n\n### Notes\n\n- To learn how Regexes work under the hood, you'll build your own regex implementation from scratch instead of using {{language_name}}'s built-in regex features.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}\n"
    },
    {
      "slug": "oq2",
      "name": "Match digits",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll implement support for the `\\d`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit.\n\n**Example:**\n\n`\\d` should match \"1\", but not \"a\".",
      "description_md": "In this stage, we'll implement support for the digit (`\\d`)\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit.\n\n**Example:** `\\d` should match \"3\", but not \"c\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"apple123\" | ./your_program.sh -E \"\\d\"\n```\n\nYour program must exit with 0 if a digit is found in the string, and 1 if not.\n\n### Notes\n\n- To learn how Regexes work under the hood, you'll build your own regex implementation from scratch instead of using {{language_name}}'s built-in regex features.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "mr9",
      "name": "Match word characters",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll implement support for the `\\w`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`) and underscore `_`.\n\n**Example:**\n\n`\\w` should match \"foo101\", but not \"$!?\".",
      "description_md": "In this stage, we'll implement support for the word (`\\w`)\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`) and underscore `_`.\n\n**Example:** `\\w` should match \"foo101\", but not \"$!?\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"alpha_num3ric\" | ./your_program.sh -E \"\\w\"\n```\n\nYour program must exit with 0 if a word character is found in the string, and 1 if not.\n\n### Notes\n\n- Underscore `_` is included as it is considered part of a word in programming identifiers (e.g., variable and function names).\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "tl6",
      "name": "Positive Character Groups",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:**\n\n`[abc]` should match \"apple\", but not \"dog\".",
      "description_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:** `[abc]` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"apple\" | ./your_program.sh -E \"[abc]\"\n```\n\nYour program must exit with 0 if an any of the characters are found in the string, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "rk3",
      "name": "Negative Character Groups",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:**\n\n`[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\").",
      "description_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Examples:** \n- `[^abc]` should match \"cat\", since \"t\" is not in the set \"a\", \"b\", or \"c\".\n- `[^abc]` should not match \"cab\", since all characters are in the set.\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"apple\" | ./your_program.sh -E \"[^abc]\"\n```\n\nYour program must exit with 0 (match) if the input contains any character not in the negative character group; otherwise, it must exit with 1 (no match).\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "sh9",
      "name": "Combining Character Classes",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll support patterns that combine the character classes we've seen so far.\n\n**Examples:**\n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nThis stage is significantly harder than the previous ones. You'll likely need to rework your\nimplementation to process user input character-by-character instead of the whole line at once.",
      "description_md": "In this stage, we'll add support for patterns that combine the character classes we've seen so far.\n\nThis is where your regex matcher will start to _feel_ useful.\n\nKeep in mind that this stage is harder than the previous ones. You'll likely need to rework your\nimplementation to process user input character-by-character instead of the whole line at once.\n\nWe recommend taking a look at the example code in [\"A Regular Expression Matcher\"](https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html)\nby Rob Pike to guide your implementation.\n\n**Examples:**\n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"1 apple\" | ./your_program.sh -E \"\\d apple\"\n```\n\nYour program must exit with 0 if the pattern matches the input, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "rr8",
      "name": "Start of string anchor",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:**\n\n`^log` should match \"log\", but not \"slog\".",
      "description_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:** `^log` should match \"log\", but not \"slog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"log\" | ./your_program.sh -E \"^log\"\n```\n\nYour program must exit with 0 if the input starts with the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "ao7",
      "name": "End of string anchor",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://learn.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#end-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:**\n\n`dog$` should match \"dog\", but not \"dogs\".",
      "description_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://learn.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#end-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:** `dog$` should match \"dog\", but not \"dogs\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"dog\" | ./your_program.sh -E \"dog$\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "fz7",
      "name": "Match one or more times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**:\n\n- `a+` should match \"apple\" and \"SaaS\", but not \"dog\".",
      "description_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**: `a+` should match \"apple\" and \"SaaS\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"caats\" | ./your_program.sh -E \"ca+ts\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "ny8",
      "name": "Match zero or one times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `?`, the [zero or one](https://learn.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-zero-or-one-time-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**:\n\n- `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".",
      "description_md": "In this stage, we'll add support for `?`, the [zero or one](https://learn.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-zero-or-one-time-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**: `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"dogs\" | ./your_program.sh -E \"dogs?\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "zb3",
      "name": "Wildcard",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**:\n\n- `d.g` should match \"dog\", but not \"cog\".",
      "description_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**: `d.g` should match \"dog\", but not \"cog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"dog\" | ./your_program.sh -E \"d.g\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "zm7",
      "name": "Alternation",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**:\n\n- `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".",
      "description_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**: `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".\n\nYour program will be executed like this:\n\n```bash\n$ echo -n \"cat\" | ./your_program.sh -E \"(cat|dog)\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}"
    },
    {
      "slug": "sb5",
      "primary_extension_slug": "backreferences",
      "name": "Single Backreference",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for single backreferences. You'll implement support for `\\1`.\n\n**Example:**\n- `(cat) and \\1` should match \"cat and cat\", but not \"cat and dog\".\n",
      "description_md": "In this stage, we'll add support for backreferences.\n\nA backreference lets you reuse a captured group in a regular expression. It is denoted by `\\` followed by a number, indicating the position of the captured group.\n\n**Examples:**\n- `(cat) and \\1` should match \"cat and cat\", but not \"cat and dog\".\n  - `\\1` refers to the first captured group, which is `(cat)`.\n- `(\\w+) and \\1` should match \"cat and cat\" and \"dog and dog\", but not \"cat and dog\".\n  - `\\1` refers to the first captured group, which is `(\\w+)`.\n\nYour program will be executed like this:\n\n```\n$ echo -n \"<input>\" | ./your_program.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n**Note:** You only need to focus on one backreference and one capturing group in this stage. We'll get to handling multiple backreferences in the next stage.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}\n"
    },
    {
      "slug": "tg1",
      "primary_extension_slug": "backreferences",
      "name": "Multiple Backreferences",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for multiple backreferences (`\\1`, `\\2` etc.) in the same pattern.\n\n**Example:**\n- `(\\d+) (\\w+) squares and \\1 \\2 circles` should match \"3 red squares and 3 red circles\" but should not match \"3 red squares and 4 red circles\".\n",
      "description_md": "In this stage, we'll add support for multiple backreferences.\n\nMultiple backreferences allow you to refer to several different captured groups within the same regex pattern.\n\n**Example:** `(\\d+) (\\w+) squares and \\1 \\2 circles` should match \"3 red squares and 3 red circles\" but should not match \"3 red squares and 4 red circles\".\n\nYour program will be executed like this:\n\n```\n$ echo -n \"<input>\" | ./your_program.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}\n"
    },
    {
      "slug": "xe5",
      "primary_extension_slug": "backreferences",
      "name": "Nested Backreferences",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for nested backreferences.\n\n**Example:**\n- `('(cat) and \\2') is the same as \\1` should match \"'cat and cat' is the same as 'cat and cat'\".\n",
      "description_md": "In this stage, we'll add support for nested backreferences. This means that a backreference is part of a larger capturing group, which itself is referenced again.\n\n**Example:** `('(cat) and \\2') is the same as \\1` should match \"'cat and cat' is the same as 'cat and cat'\".\n\nYour program will be executed like this:\n\n```\n$ echo -n \"<input>\" | ./your_program.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}\n"
    },
    {
      "slug": "dr5",
      "primary_extension_slug": "file-search",
      "name": "Search a single-line file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of a file with a single line.",
      "description_md": "In this stage, you'll add support for searching the contents of a file with a single line.\n\n## File Search\n\nWhen `grep` is given a file as an argument, it searches through the lines in the file and prints out matching lines. Example usage:\n\n```bash\n# This prints any lines that match search_pattern\n$ grep -E \"search_pattern\" any_file.txt\nThis is a line that matches search_pattern\n```\n\nMatching lines are printed to stdout.\n\nIf any matching lines were found, grep exits with status code 0 (i.e. \"success\"). If no matching lines were found, grep exits with status code 1.\n\nIn this stage, we'll test searching through a file that contains a single line. We'll get to handling multi-line files in later stages.\n\n## Tests\n\nThe tester will create some test files and then execute multiple commands to find matches in those files. For example:\n\n```bash\n# Create test file\n$ echo \"apple\" > fruits.txt\n\n# This must print the matched line to stdout and exit with code 0\n$ ./your_program.sh -E \"appl.*\" fruits.txt\napple\n\n# This must print nothing to stdout and exit with code 1\n$ ./your_program.sh -E \"carrot\" fruits.txt\n```\n\nThe tester will verify that all matching lines are printed to stdout. It'll also verify that the exit code is 0 if there are matching lines, and 1 if there aren't.\n\n## Notes\n\n- The file is guaranteed to exist and contain a single line\n- Output should contain the full line that matches the pattern\n"
    },
    {
      "slug": "ol9",
      "primary_extension_slug": "file-search",
      "name": "Search a multi-line file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of a file with multiple lines.",
      "description_md": "In this stage, you'll add support for searching the contents of a file with multiple lines.\n\n## Multiple matches within a file\n\nWhen searching through a multi-line file, `grep` processes each line individually and prints all matching lines to stdout, each on its own line. Example usage:\n\n```bash\n# This prints any lines that match search_pattern\n$ grep -E \"search_pattern\" multi_line_file.txt\nThis is a line that matches search_pattern\nThis is another line that matches search_pattern\n```\n\nAll matching lines are printed to stdout.\n\nIf any matching lines were found, grep exits with status code 0 (i.e. \"success\"). If no matching lines were found, grep exits with status code 1.\n\n## Tests\n\nThe tester will create some test files and then execute multiple commands to find matches in those files. For example:\n\n```bash\n# Create test file\n$ echo \"banana\" > fruits.txt\n$ echo \"grape\" >> fruits.txt\n$ echo \"blackberry\" >> fruits.txt\n$ echo \"blueberry\" >> fruits.txt\n\n# This must print the matched lines to stdout and exit with code 0\n$ ./your_program.sh -E \".*berry\" fruits.txt\nblackberry\nblueberry\n\n# This must print nothing to stdout and exit with code 1\n$ ./your_program.sh -E \"carrot\" fruits.txt\n```\n\nThe tester will verify that all matching lines are printed to stdout. It'll also verify that the exit code is 0 if there are matching lines, and 1 if there aren't.\n\n## Notes\n\n- The file is guaranteed to exist and contain multiple lines\n- Output should contain the full lines that match the pattern\n"
    },
    {
      "slug": "is6",
      "primary_extension_slug": "file-search",
      "name": "Search multiple files",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of multiple files.",
      "description_md": "In this stage, you'll add support for searching the contents of multiple files.\n\n## Searching multiple files\n\nWhen searching multiple files, `grep` processes each file individually and prints all matching lines to stdout with a `<filename>:` prefix. Example usage:\n\n```bash\n# This prints any lines that match search_pattern from multiple files\n$ grep -E \"search_pattern\" file1.txt file2.txt\nfile1.txt:This is a line that matches search_pattern\nfile2.txt:Another line that matches search_pattern\n```\n\nMatching lines are printed to stdout with filename prefixes.\n\nIf any matching lines were found, grep exits with status code 0 (i.e. \"success\"). If no matching lines were found, grep exits with status code 1.\n\n## Tests\n\nThe tester will create some test files and then execute multiple commands to find matches in those files. For example:\n\n```bash\n# Create test files\n$ echo \"banana\" > fruits.txt\n$ echo \"blueberry\" >> fruits.txt\n$ echo \"broccoli\" >> vegetables.txt\n$ echo \"carrot\" >> vegetables.txt\n\n# This must print the matched lines to stdout and exit with code 0\n$ ./your_program.sh -E \"b.*$\" fruits.txt vegetables.txt\nfruits.txt:banana\nfruits.txt:blueberry\nvegetables.txt:broccoli\n\n# This must print nothing to stdout and exit with code 1\n$ ./your_program.sh -E \"missing_fruit\" fruits.txt vegetables.txt\n```\n\nThe tester will verify that all matching lines are printed to stdout. It'll also verify that the exit code is 0 if there are matching lines, and 1 if there aren't.\n"
    },
    {
      "slug": "yx6",
      "primary_extension_slug": "file-search",
      "name": "Recursive search",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for searching through files in a given directory and its subdirectories recursively with the -r flag.",
      "description_md": "In this stage, you'll add support for searching through files in a given directory and its subdirectories recursively with the `-r` flag.\n\n## Recursive search\n\nWhen `grep` is passed the `-r` flag, it searches through the given directory and its subdirectories recursively. It processes each file line by line and prints all matching lines to stdout with a `<filename>:` prefix. Example usage:\n\n```bash\n# This prints any lines that match search_pattern from multiple files\n$ grep -r -E \"search_pattern\" directory/\ndirectory/file1.txt:This is a line that matches search_pattern\ndirectory/file2.txt:Another line that matches search_pattern\n```\n\nMatching lines are printed to stdout with filename prefixes.\n\nIf any matching lines were found, grep exits with status code 0 (i.e. \"success\"). If no matching lines were found, grep exits with status code 1.\n\n## Tests\n\nThe tester will create some test files and then multiple commands to find matches in those files. For example:\n\n```bash\n# Create test files\n$ mkdir -p dir/subdir\n$ echo \"pear\" > dir/fruits.txt\n$ echo \"strawberry\" >> dir/fruits.txt\n$ echo \"celery\" > dir/subdir/vegetables.txt\n$ echo \"carrot\" >> dir/subdir/vegetables.txt\n$ echo \"cucumber\" > dir/vegetables.txt\n$ echo \"corn\" >> dir/vegetables.txt\n\n# This must print the matched lines to stdout and exit with code 0\n$ ./your_program.sh -r -E \".*er\" dir/\ndir/fruits.txt:strawberry\ndir/subdir/vegetables.txt:celery\ndir/vegetables.txt:cucumber\n\n# This must print the matched lines to stdout and exit with code 0\n$ ./your_program.sh -r -E \".*ar\" dir/\ndir/fruits.txt:pear\ndir/subdir/vegetables.txt:carrot\n\n# This must print nothing to stdout and exit with code 1\n$ ./your_program.sh -r -E \"missing_fruit\" dir/\n```\n\nThe tester will verify that all matching lines are printed to stdout. It'll also verify that the exit code is 0 if there are matching lines, and 1 if there aren't.\n\n## Notes\n\n- GNU grep doesn't guarantee the sorting order of output; it processes files in filesystem order. Your `grep` can output matching lines in any order.\n- The filepath prefix is relative to the directory passed as an argument to the `-r` flag\n"
    }
  ]
}
