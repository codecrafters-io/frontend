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
      "slug": "c"
    },
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
      "slug": "ruby"
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
      "slug": "printing-matches",
      "name": "Printing Matches",
      "description_markdown": "In this challenge extension, you'll add support for printing matching lines to your Grep implementation.\n\nAlong the way, you'll learn about extracting matched lines, formatting output, and managing line-by-line processing.\n"
    },
    {
      "slug": "multiple-matches",
      "name": "Multiple Matches",
      "description_markdown": "In this challenge extension, you'll add support for printing the multiple matching results to your Grep implementation.\n\nAlong the way, you'll learn about how to implement the `-o` flag.\n"
    },
    {
      "slug": "highlighting",
      "name": "Highlighting",
      "description_markdown": "In this challenge extension, you'll add support for [highlighting][1] to your Grep implementation.\n\nAlong the way, you'll learn about [ANSI escape codes][2], and more.\n\n[1]: https://linuxcommando.blogspot.com/2007/10/grep-with-color-output.html\n[2]: https://en.wikipedia.org/wiki/ANSI_escape_code\n"
    },
    {
      "slug": "file-search",
      "name": "File Search",
      "description_markdown": "In this challenge extension, you'll add support for searching files.\n\nAlong the way, you'll learn about how to implement efficient file I/O, directory traversal and pattern matching on file contents.\n"
    },
    {
      "slug": "quantifiers",
      "name": "Quantifiers",
      "description_markdown": "In this challenge extension, you'll add support for [quantifiers][1] to your Grep implementation.\n\nAlong the way, you'll learn about how to implement the `*` quantifier (zero or more), and bounded quantifiers.\n[1]: https://learn.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions\n"
    },
    {
      "slug": "backreferences",
      "name": "Backreferences",
      "description_markdown": "In this challenge extension, you'll add support for [backreferences][1] to your Grep implementation.\n\nAlong the way, you'll learn about how capture groups and backreferences work.\n[1]: https://learn.microsoft.com/en-us/dotnet/standard/base-types/backreference-constructs-in-regular-expressions#numbered-backreferences\n"
    }
  ],
  "stages": [
    {
      "slug": "cq2",
      "name": "Match a literal character",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll handle the simplest regex possible: a single character.\n\n**Example:**\n\n`a` should match \"apple\", but not \"dog\"."
    },
    {
      "slug": "oq2",
      "name": "Match digits",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll implement support for the `\\d`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit.\n\n**Example:**\n\n`\\d` should match \"1\", but not \"a\"."
    },
    {
      "slug": "mr9",
      "name": "Match word characters",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, we'll implement support for the `\\w`\n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`) and underscore `_`.\n\n**Example:**\n\n`\\w` should match \"foo101\", but not \"$!?\"."
    },
    {
      "slug": "tl6",
      "name": "Positive Character Groups",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:**\n\n`[abc]` should match \"apple\", but not \"dog\"."
    },
    {
      "slug": "rk3",
      "name": "Negative Character Groups",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nNegative character groups match any character that is not present within a pair of square brackets.\n\n**Example:**\n\n`[^abc]` should match \"dog\", but not \"cab\" (since all characters are either \"a\", \"b\" or \"c\")."
    },
    {
      "slug": "sh9",
      "name": "Combining Character Classes",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll support patterns that combine the character classes we've seen so far.\n\n**Examples:**\n\n- `\\d apple` should match \"1 apple\", but not \"1 orange\".\n- `\\d\\d\\d apple` should match \"100 apples\", but not \"1 apple\".\n- `\\d \\w\\w\\ws` should match \"3 dogs\" and \"4 cats\" but not \"1 dog\" (because the \"s\" is not present at the end).\n\nThis stage is significantly harder than the previous ones. You'll likely need to rework your\nimplementation to process user input character-by-character instead of the whole line at once."
    },
    {
      "slug": "rr8",
      "name": "Start of string anchor",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:**\n\n`^log` should match \"log\", but not \"slog\"."
    },
    {
      "slug": "ao7",
      "name": "End of string anchor",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://learn.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#end-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:**\n\n`dog$` should match \"dog\", but not \"dogs\"."
    },
    {
      "slug": "fz7",
      "name": "Match one or more times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**:\n\n- `a+` should match \"apple\" and \"SaaS\", but not \"dog\"."
    },
    {
      "slug": "ny8",
      "name": "Match zero or one times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `?`, the [zero or one](https://learn.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-zero-or-one-time-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**:\n\n- `dogs?` should match \"dogs\" and \"dog\", but not \"cat\"."
    },
    {
      "slug": "zb3",
      "name": "Wildcard",
      "difficulty": "medium",
      "marketing_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**:\n\n- `d.g` should match \"dog\", but not \"cog\"."
    },
    {
      "slug": "zm7",
      "name": "Alternation",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**:\n\n- `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\"."
    },
    {
      "slug": "sb5",
      "primary_extension_slug": "backreferences",
      "name": "Single Backreference",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for single backreferences. You'll implement support for `\\1`.\n\n**Example:**\n- `(cat) and \\1` should match \"cat and cat\", but not \"cat and dog\".\n"
    },
    {
      "slug": "tg1",
      "primary_extension_slug": "backreferences",
      "name": "Multiple Backreferences",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for multiple backreferences (`\\1`, `\\2` etc.) in the same pattern.\n\n**Example:**\n- `(\\d+) (\\w+) squares and \\1 \\2 circles` should match \"3 red squares and 3 red circles\" but should not match \"3 red squares and 4 red circles\".\n"
    },
    {
      "slug": "xe5",
      "primary_extension_slug": "backreferences",
      "name": "Nested Backreferences",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for nested backreferences.\n\n**Example:**\n- `('(cat) and \\2') is the same as \\1` should match \"'cat and cat' is the same as 'cat and cat'\".\n"
    },
    {
      "slug": "dr5",
      "primary_extension_slug": "file-search",
      "name": "Search a single-line file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of a file with a single line."
    },
    {
      "slug": "ol9",
      "primary_extension_slug": "file-search",
      "name": "Search a multi-line file",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of a file with multiple lines."
    },
    {
      "slug": "is6",
      "primary_extension_slug": "file-search",
      "name": "Search multiple files",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for searching the contents of multiple files."
    },
    {
      "slug": "yx6",
      "primary_extension_slug": "file-search",
      "name": "Recursive search",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll add support for searching through files in a given directory and its subdirectories recursively with the -r flag."
    },
    {
      "slug": "ai9",
      "primary_extension_slug": "quantifiers",
      "name": "Match zero or more times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `*`, the [zero or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-zero-or-more-times-) quantifier."
    },
    {
      "slug": "wy9",
      "primary_extension_slug": "quantifiers",
      "name": "Match exactly n times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `{n}`, the [exact repetition](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-exactly-n-times-n) quantifier."
    },
    {
      "slug": "hk3",
      "primary_extension_slug": "quantifiers",
      "name": "Match at least n times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `{n,}`, the [at least m times](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-at-least-n-times-n) quantifier."
    },
    {
      "slug": "ug0",
      "primary_extension_slug": "quantifiers",
      "name": "Match between n and m times",
      "difficulty": "hard",
      "marketing_md": "In this stage, we'll add support for `{n,m}`, the [between n and m times](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-between-n-and-m-times-nm) quantifier."
    },
    {
      "slug": "ku5",
      "primary_extension_slug": "printing-matches",
      "name": "Print a single matching line",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for printing a single input line if it matches the pattern."
    },
    {
      "slug": "pz6",
      "primary_extension_slug": "printing-matches",
      "name": "Print multiple matching lines",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for printing multiple input lines if they match the pattern."
    },
    {
      "slug": "cj0",
      "primary_extension_slug": "multiple-matches",
      "name": "Print single match",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for printing a single matching text to your grep implementation."
    },
    {
      "slug": "ss2",
      "primary_extension_slug": "multiple-matches",
      "name": "Print multiple matches",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for printing multiple matching texts from a single line to your grep implementation."
    },
    {
      "slug": "bo4",
      "primary_extension_slug": "multiple-matches",
      "name": "Process multiple input lines",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for processing multiple input lines to print all matching texts."
    },
    {
      "slug": "bm2",
      "primary_extension_slug": "highlighting",
      "name": "Highlight a single match",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for highlighting a single match in your grep implementation."
    },
    {
      "slug": "eq0",
      "primary_extension_slug": "highlighting",
      "name": "Highlight multiple matches",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for highlighting multiple matches in your grep implementation."
    },
    {
      "slug": "wg2",
      "primary_extension_slug": "highlighting",
      "name": "Highlight matches in multiple lines",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for highlighting matches in multiple lines."
    },
    {
      "slug": "jk4",
      "primary_extension_slug": "highlighting",
      "name": "Disable highlighting",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll add support for disabling the highlighting in your grep implementation using the `never` coloring option."
    },
    {
      "slug": "na5",
      "primary_extension_slug": "highlighting",
      "name": "Implement the auto color option",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll add support for the `auto` color option in the `--color` flag of your grep implementation."
    }
  ]
}
