export default {
  "slug": "grep",
  "name": "Build your own grep",
  "definition_repository_full_name": "codecrafters-io/build-your-own-grep",
  "short_name": "grep",
  "release_status": "beta",
  "description_md": "[Regular expressions](https://en.wikipedia.org/wiki/Regular_expression) (Regexes, for short) are patterns used to \nmatch character combinations in strings. [`grep`](https://en.wikipedia.org/wiki/Grep) is a CLI tool for searching \nusing Regexes.\n\nIn this challenge you'll build your own implementation of `grep`. Along the way we'll learn about Regex syntax and \nhow Regexes are evaluated.\n",
  "short_description_md": "Learn how regular expressions work, including character classes, quantifiers and more\n",
  "completion_percentage": 30,
  "languages": [
    {
      "slug": "python",
      "starter_repository_url": "https://github.com/codecrafters-io/grep-starter-python"
    },
    {
      "slug": "rust",
      "starter_repository_url": "https://github.com/codecrafters-io/grep-starter-rust"
    },
    {
      "slug": "go",
      "starter_repository_url": "https://github.com/codecrafters-io/grep-starter-go"
    },
    {
      "slug": "haskell",
      "starter_repository_url": "https://github.com/codecrafters-io/grep-starter-haskell",
      "release_status": "beta"
    },
    {
      "slug": "ruby",
      "starter_repository_url": "https://github.com/codecrafters-io/grep-starter-ruby",
      "release_status": "alpha",
      "alpha_tester_usernames": [
        "rohitpaulk",
        "sreeram-venkitesh"
      ]
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
        "text": "I think the instant feedback right there in the git push is really cool.\nDidn't even know that was possible!\n"
      }
    ]
  },
  "stages": [
    {
      "slug": "init",
      "name": "Match a literal character",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll handle the simplest regex possible: a single character. \n\n**Example:** `a` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"a\"\n```\n\nThe `-E` flag instructs `grep` to interprets patterns as extended regular expressions (with support \nfor metacharacters like `+`, `?` etc.). We'll use this flag in all stages.\n\nYou program must [exit](https://en.wikipedia.org/wiki/Exit_status) with 0 if the character is found, and 1 if not.\n",
      "marketing_md": "In this stage, we'll handle the simplest regex possible: a single character. \n\n**Example:**\n\n`a` should match \"apple\", but not \"dog\".\n"
    },
    {
      "slug": "match_digit",
      "name": "Match digits",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll implement support for the `\\d` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit. \n\n**Example:** `\\d` should match \"3\", but not \"c\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"apple123\" | ./your_grep.sh -E \"\\d\"\n```\n\nYou program must exit with 0 if a digit is found in the string, and 1 if not.\n",
      "marketing_md": "In this stage, we'll implement support for the `\\d` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit. \n\n**Example:**\n\n`\\d` should match \"1\", but not \"a\".\n"
    },
    {
      "slug": "match_alphanumeric",
      "name": "Match alphanumeric characters",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll implement support for the `\\w` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`, `_`).\n\n**Example:** `\\w` should match \"foo101\", but not \"$!?\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"alpha-num3ric\" | ./your_grep.sh -E \"\\w\"\n```\n\nYou program must exit with 0 if an alphanumeric character is found in the string, and 1 if not.\n",
      "marketing_md": "In this stage, we'll implement support for the `\\w` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`, `_`).\n\n**Example:**\n\n`\\w` should match \"foo101\", but not \"$!?\".\n"
    },
    {
      "slug": "positive_character_groups",
      "name": "Positive Character Groups",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:** `[abc]` should match \"apple\", but not \"dog\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"[abc]\"\n```\n\nYou program must exit with 0 if an any of the characters are found in the string, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:**\n\n`[abc]` should match \"apple\", but not \"dog\".\n"
    },
    {
      "slug": "negative_character_groups",
      "name": "Negative Character Groups",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:** `[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\").\n\nYour program will be executed like this: \n\n```bash\n$ echo \"apple\" | ./your_grep.sh -E \"[^abc]\"\n```\n\nYou program must exit with 0 if the input contains characters that aren't part of the negative character group, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:**\n\n`[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\").\n"
    },
    {
      "slug": "combining_character_classes",
      "name": "Combining Character Classes",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for patterns that combine the character classes we've seen so far. \n\nThis is where your regex matcher will start to _feel_ useful. \n\nKeep in mind that this stage is harder than the previous ones. You'll likely need to rework your \nimplementation to process user input character-by-character instead of the whole line at once. \n\nWe recommend taking a look at the example code in [\"A Regular Expression Matcher\"](https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautiful.html) \nby Rob Pike to guide your implementation.\n\n**Examples:** \n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nYour program will be executed like this: \n\n```bash\n$ echo \"1 apple\" | ./your_grep.sh -E \"\\d apple\"\n```\n\nYou program must exit with 0 if the pattern matches the input, and 1 if not.\n",
      "marketing_md": "In this stage, we'll support patterns that combine the character classes we've seen so far. \n\n**Examples:** \n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nThis stage is significantly harder than the previous ones. You'll likely need to rework your \nimplementation to process user input character-by-character instead of the whole line at once.\n"
    },
    {
      "slug": "start_of_string_anchor",
      "name": "Start of string anchor",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-). \n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:** `^log` should match \"log\", but not \"slog\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"log\" | ./your_grep.sh -E \"^log\"\n```\n\nYou program must exit with 0 if the input starts with the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-). \n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:**\n\n`^log` should match \"log\", but not \"slog\".\n"
    },
    {
      "slug": "end_of_string_anchor",
      "name": "End of string anchor",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:** `dog$` should match \"dog\", but not \"dogs\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"dog\" | ./your_grep.sh -E \"dog$\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:**\n\n`dog$` should match \"dog\", but not \"dogs\".\n"
    },
    {
      "slug": "one_or_more_quantifier",
      "name": "Match one or more times",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**: `a+` should match \"apple\" and \"SaaS\", but not \"dog\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"caats\" | ./your_grep.sh -E \"ca+ts\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**: \n\n- `a+` should match \"apple\" and \"SaaS\", but not \"dog\".\n"
    },
    {
      "slug": "zero_or_one_quantifier",
      "name": "Match zero or one times",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for `?`, the [zero or one](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**: `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"dogs\" | ./your_grep.sh -E \"dogs?\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for `?`, the [zero or one](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**: \n\n- `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".\n"
    },
    {
      "slug": "wildcard",
      "name": "Wildcard",
      "difficulty": "medium",
      "description_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**: `d.g` should match \"dog\", but not \"cog\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"dog\" | ./your_grep.sh -E \"d.g\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**: \n\n- `d.g` should match \"dog\", but not \"cog\".\n"
    },
    {
      "slug": "alternation",
      "name": "Alternation",
      "difficulty": "hard",
      "description_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**: `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".\n\nYour program will be executed like this: \n\n```bash\n$ echo \"cat\" | ./your_grep.sh -E \"(cat|dog)\"\n```\n\nYou program must exit with 0 if the input matches the given pattern, and 1 if not.\n",
      "marketing_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**: \n\n- `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".\n"
    }
  ]
}
