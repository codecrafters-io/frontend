export default {
  "slug": "git",
  "name": "Build your own Git",
  "short_name": "Git",
  "release_status": "live",
  "description_md": "Git is a version control system used to track changes in source code. In this challenge, you'll build your own Git implementation that\nis capable of cloning a public repository from GitHub.\n\nAlong the way, you'll learn about the .git directory, Git objects, plumbing commands and more.",
  "short_description_md": "Learn about git objects, plumbing commands and more",
  "completion_percentage": 10,
  "languages": [
    {
      "slug": "cpp"
    },
    {
      "slug": "go"
    },
    {
      "slug": "haskell"
    },
    {
      "slug": "javascript"
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
      "slug": "java",
      "release_status": "beta"
    }
  ],
  "marketing": {
    "difficulty": "hard",
    "sample_extension_idea_title": "Push to remote repository",
    "sample_extension_idea_description": "A Git implementation that can push changes to a remote repository",
    "testimonials": [
      {
        "author_name": "Beyang Liu",
        "author_description": "CTO, Sourcegraph",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/beyang-liu.jpeg",
        "link": "https://twitter.com/beyang/status/1271225214886506496",
        "text": "Found out about CodeCrafters from a colleague. It's a tutorial site that has you build your own version of things\nlike Git and Docker from scratch. A cool way to build a stronger mental model of how those tools work."
      },
      {
        "author_name": "Lacronicus",
        "author_description": "Reddit user",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/reddit-user.png",
        "link": "https://www.reddit.com/r/programming/comments/fefrka/advanced_programming_challenges/fjoxu7n/",
        "text": "Never in my life have I needed something so much and not known until I received it."
      }
    ]
  },
  "stages": [
    {
      "slug": "init",
      "name": "Initialize the .git directory",
      "difficulty": "very_easy",
      "description_md": "In this stage, you'll implement the `git init` command. This command\ninitializes a repository by creating a `.git` directory and some files\ninside it.\n\nYou can read more about what's inside the `.git` folder\n[here](http://gitready.com/advanced/2009/03/23/whats-inside-your-git-directory.html).\n\nFor the purposes of this challenge, you'll only need to create the bare\nminimum required for Git to function properly:\n\n```\n- .git/\n  - objects/\n  - refs/\n  - HEAD (should contain \"ref: refs/heads/master\\n\")\n```",
      "marketing_md": "In this stage, you'll implement the `git init` command. You'll initialize\na git repository by creating a `.git` directory and some files inside it.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_init.go#L12"
    },
    {
      "slug": "read_blob",
      "name": "Read a blob object",
      "difficulty": "medium",
      "description_md": "In this challenge, we'll deal with three [Git\nobjects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects):\n\n  - blobs\n  - trees\n  - commits\n\nLet's start with blobs, which represent files (binary data, to be\nprecise).\n\nIn this stage, you'll read a blob from your git repository by fetching its\ncontents from the `.git/objects` directory.\n\nYou'll do this using the first of multiple [\"plumbing\"\ncommands](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)\nwe'll encounter in this challenge: [`git\ncat-file`](https://git-scm.com/docs/git-cat-file).\n\nYour program will be called like so:\n\n```\n./your_git.sh cat-file -p <blob_sha>\n```\n\nIt is expected to print out the binary data that the blob contains.\n\nIn many programming languages the default print function (like [`fmt.Println`](https://pkg.go.dev/fmt#example-Println))\nwill append a newline to the output. The output of `cat-file` must not contain a\nnewline at the end, so you might need to use a different function to print the output.\n\n{{#lang_is_python}}\nKeep in mind that Git uses [Zlib](https://en.wikipedia.org/wiki/Zlib) to\ncompress objects. You can use Python's built-in\n[zlib](https://docs.python.org/3/library/zlib.html) library to read these\ncompressed files.\n{{/lang_is_python}}\n\n{{#lang_is_ruby}}\nKeep in mind that Git uses [Zlib](https://en.wikipedia.org/wiki/Zlib) to\ncompress objects. You can use Ruby's built-in\n[Zlib](https://ruby-doc.org/stdlib-2.7.0/libdoc/zlib/rdoc/Zlib.html)\nlibrary to read these compressed files.\n{{/lang_is_ruby}}\n\n{{#lang_is_go}}\nKeep in mind that Git uses [Zlib](https://en.wikipedia.org/wiki/Zlib) to\ncompress objects. You can use Go's built-in\n[compress/zlib](https://golang.org/pkg/compress/zlib/) package to read\nthese compressed files.\n{{/lang_is_go}}\n\n{{#lang_is_rust}}\nKeep in mind that Git uses [Zlib](https://en.wikipedia.org/wiki/Zlib) to\ncompress objects. You can use the\n[flate2](https://crates.io/crates/flate2) crate to read these compressed\nfiles, we've included it in the `Cargo.toml` file.\n{{/lang_is_rust}}\n\n{{^lang_is_python}}\n{{^lang_is_ruby}}\n{{^lang_is_go}}\n{{^lang_is_rust}}\nKeep in mind that Git uses [Zlib](https://en.wikipedia.org/wiki/Zlib) to\ncompress objects. Many languages have utils for dealing with zlib data in their standard library. If not,\nyou might need to use a third-party library to read these compressed files.\n{{/lang_is_rust}}\n{{/lang_is_go}}\n{{/lang_is_ruby}}\n{{/lang_is_python}}",
      "marketing_md": "In this stage, you'll read a blob from your git repository by fetching its\ncontents from the `.git/objects` directory.\n\nYou'll do this using the first of multiple [\"plumbing\"\ncommands](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)\nwe'll encounter in this challenge: [`git\ncat-file`](https://git-scm.com/docs/git-cat-file).",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_read_blob.go#L18"
    },
    {
      "slug": "create_blob",
      "name": "Create a blob object",
      "difficulty": "medium",
      "description_md": "In the previous stage, we learnt how to read a blob. In this stage, you'll\nadd a blob to your git repository by implementing the [`git\nhash-object`](https://git-scm.com/docs/git-hash-object) command.\n\nYour program will be called like so:\n\n```\n./your_git.sh hash-object -w <file>\n```\n\nIt is expected to store the data from `<file>` as a blob in `.git/objects`\nand print a 40-char SHA to stdout.\n\nTo verify your implementation, the tester will try to read the blob your\nprogram wrote. It'll do this using [`git\ncat-file`](https://git-scm.com/docs/git-cat-file), the command you\nimplemented in the previous stage.\n\n```\ngit cat-file -p <blob_sha>\n```",
      "marketing_md": "In the previous stage, we learnt how to read a blob. In this stage, we'll\npersist a blob by implementing the `git hash-object` command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/master/internal/stage_create_blob.go"
    },
    {
      "slug": "read_tree",
      "name": "Read a tree object",
      "difficulty": "medium",
      "description_md": "Now that we've learnt how to read/write blobs, let's move onto our next\nGit object: [the tree](https://developer.github.com/v3/git/trees/).\n\nIn this stage, you'll implement the [`git\nls-tree`](https://git-scm.com/docs/git-ls-tree) command, which is used to\ninspect a tree object.\n\nThe tester will execute your program like this:\n\n```\n./your_git.sh ls-tree --name-only <tree_sha>\n```\n\nFor a directory structure like this:\n\n```\nyour_repo/\n  - file1\n  - dir1/\n    - file_in_dir_1\n    - file_in_dir_2\n  - dir2/\n    - file_in_dir_3\n```\n\nThe output expected is:\n\n```\ndir1\ndir2\nfile1\n```\n\n(Note that the output is alphabetically sorted, this is how Git stores\nentries in the tree object internally)\n\nTo know more about the internal format of a tree object, checkout [this\nStackOverflow\nquestion](https://stackoverflow.com/questions/14790681/what-is-the-internal-format-of-a-git-tree-object).",
      "marketing_md": "Now that we've learnt how to read/write blobs, let's move onto our next\nGit object: [the tree](https://developer.github.com/v3/git/trees/). In\nthis stage, you'll read a tree object from storage by implementing the\n`git ls-tree` command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_read_tree.go#L20"
    },
    {
      "slug": "write_tree",
      "name": "Write a tree object",
      "difficulty": "medium",
      "description_md": "Now that you know how to read a tree object, let's put your new found\nskills to test - can you _write_ a tree?\n\nHere's how the tester will invoke your program:\n\n```\n./your_git.sh write-tree\n```\n\nYou're expected to write the entire working directory as a tree object,\nand print the 40-char SHA.\n\nCaveat: Unlike the official Git implementation, we aren't going to\nimplement a staging area (the place where things go when you run `git\nadd`). We'll just assume that all files in the working directory are\nstaged. If you're testing this against `git` locally, make sure to run\n`git add .` before `git write-tree`.\n\nTo verify your implementation, the tester will read the tree object from\nthe `.git` directory.",
      "marketing_md": "In this stage, you'll write a tree to git storage by implementing the [`git\nwrite-tree`](https://git-scm.com/docs/git-write-tree) command.\n\nTo keep things simple, we won't implement an `index`, we'll just assume\nthat all changes in the worktree are staged.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_write_tree.go#L21"
    },
    {
      "slug": "create_commit",
      "name": "Create a commit",
      "difficulty": "medium",
      "description_md": "Let's move on to the last git object we'll be dealing with in this\nchallenge: [the commit](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects#_git_commit_objects).\n\nTo create a commit, you'll need the following information:\n\n- Committer/Author name + email\n- Timestamp\n- Tree SHA\n- Parent commit SHA(s), if any\n\nIn this stage, you'll implement [`git\ncommit-tree`](https://git-scm.com/docs/git-commit-tree), a plumbing\ncommand that creates a commit.\n\nYour program will be invoked like this:\n\n```\n./your_git.sh commit-tree <tree_sha> -p <commit_sha> -m <message>\n```\n\nYou'll receive exactly one parent commit, and exactly one line in the\nmessage. You're free to hardcode any valid name/email for the\nauthor/committer fields.\n\nYour program must create a commit object and print its 40-char SHA to\nstdout.\n\nTo verify your changes, the tester will read the commit object from the\n`.git` directory. It'll use the `git show` command to do this.",
      "marketing_md": "Let's move on to the last git object we'll be dealing with in this\nchallenge: the commit. In this stage, you'll create a commit by\nimplementing the [`git commit-tree`](https://git-scm.com/docs/git-commit-tree)\ncommand.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/master/internal/stage_create_commit.go"
    },
    {
      "slug": "clone_repository",
      "name": "Clone a repository",
      "difficulty": "hard",
      "description_md": "This is the last stage of the challenge, and probably the hardest.\n\nIn this stage, you'll clone a public repository from GitHub. To do this,\nyou'll use Git's [Smart HTTP transfer\nprotocol](https://www.git-scm.com/docs/http-protocol).\n\n{{#lang_is_rust}}\nYou can use the [reqwest](https://crates.io/crates/reqwest) crate to make\nHTTP requests, we've included it in the `Cargo.toml` file.\n{{/lang_is_rust}}\n\nYour program will be invoked like this:\n\n```\n./your_git.sh clone https://github.com/blah/blah <some_dir>\n```\n\nYour program must create `<some_dir>` and clone the given repository into\nit.\n\nTo verify your changes, the tester will do the following:\n\n- Check the contents of a file\n- Read commit object attributes from the `.git` directory\n\nTo know more about the protocol format, checkout\n[gitprotocol-pack.txt](https://github.com/git/git/blob/795ea8776befc95ea2becd8020c7a284677b4161/Documentation/gitprotocol-pack.txt),\n[gitformat-pack.txt](https://github.com/git/git/blob/795ea8776befc95ea2becd8020c7a284677b4161/Documentation/gitformat-pack.txt),\nand\n[these](https://codewords.recurse.com/issues/three/unpacking-git-packfiles)\n[articles](https://medium.com/@concertdaw/sneaky-git-number-encoding-ddcc5db5329f).",
      "marketing_md": "This is the last stage of the challenge, and probably the hardest! In this\nstage, you'll clone a public repository from GitHub. To do this, you'll\nuse one of Git's [Transfer\nprotocols](https://git-scm.com/book/en/v2/Git-Internals-Transfer-Protocols).",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_clone_repository.go#L80"
    }
  ]
}
