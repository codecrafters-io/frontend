export default {
  "slug": "sqlite",
  "name": "Build your own SQLite",
  "short_name": "SQLite",
  "release_status": "live",
  "description_md": "SQLite is a popular SQL database engine. In this challenge, you'll build your own version of SQLite\nthat is capable of reading a SQLite database file and answering basic SQL queries like SELECT and using indexes.\n\nAlong the way, you'll learn about the SQLite file format, SQL syntax and more.",
  "short_description_md": "Learn about SQL syntax, SQLite's file format, B-trees and more",
  "completion_percentage": 5,
  "languages": [
    {
      "slug": "c"
    },
    {
      "slug": "clojure"
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
    },
    {
      "slug": "swift",
      "release_status": "alpha",
      "alpha_tester_usernames": [
        "Terky"
      ]
    }
  ],
  "marketing": {
    "difficulty": "hard",
    "sample_extension_idea_title": "Transactions",
    "sample_extension_idea_description": "A SQLite implementation that can handle atomic transactions using a write-ahead log (WAL) file",
    "testimonials": [
      {
        "author_name": "Ananthalakshmi Sankar",
        "author_description": "Automation Team, Apple",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/oxta.jpeg",
        "link": "https://github.com/anu294",
        "text": "There are few sites I like as much that have a step by step guide. The real-time feedback is so good, it's creepy!"
      },
      {
        "author_name": "Pranjal Paliwal",
        "author_description": "Software Engineer, Headout",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/pranjal-paliwal.jpeg",
        "link": "https://github.com/betterclever",
        "text": "Enjoying programming all over again. It's been a while since I wrote Rust, but getting a good hang of it."
      }
    ]
  },
  "stages": [
    {
      "slug": "dr6",
      "name": "Print page size",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll implement one of SQLite's\n[dot-commands](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_): `.dbinfo`. This command\nprints metadata related a SQLite database, and you'll implement one of these values: the database page size. You'll\ndo this by parsing a file that uses the [SQLite database file format](https://www.sqlite.org/fileformat.html)."
    },
    {
      "slug": "ce0",
      "name": "Print number of tables",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll extend support for the .dbinfo command added in the previous stage. Specifically, you'll\nimplement functionality to print the number of tables. You'll do this by parsing a file that uses the\n[SQLite database file format](https://www.sqlite.org/fileformat.html)."
    },
    {
      "slug": "sz4",
      "name": "Print table names",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll implement another dot-command:\n[`.tables`](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_). Instead of just printing\nthe count of tables like in the previous stage, you'll print out the names of tables too."
    },
    {
      "slug": "nd9",
      "name": "Count rows in a table",
      "difficulty": "medium",
      "marketing_md": "Now that you've gotten your feet wet with the [SQLite database file format](https://www.sqlite.org/fileformat.html),\nit's time to move on to actual SQL!\nIn this stage, your sqlite3 implementation will need to execute a SQL statement of this form:\n`SELECT COUNT(*) FROM <table>`."
    },
    {
      "slug": "az9",
      "name": "Read data from a single column",
      "difficulty": "hard",
      "marketing_md": "In this stage, your sqlite3 implementation will need to execute a SQL statement of this form:\n`SELECT <column> FROM <table>`."
    },
    {
      "slug": "vc9",
      "name": "Read data from multiple columns",
      "difficulty": "hard",
      "marketing_md": "This stage is similar to the previous one, just that you'll read data from multiple columns instead of just one.\nIn this stage, your sqlite3 implementation will need to execute a SQL statement of this form: `SELECT <column1>,<column2> FROM <table>`."
    },
    {
      "slug": "rf3",
      "name": "Filter data with a WHERE clause",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll filter records based on a `WHERE` clause. You'll assume that the query can't be served by\nan index, so you'll visit all records in a table and then filter out the matching ones."
    },
    {
      "slug": "ws9",
      "name": "Retrieve data using a full-table scan",
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll filter records based on a `WHERE` clause. You'll assume that the query can't be served by\nan index, so you'll visit all records in a table and then filter out the matching ones."
    },
    {
      "slug": "nz8",
      "name": "Retrieve data using an index",
      "difficulty": "hard",
      "marketing_md": "This stage is similar to the previous one, but focuses on enhancing query performance using an index. In this\nstage, your program will need to read through millions of rows in under 5 seconds."
    }
  ]
}
