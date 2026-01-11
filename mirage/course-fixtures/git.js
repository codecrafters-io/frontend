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
      "slug": "c"
    },
    {
      "slug": "cpp"
    },
    {
      "slug": "csharp",
      "release_status": "beta"
    },
    {
      "slug": "go"
    },
    {
      "slug": "haskell"
    },
    {
      "slug": "java",
      "release_status": "beta"
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
      "slug": "kotlin"
    },
    {
      "slug": "typescript",
      "release_status": "beta"
    },
    {
      "slug": "zig",
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
      "slug": "gg4",
      "name": "Initialize the .git directory",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll implement the `git init` command. You'll initialize\na git repository by creating a `.git` directory and some files inside it.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_init.go#L12"
    },
    {
      "slug": "ic4",
      "name": "Read a blob object",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll read a blob from your git repository by fetching its\ncontents from the `.git/objects` directory.\n\nYou'll do this using the first of multiple [\"plumbing\"\ncommands](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)\nwe'll encounter in this challenge: [`git\ncat-file`](https://git-scm.com/docs/git-cat-file).",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_read_blob.go#L18"
    },
    {
      "slug": "jt4",
      "name": "Create a blob object",
      "difficulty": "medium",
      "marketing_md": "In the previous stage, we learnt how to read a blob. In this stage, we'll\npersist a blob by implementing the `git hash-object` command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/master/internal/stage_create_blob.go"
    },
    {
      "slug": "kp1",
      "name": "Read a tree object",
      "difficulty": "medium",
      "marketing_md": "Now that we've learnt how to read/write blobs, let's move onto our next\nGit object: [the tree](https://developer.github.com/v3/git/trees/). In\nthis stage, you'll read a tree object from storage by implementing the\n`git ls-tree` command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_read_tree.go#L20"
    },
    {
      "slug": "fe4",
      "name": "Write a tree object",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll write a tree to git storage by implementing the [`git\nwrite-tree`](https://git-scm.com/docs/git-write-tree) command.\n\nTo keep things simple, we won't implement an `index`, we'll just assume\nthat all changes in the worktree are staged.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_write_tree.go#L21"
    },
    {
      "slug": "jm9",
      "name": "Create a commit",
      "difficulty": "medium",
      "marketing_md": "Let's move on to the last git object we'll be dealing with in this\nchallenge: the commit. In this stage, you'll create a commit by\nimplementing the [`git commit-tree`](https://git-scm.com/docs/git-commit-tree)\ncommand.",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/master/internal/stage_create_commit.go"
    },
    {
      "slug": "mg6",
      "name": "Clone a repository",
      "difficulty": "hard",
      "marketing_md": "This is the last stage of the challenge, and probably the hardest! In this\nstage, you'll clone a public repository from GitHub. To do this, you'll\nuse one of Git's [Transfer\nprotocols](https://git-scm.com/book/en/v2/Git-Internals-Transfer-Protocols).",
      "tester_source_code_url": "https://github.com/codecrafters-io/git-tester/blob/03984478122959f23a866a0df102413a5ac08e67/internal/stage_clone_repository.go#L80"
    }
  ]
}
