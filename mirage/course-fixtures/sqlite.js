export default {
  "slug": "sqlite",
  "name": "Build your own SQLite",
  "release_status": "beta",
  "description_md": "In this challenge, you'll build a barebones SQLite implementation that supports\nbasic SQL queries like SELECT. Along the way you'll learn about SQLite's\n[file format](https://sqlite.org/fileformat.html), how indexed data is\nstored in B-trees and more.\n",
  "short_description_md": "Learn about parsing SQL syntax, SQLite's file format, how indexed data is stored in B-trees and more\n",
  "completion_percentage": 5,
  "supported_languages": [
    "python",
    "go",
    "javascript"
  ],
  "early_access_languages": [
    "rust"
  ],
  "starter_repos": {
    "go": "https://github.com/codecrafters-io/sqlite-starter-go",
    "javascript": "https://github.com/codecrafters-io/sqlite-starter-javascript",
    "python": "https://github.com/codecrafters-io/sqlite-starter-python",
    "rust": "https://github.com/codecrafters-io/sqlite-starter-rust"
  },
  "marketing": {
    "description": "Learn about SQLite's file format, how indexed data is stored in B-trees and more.",
    "difficulty": "hard",
    "introduction_md": "In this challenge, you'll build a barebones SQLite implementation that supports\nbasic SQL queries like SELECT. Along the way you'll learn about SQLite's\n[file format](https://sqlite.org/fileformat.html), how indexed data is\nstored in B-trees and more.\n",
    "testimonials": [
      {
        "author_name": "Ananthalakshmi Sankar",
        "author_description": "Automation Team, Apple",
        "author_avatar": "https://codecrafters.io/images/testimonials/ananthalakshmi_sankar.jpeg",
        "link": "https://github.com/anu294",
        "text": "There are few sites I like as much that have a step by step guide. The real-time feedback is so good, it's creepy!\n"
      },
      {
        "author_name": "Pranjal Paliwal",
        "author_description": "Software Engineer, Headout",
        "author_avatar": "https://codecrafters.io/images/testimonials/pranjal_paliwal.jpeg",
        "link": "https://github.com/betterclever",
        "text": "Enjoying programming all over again. It's been a while since I wrote Rust, but getting a good hang of it.\n"
      }
    ]
  },
  "stages": [
    {
      "slug": "init",
      "name": "Print number of tables",
      "difficulty": "very_easy",
      "description_md": "In this stage, you'll implement one of SQLite's\n[dot-commands](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_): `.dbinfo`. This\ncommand prints metadata about a SQLite database file.\n\nThe command is executed like this:\n\n```\n$ sqlite3 sample.db .dbinfo\n```\n\nIt prints output in this format:\n\n```\ndatabase page size:  4096\nwrite format:        1\nread format:         1\n\n...\n\nnumber of tables:    5\nschema size:         330\ndata version:        1\n```\n\nWe're only going to focus on one of these values: `number of tables`. To find the number of tables, you'll need\nto count the number of rows in the\n[`sqlite_schema`](https://www.sqlite.org/fileformat.html#storage_of_the_sql_database_schema) table.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db .dbinfo\n```\n\nand here's the output it expects:\n\n```\nnumber of tables: 2\n```\n",
      "marketing_md": "In this stage, you'll implement one of SQLite's\n[dot-commands](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_): `.dbinfo`. This command\nprints metadata related a SQLite database, and you'll implement one of these values: the number of\ntables. You'll do this by parsing a file that uses the\n[SQLite database file format](https://www.sqlite.org/fileformat.html).\n"
    },
    {
      "slug": "table_names",
      "name": "Print table names",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement another dot-command:\n[`.tables`](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_).\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db .tables\n```\n\nand here's the output it expects:\n\n```\napples   oranges\n```\n\nNotice how the table names are formatted with more than one space between each other? That's because `sqlite3`\nformats its output so that every value has a fixed-width. Your program doesn't need to mimic this behaviour. Using\njust one space as a separator should work. Both `apples oranges` and <code>apples &nbsp; oranges</code> will pass\nour tests.\n",
      "marketing_md": "In this stage, you'll implement another dot-command:\n[`.tables`](https://www.sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_). Instead of just printing\nthe count of tables like in the previous stage, you'll print out the names of tables too.\n"
    },
    {
      "slug": "row_counts",
      "name": "Count rows in a table",
      "difficulty": "medium",
      "description_md": "Now that you've gotten your feet wet with the [SQLite database file format](https://www.sqlite.org/fileformat.html),\nit's time to move on to actual SQL!\n\nIn this stage, your program will need to read the count of rows from a table.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db \"SELECT COUNT(*) FROM apples\"\n```\n\nand here's the output it expects:\n\n```\n4\n```\n\nYou'll need to read the table's row from the [`sqlite_schema`](https://www.sqlite.org/schematab.html) table and\nfollow the `rootpage` value to visit the page corresponding to the table. For now you can assume that the contents\nof the table are small enough to fit inside the root page. We'll deal with tables that span multiple pages in\nstage 7.\n\nRemember: You don't need to implement a full-blown SQL parser just yet. We'll get to that in the\nnext stages. For now you can just split the input by \" \" and pick the last item to get the table name.\n",
      "marketing_md": "Now that you've gotten your feet wet with the [SQLite database file format](https://www.sqlite.org/fileformat.html),\nit's time to move on to actual SQL!\nIn this stage, your sqlite3 implementation will need to execute a SQL statement of this form:\n`SELECT COUNT(*) FROM <table>`.\n"
    },
    {
      "slug": "read_single_column",
      "name": "Read data from a single column",
      "difficulty": "hard",
      "description_md": "Now that you're comfortable with jumping across database pages, let's dig a little deeper and read data from\nrows in a table.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db \"SELECT name FROM apples\"\n```\n\nand here's the output it expects:\n\n```\nGranny Smith\nFuji\nHoneycrisp\nGolden Delicious\n```\n\nThe order of rows returned doesn't matter.\n\nRows are stored on disk in the [Record Format](https://www.sqlite.org/fileformat.html#record_format), which is\njust an ordered sequence of values. To extract data for a single column, you'll need to know the order of that\ncolumn in the sequence. You'll need to parse the table's `CREATE TABLE` statement to do this. The `CREATE TABLE`\nstatement is stored in the [`sqlite_schema`](https://www.sqlite.org/schematab.html) table's `sql` column.\n\n{{#lang_is_python}}\nNot interested in implementing a SQL parser from scratch? [`sqlparse`](https://pypi.org/project/sqlparse/)\nis available as a dependency if you'd like to use it.\n{{/lang_is_python}}\n{{#lang_is_go}}\nNot interested in implementing a SQL parser from scratch? [`pingcap/parser`](https://github.com/pingcap/parser)\nis available as a dependency if you'd like to use it.\n{{/lang_is_go}}\n{{#lang_is_rust}}\nNot interested in implementing a SQL parser from scratch? The [`nom`](https://crates.io/crates/nom),\n[`peg`](https://crates.io/crates/peg) and [`regex`](https://crates.io/crates/regex) crates are available in\n`Cargo.toml` if you'd like to use them.\n{{/lang_is_rust}}\n",
      "marketing_md": "In this stage, your sqlite3 implementation will need to execute a SQL statement of this form:\n`SELECT <column> FROM <table>`.\n"
    },
    {
      "slug": "read_multiple_columns",
      "name": "Read data from multiple columns",
      "difficulty": "hard",
      "description_md": "This stage is similar to the previous one, just that the tester will query for multiple columns instead of just\none.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db \"SELECT name, color FROM apples\"\n```\n\nand here's the output it expects:\n\n```\nGranny Smith|Light Green\nFuji|Red\nHoneycrisp|Blush Red\nGolden Delicious|Yellow\n```\n\nJust like in the previous stage, the order of rows doesn't matter.\n",
      "marketing_md": "This stage is similar to the previous one, just that you'll read data from multiple columns instead of just one.\nIn this stage, your sqlite3 implementation will need to execute a SQL statement of this form: `SELECT <column1>,<column2> FROM <table>`.\n"
    },
    {
      "slug": "where",
      "name": "Filter data with a WHERE clause",
      "difficulty": "hard",
      "description_md": "In this stage, you'll support filtering records using a `WHERE` clause.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh sample.db \"SELECT name, color FROM apples WHERE color = 'Yellow'\"\n```\n\nand here's the output it expects:\n\n```\nGolden Delicious|Yellow\n```\n\nFor now you can assume that the contents of the table are small enough to fit inside the root page. We'll deal\nwith tables that span multiple pages in the next stage.\n",
      "marketing_md": "In this stage, you'll filter records based on a `WHERE` clause. You'll assume that the query can't be served by\nan index, so you'll visit all records in a table and then filter out the matching ones.\n"
    },
    {
      "slug": "table_scan",
      "name": "Retrieve data using a full-table scan",
      "difficulty": "hard",
      "description_md": "Time to play with larger amounts of data!\n\nIn this stage you'll deal with the same syntax as before: a query with a `WHERE` clause. However, this time, the\ntable you'll be querying will be larger and it'll span multiple pages.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh superheroes.db \"SELECT id, name FROM superheroes WHERE eye_color = 'Pink Eyes'\"\n```\n\nand here's the output it expects:\n\n```\n297|Stealth (New Earth)\n790|Tobias Whale (New Earth)\n1085|Felicity (New Earth)\n2729|Thrust (New Earth)\n3289|Angora Lapin (New Earth)\n3913|Matris Ater Clementia (New Earth)\n```\n\nThe tester is going to use a sample database of superheroes that is ~1MB in size. You can download a small\nversion of this to test locally, read the **Sample Databases** section in [the README]({{readme_url}}).\n\nYou'll need to traverse a [B-tree](https://en.wikipedia.org/wiki/B-tree) in this stage. If you're unfamiliar with\nhow B-trees work or just need a refresher, Vaidehi Joshi's\n[Busying Oneself With B-Trees](https://medium.com/basecs/busying-oneself-with-b-trees-78bbf10522e7) is a good place to\nstart. For specifics on how SQLite stores B-trees on disk, read the\n[B-tree Pages](https://www.sqlite.org/fileformat.html#b_tree_pages) documentation section.\n",
      "marketing_md": "In this stage, you'll filter records based on a `WHERE` clause. You'll assume that the query can't be served by\nan index, so you'll visit all records in a table and then filter out the matching ones.\n"
    },
    {
      "slug": "index_scan",
      "name": "Retrieve data using an index",
      "difficulty": "hard",
      "description_md": "In this stage, we'll implement an index scan. Rather than reading _all_ rows in a table and then filtering\nin-memory, we'll use an index to perform a more intelligent search.\n\nTo test whether your implementation actually uses an index, the tester will use a database is ~1GB in size and\nexpect your program to return query results in less than 3 seconds.\n\nThe test database contains a `companies` table with an index named `idx_companies_country` on the\n`country` column.\n\nYou can download a small version of this database to test locally, read the **Sample Databases** section in\n[the README]({{readme_url}}) for details.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_sqlite3.sh companies.db \"SELECT id, name FROM companies WHERE country = 'eritrea'\"\n```\n\nand here's the output it expects:\n\n```\n121311|unilink s.c.\n2102438|orange asmara it solutions\n5729848|zara mining share company\n6634629|asmara rental\n```\n\nYou can assume that all queries run by the tester will include `country` in the `WHERE` clause,\nso they can be served by the index. The tester will run multiple randomized queries and expect all of them\nto return results in under 3 seconds.\n",
      "marketing_md": "This stage is similar to the previous one, but focuses on enhancing query performance using an index. In this\nstage, your program will need to read through millions of rows in under 5 seconds."
    }
  ]
}
