export default {
  "slug": "dummy",
  "name": "Build your own Dummy",
  "short_name": "dummy",
  "release_status": "live",
  "description_md": "Add a description for your course here.",
  "short_description_md": "Add a short description for your course here.",
  "completion_percentage": 15,
  "languages": [
    {
      "slug": "go"
    },
    {
      "slug": "python"
    },
    {
      "slug": "rust"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "My course extension idea",
    "sample_extension_idea_description": "A description for my course extension idea",
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
      "slug": "ext1",
      "name": "Extension 1",
      "description_markdown": "In this challenge extension you'll add [persistence][redis-persistence] support to your Redis implementation.\n\nAlong the way you'll learn about Redis's [RDB file format][rdb-file-format], the [SAVE][save-command] command, and more.\n\n[redis-persistence]: https://redis.io/docs/manual/persistence/\n[rdb-file-format]: https://github.com/sripathikrishnan/redis-rdb-tools/blob/548b11ec3c81a603f5b321228d07a61a0b940159/docs/RDB_File_Format.textile\n[save-command]: https://redis.io/commands/save/"
    },
    {
      "slug": "ext2",
      "name": "Extension 2",
      "description_markdown": "In this challenge extension you'll add support for the [Stream][redis-streams-data-type] data type to your Redis implementation.\n\nAlong the way you'll learn about commands like [XADD][xadd-command], [XRANGE][xrange-command] and more.\n\n[redis-streams-data-type]: https://redis.io/docs/data-types/streams/\n[xadd-command]: https://redis.io/commands/xadd/\n[xrange-command]: https://redis.io/commands/xrange/"
    }
  ],
  "stages": [
    {
      "slug": "init",
      "name": "The first stage",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.\n\nHere's a sample table:\n\n| Column 1 Header | Column 2 Header | Column 3 Header |\n| --------------- | --------------- | --------------- |\n| Row 1, Col 1    | Row 1, Col 2    | Row 1, Col 3    |\n| Row 2, Col 1    | Row 2, Col 2    | Row 2, Col 3    |\n| Row 3, Col 1    | Row 3, Col 2    | Row 3, Col 3    |\n\nAnd a new edit that must be synced automatically",
      "marketing_md": "In this stage, we'll do XYZ."
    },
    {
      "slug": "second",
      "name": "The second stage",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.",
      "marketing_md": "In this stage, we'll do XYZ."
    },
    {
      "slug": "ext1-stage1",
      "primary_extension_slug": "ext1",
      "name": "Start with ext1",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.",
      "marketing_md": "In this stage, we'll do XYZ."
    },
    {
      "slug": "ext1-stage2",
      "primary_extension_slug": "ext1",
      "name": "Finish with ext1",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.",
      "marketing_md": "In this stage, we'll do XYZ."
    },
    {
      "slug": "ext2-stage1",
      "primary_extension_slug": "ext2",
      "name": "Start with ext2",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.",
      "marketing_md": "In this stage, we'll do XYZ."
    },
    {
      "slug": "ext2-stage2",
      "primary_extension_slug": "ext2",
      "secondary_extension_slugs": [
        "ext1"
      ],
      "name": "Finish with ext1 + ext2",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll do XYZ\n\n**Example:** ABC\n\nYour program will be executed like this:\n\n```bash\n$ echo \"apple\" | ./your_executable.sh -E \"a\"\n```\n\nYou program must ABCD.",
      "marketing_md": "In this stage, we'll do XYZ."
    }
  ]
}
