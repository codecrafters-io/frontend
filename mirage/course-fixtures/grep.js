export default {
  "slug": "grep",
  "name": "Build your own grep",
  "short_name": "grep",
  "release_status": "alpha",
  "description_md": "In this challenge you'll build your own implementation of [`grep`](https://en.wikipedia.org/wiki/Grep) \nthat can parse and evaluate [regular expressions](https://en.wikipedia.org/wiki/Regular_expression). Along the way \nwe'll learn about Regex syntax, how parsers/lexers work, and how regular expressions are evaluated.\n",
  "short_description_md": "Learn how regular expressions work, including character classes, quantifiers and more\n",
  "completion_percentage": 30,
  "early_access_languages": [],
  "supported_languages": [
    "python"
  ],
  "starter_repos": {
    "python": "https://github.com/codecrafters-io/grep-starter-python"
  },
  "marketing": {
    "difficulty": "medium",
    "testimonials": []
  },
  "stages": [
    {
      "slug": "init",
      "name": "Match a literal character",
      "difficulty": "very_easy",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll handle the simplest regex possible: a single character. \n\n**Example:**\n\n`a` should match \"apple\", but not \"dog\".\n"
    },
    {
      "slug": "match_digit",
      "name": "Match digits",
      "difficulty": "very_easy",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll implement support for the `\\d` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\d` matches any digit. \n\n**Example:**\n\n`\\d` should match \"1\", but not \"a\".\n"
    },
    {
      "slug": "match_alphanumeric",
      "name": "Match alphanumeric characters",
      "difficulty": "very_easy",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll implement support for the `\\w` \n[character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes).\n\n`\\w` matches any alphanumeric character (`a-z`, `A-Z`, `0-9`, `_`).\n\n**Example:**\n\n`\\w` should match \"foo101\", but not \"$!?\".\n"
    },
    {
      "slug": "positive_character_groups",
      "name": "Positive Character Groups",
      "difficulty": "medium",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for [positive character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#positive-character-group--).\n\nPositive character groups match any character that is present within a pair of square brackets.\n\n**Example:**\n\n`[abc]` should match \"apple\", but not \"dog\".\n"
    },
    {
      "slug": "negative_character_groups",
      "name": "Negative Character Groups",
      "difficulty": "medium",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for [negative character groups](https://docs.microsoft.com/en-us/dotnet/standard/base-types/character-classes-in-regular-expressions#negative-character-group-).\n\nPositive character groups match any character that is not present within a pair of square brackets.\n\n**Example:**\n\n`[^abc]` should match \"dog\", but not \"apple\" (since it contains \"a\").\n"
    },
    {
      "slug": "start_of_string_anchor",
      "name": "Start of string anchor",
      "difficulty": "medium",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for `^`, the [Start of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-). \n\n`^` doesn't match a character, it matches the start of a line.\n\n**Example:**\n\n`^log` should match \"log\", but not \"slog\".\n"
    },
    {
      "slug": "end_of_string_anchor",
      "name": "End of string anchor",
      "difficulty": "medium",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for `$`, the [End of String or Line anchor](https://docs.microsoft.com/en-us/dotnet/standard/base-types/anchors-in-regular-expressions#start-of-string-or-line-).\n\n`$` doesn't match a character, it matches the end of a line.\n\n**Example:**\n\n`dog$` should match \"dog\", but not \"dogs\".\n"
    },
    {
      "slug": "one_or_more_quantifier",
      "name": "Match one or more times",
      "difficulty": "hard",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for `+`, the [one or more](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier.\n\n**Example**: \n\n- `a+` should match \"apple\" and \"SaaS\", but not \"dog\".\n"
    },
    {
      "slug": "zero_or_one_quantifier",
      "name": "Match zero or one times",
      "difficulty": "hard",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for `?`, the [zero or one](https://docs.microsoft.com/en-us/dotnet/standard/base-types/quantifiers-in-regular-expressions#match-one-or-more-times-) quantifier (also known as the \"optional\" quantifier).\n\n**Example**: \n\n- `dogs?` should match \"dogs\" and \"dog\", but not \"cat\".\n"
    },
    {
      "slug": "wildcard",
      "name": "Wildcard",
      "difficulty": "medium",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for `.`, which matches any character.\n\n**Example**: \n\n- `d.g` should match \"dog\", but not \"cog\".\n"
    },
    {
      "slug": "alternation",
      "name": "Alternation",
      "difficulty": "hard",
      "description_md": "TBD.\n",
      "marketing_md": "In this stage, we'll add support for the `|` keyword, which allows combining multiple patterns in an either/or fashion.\n\n**Example**: \n\n- `(cat|dog)` should match \"dog\" and \"cat\", but not \"apple\".\n"
    }
  ]
}
