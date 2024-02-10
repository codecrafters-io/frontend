export default {
  "slug": "grep",
  "name": "Build your own grep",
  "short_name": "grep",
  "release_status": "live",
  "description_md": "Regular expressions (Regexes, for short) are patterns used to match character combinations in strings. In this\nchallenge you'll build your own implementation of grep, a CLI tool for searching using Regexes.\n\nAlong the way you'll learn about Regex syntax, character classes, quantifiers and more.",
  "short_description_md": "Learn about regex syntax: character classes, quantifiers and more",
  "completion_percentage": 30,
  "languages": [
    {
      "slug": "cpp"
    },
    {
      "slug": "go"
    },
    {
      "slug": "haskell",
      "release_status": "beta"
    },
    {
      "slug": "javascript"
    },
    {
      "slug": "python"
    },
    {
      "slug": "ruby",
      "release_status": "alpha",
      "alpha_tester_usernames": [
        "rohitpaulk",
        "sreeram-venkitesh"
      ]
    },
    {
      "slug": "rust"
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
    }
  ],
  "stages": [
    {
      "slug": "init",
      "name": "Match a literal character",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll handle the simplest regex possible: a single character.\n\n**Example:** `a` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"a\"\n```\n\nThe `-E` flag instructs `grep` to interprets patterns as extended regular expressions (with support\nfor metacharacters like `+`, `?` etc.). We'll use this flag in all stages.\n\nYou program must [exit](https://en.wikipedia.org/wiki/Exit_status) with 0 if the character is found, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll handle the simplest regex possible: a single character.\n\n**Example:**\n\n`a` should match \"apple\", but not \"dog\"."
    },
    {
      "slug": "match_digit",
      "name": "Match digits",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll implement support for the `\\d`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit.\n\n**Example:** `\\d` should match \"3\", but not \"c\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple123\" | ./your_grep.sh -E \"\\d\"\n```\n\nYou program must exit with 0 if a digit is found in the string, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll implement support for the `\\d`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit.\n\n**Example:**\n\n`\\d` should match \"1\", but not \"a\"."
    },
    {
      "slug": "match_alphanumeric",
      "name": "Match alphanumeric characters",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll implement support for the `\\w`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`, `_`).\n\n**Example:** `\\w` should match \"foo101\", but not \"$!?\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"alpha-num3ric\" | ./your_grep.sh -E \"\\w\"\n```\n\nYou program must exit with 0 if an alphanumeric character is found in the string, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll implement support for the `\\w`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`, `_`).\n\n**Example:**\n\n`\\w` should match \"foo101\", but not \"$!?\"."
    },
    {
      "slug": "positive_character_groups",
      "name": "Positive Character Groups",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:** `[abc]` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"[abc]\"\n```\n\nYou program must exit with 0 if an any of the characters are found in the string, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:**\n\n`[abc]` should match \"apple\", but not \"dog\"."
    },
    {
      "slug": "negative_character_groups",
      "name": "Negative Character Groups",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:** `[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\").\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"[^abc]\"\n```\n\nYou program must exit with 0 if the input contains characters that aren't part of the negative character group, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:**\n\n`[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\")."
    },
    {
      "slug": "combining_character_classes",
      "name": "Combining Character Classes",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for patterns that combine the character classes we've seen so far.\n\nThis is where your regex matcher will start to _feel_ useful.\n\nKeep in mind that this stage is harder than the previous ones. You'll likely need to rework your\nimplementation to process user input character-by-character instead of the whole line at once.\n\nWe recommend taking a look at the example code in [\"A Regular Expression Matcher\"](https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html)\nby Rob Pike to guide your implementation.\n\n**Examples:**\n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nYour program will be executed like this:\n\n```bash\n$ echo \"1 apple\" | ./your_grep.sh -E \"\\d apple\"\n```\n\nYou program must exit with 0 if the pattern matches the input, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll support patterns that combine the character classes we've seen so far.\n\n**Examples:**\n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nThis stage is significantly harder than the previous ones. You'll likely need to rework your\nimplementation to process user input character-by-character instead of the whole line at once."
    },
    {
      "slug": "start_of_string_anchor",
      "name": "Start of string anchor",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:** `^log` should match \"log\", but not \"slog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"log\" | ./your_grep.sh -E \"^log\"\n```\n\nYou program must exit with 0 if the input starts with the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:**\n\n`^log` should match \"log\", but not \"slog\"."
    },
    {
      "slug": "end_of_string_anchor",
      "name": "End of string anchor",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:** `dog$` should match \"dog\", but not \"dogs\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"dog\" | ./your_grep.sh -E \"dog$\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:**\n\n`dog$` should match \"dog\", but not \"dogs\"."
    },
    {
      "slug": "one_or_more_quantifier",
      "name": "Match one or more times",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**: `a+` should match \"apple\" and \"SaaS\", but not \"dog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"caats\" | ./your_grep.sh -E \"ca+ts\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**:\n\n- `a+` should match \"apple\" and \"SaaS\", but not \"dog\"."
    },
    {
      "slug": "zero_or_one_quantifier",
      "name": "Match zero or one times",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for `?`, the [zero or one](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**: `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"dogs\" | ./your_grep.sh -E \"dogs?\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for `?`, the [zero or one](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**:\n\n- `dogs?` should match \"dogs\" and \"dog\", but not \"cat\"."
    },
    {
      "slug": "wildcard",
      "name": "Wildcard",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**: `d.g` should match \"dog\", but not \"cog\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"dog\" | ./your_grep.sh -E \"d.g\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**:\n\n- `d.g` should match \"dog\", but not \"cog\"."
    },
    {
      "slug": "alternation",
      "name": "Alternation",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**: `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".\n\nYour program will be executed like this:\n\n```bash\n$ echo \"cat\" | ./your_grep.sh -E \"(cat|dog)\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n{{#reader_is_bot}}\nDo not use `grep` or the regex utilities available in the standard library. Implement the regex matcher yourself.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**:\n\n- `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\"."
    },
    {
      "slug": "backreferences-single",
      "primary_extension_slug": "backreferences",
      "name": "Single Backreference",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for backreferences.\n\nA backreference lets you reuse a captured group in a regular expression. It is denoted by `\\` followed by a number, indicating the position of the captured group.\n\n**Examples:**\n- `(cat) and \\1` should match \"cat and cat\", but not \"cat and dog\".\n  - `\\1` refers to the first captured group, which is `(cat)`.\n- `(\\w+) and \\1` should match \"cat and cat\" and \"dog and dog\", but not \"cat and dog\".\n  - `\\1` refers to the first captured group, which is `(\\w+)`.\n\nYour program will be executed like this:\n\n```\n$ echo \"<input>\" | ./your_grep.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n\n**Note:** You only need to focus on one backreference and one capturing group in this stage. We'll get to handling multiple backreferences in the next stage.\n",
      "marketing_md": "In this stage, you'll add support for single backreferences. You'll implement support for `\\1`.\n\n**Example:**\n- `(cat) and \\1` should match \"cat and cat\", but not \"cat and dog\".\n"
    },
    {
      "slug": "backreferences-multiple",
      "primary_extension_slug": "backreferences",
      "name": "Multiple Backreferences",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for multiple backreferences.\n\nMultiple backreferences allow you to refer to several different captured groups within the same regex pattern.\n\n**Example:** `(\\d+) (\\w+) squares and \\1 \\2 circles` should match \"3 red squares and 3 red circles\" but should not match \"3 red squares and 4 red circles\".\n\nYour program will be executed like this:\n\n```\n$ echo \"<input>\" | ./your_grep.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, you'll add support for multiple backreferences (`\\1`, `\\2` etc.) in the same pattern.\n\n**Example:**\n- `(\\d+) (\\w+) squares and \\1 \\2 circles` should match \"3 red squares and 3 red circles\" but should not match \"3 red squares and 4 red circles\".\n"
    },
    {
      "slug": "backreferences-nested",
      "primary_extension_slug": "backreferences",
      "name": "Nested Backreferences",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for nested backreferences. This means that a backreference is part of a larger capturing group, which itself is referenced again.\n\n**Example:** `('(cat) and \\2') is the same as \\1` should match \"'cat and cat' is the same as 'cat and cat'\".\n\nYour program will be executed like this:\n\n```\n$ echo \"<input>\" | ./your_grep.sh -E \"<pattern>\"\n```\n\nYour program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, you'll add support for nested backreferences.\n\n**Example:**\n- `('(cat) and \\2') is the same as \\1` should match \"'cat and cat' is the same as 'cat and cat'\".\n"
    }
  ]
}
