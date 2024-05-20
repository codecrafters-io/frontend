export default {
  "slug": "docker",
  "name": "Build your own Docker",
  "short_name": "Docker",
  "release_status": "live",
  "description_md": "Docker is a tool used to build & run applications in containers. In this challenge, you'll build\nyour own Docker implementation that can pull an image from Docker Hub and execute commands in it.\n\nAlong the way, you'll learn about chroot, kernel namespaces, the Docker registry API and much more.",
  "short_description_md": "Learn about kernel namespaces, chroot, the registry API and more",
  "completion_percentage": 30,
  "languages": [
    {
      "slug": "c"
    },
    {
      "slug": "go"
    },
    {
      "slug": "nim"
    },
    {
      "slug": "php"
    },
    {
      "slug": "python",
      "release_status": "beta"
    },
    {
      "slug": "ruby",
      "release_status": "beta"
    },
    {
      "slug": "rust"
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
    "difficulty": "medium",
    "sample_extension_idea_title": "Build from Dockerfile",
    "sample_extension_idea_description": "A Docker implementation that can build images from a Dockerfile",
    "testimonials": [
      {
        "author_name": "Raghav Dua",
        "author_description": "SRE, Coinbase",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/raghav-dua.jpeg",
        "link": "https://github.com/duaraghav8",
        "text": "I spent a full day on your Docker building course and ended up building the whole thing myself. As a SRE (and\nmostly a user of docker), digging into the internals blew me away."
      },
      {
        "author_name": "Beyang Liu",
        "author_description": "CTO at SourceGraph",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/beyang-liu.jpeg",
        "link": "https://twitter.com/beyang",
        "text": "CodeCrafters has you build your own version of things like Git and Docker from scratch. A cool way to build a stronger mental model of how those tools work."
      }
    ]
  },
  "stages": [
    {
      "slug": "je9",
      "name": "Execute a program",
      "difficulty": "very_easy",
      "description_md": "Your task is to implement a very basic version\nof [`docker run`](https://docs.docker.com/engine/reference/run/)</a>. It will\nbe executed similar to `docker run`:\n\n```\nmydocker run alpine:latest /usr/local/bin/docker-explorer echo hey\n```\n\n[docker-explorer](https://github.com/codecrafters-io/docker-explorer) is a custom test program that exposes\ncommands like `echo` and `ls`.\n\nFor now, don't worry about pulling the `alpine:latest` image. We will just\nexecute a local program for this stage and print its output. You'll work on\npulling images from Docker Hub in stage 6.",
      "marketing_md": "In this stage, you'll execute a program using `fork` + `exec`.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_basic_exec.go#L9"
    },
    {
      "slug": "kf3",
      "name": "Wireup stdout & stderr",
      "difficulty": "easy",
      "description_md": "You'll now pipe the program's stdout and stderr to the\nparent process.\n\nLike the last stage, the tester will run your program like this:\n\n```\nmydocker run alpine:latest /usr/local/bin/docker-explorer echo hey\n```\n\nTo test this behaviour locally, you could use the `echo` + `echo_stderr`\ncommands that `docker-explorer` exposes. Run `docker-explorer --help` to\nview usage.\n\nIf you've got any logs or print statements in your code, make sure to remove\nthem. The tester can't differentiate between debug logs and the actual\noutput!\n\nNote: The **README** in your repository contains setup\ninformation for this stage and beyond (takes < 5 min).",
      "marketing_md": "In this stage, you'll relay the child program's stdout & stderr to the\nparent process.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_stdio.go#L9"
    },
    {
      "slug": "cn8",
      "name": "Handle exit codes",
      "difficulty": "easy",
      "description_md": "In this stage, you'll need to relay the program's exit code to the parent\nprocess.\n\nIf the program you're executing exits with exit code 1, your program\nshould exit with exit code 1 too.\n\nTo test this behaviour locally, you could use the `exit` command that\n`docker-explorer` exposes. Run `docker-explorer --help` to view usage.\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nmydocker run alpine:latest /usr/local/bin/docker-explorer exit 1\n```",
      "marketing_md": "In this stage, you'll wait for the child program's exit code and exit with\nit.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_exit_code.go#L9"
    },
    {
      "slug": "if6",
      "name": "Filesystem isolation",
      "difficulty": "medium",
      "description_md": "In the previous stage, we executed a program that existed locally on our\nmachine. This program had write access to the whole filesystem, which\nmeans that it could do **dangerous** things!\n\nIn this stage, you'll use [chroot](https://en.wikipedia.org/wiki/Chroot)\nto ensure that the program you execute doesn't have access to any files on\nthe host machine. Create an empty temporary directory and `chroot` into it\nwhen executing the command. You'll need to copy the binary being executed\ntoo.\n\n{{#lang_is_rust}}\nAt the time of writing this, the implementation of chroot in Rust's standard library\n([std::os::unix::fs::chroot](https://doc.rust-lang.org/std/os/unix/fs/fn.chroot.html)) is still a\nnightly-only experimental API. We've included [libc](https://crates.io/crates/libc) as a dependency\ninstead.\n{{/lang_is_rust}}\n\n{{#lang_is_nim}}\nSince Nim's [posix module](https://nim-lang.org/docs/posix.html) doesn't\nhave `chroot` defined, you'll need to implement this yourself! For\nexamples on how to do this, view the source for other syscalls like\n[chdir](https://nim-lang.org/docs/posix.html#chdir%2Ccstring).\n{{/lang_is_nim}}\n\n{{#lang_is_go}}\nWhen executing your program within the chroot directory, you might run into an error that says\n`open /dev/null: no such file or directory`. This is because [Cmd.Run()](https://golang.org/pkg/os/exec/#Cmd.Run)\nand its siblings expect `/dev/null` to be present. You can work around this by either creating an empty\n`/dev/null` file inside the chroot directory, or by ensuring that `Cmd.Stdout`, `Cmd.Stderr` and `Cmd.Stdin` are not `nil`.\nMore details about this [here](https://rohitpaulk.com/articles/cmd-run-dev-null).\n{{/lang_is_go}}\n\n{{#lang_is_rust}}\nWhen executing your program within the chroot directory, you might run into an error that says\n`no such file or directory` even if the binary exists within the chroot. This is because\n[Command::output()](https://doc.rust-lang.org/std/process/struct.Command.html#method.output)\nexpects `/dev/null` to be present. You can work around this by creating an empty\n`/dev/null` file inside the chroot directory. This cryptic error effects Go programs too, more details\n[here](https://rohitpaulk.com/articles/cmd-run-dev-null).\n{{/lang_is_rust}}\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nmydocker run alpine:latest /usr/local/bin/docker-explorer ls /some_dir\n```",
      "marketing_md": "In this stage, you'll restrict a program's access to the host filesystem\nby using [chroot](https://en.wikipedia.org/wiki/Chroot).",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_fs_isolation.go#L8"
    },
    {
      "slug": "lu7",
      "name": "Process isolation",
      "difficulty": "medium",
      "description_md": "In the previous stage, we guarded against malicious activity by\nrestricting an executable's access to the filesystem.\n\nThere's another resource that needs to be guarded: the process tree. The\nprocess you're executing is currently capable of viewing all other\nprocesses running on the host system, and sending signals to them.\n\nIn this stage, you'll use [PID\nnamespaces](http://man7.org/linux/man-pages/man7/pid_namespaces.7.html) to\nensure that the program you execute has its own isolated process tree.\nThe process being executed must see itself as PID 1.\n\n{{#lang_is_php}}\nYou'll need to use the `pcntl_unshare` function for this, which was\n[added in PHP 7.4](https://www.php.net/manual/en/migration74.new-functions.php), and isn't properly documented\nyet (as of 22 Jan 2021). Here's the [pull request](https://github.com/php/php-src/pull/3760) where it was added.\n{{/lang_is_php}}\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nmydocker run alpine:latest /usr/local/bin/docker-explorer mypid\n```",
      "marketing_md": "In this stage, you'll restrict a program's access to the host's process\ntree by using [PID\nnamespaces](http://man7.org/linux/man-pages/man7/pid_namespaces.7.html).",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_process_isolation.go#L5"
    },
    {
      "slug": "hs1",
      "name": "Fetch an image from the Docker Registry",
      "should_skip_previous_stages_for_test_run": true,
      "difficulty": "hard",
      "description_md": "Your docker implementation can now execute a program with a fair degree of\nisolation - it can't modify files or interact with processes running on\nthe host.\n\nIn this stage, you'll use [the Docker registry\nAPI](https://docs.docker.com/registry/spec/api/) to fetch the contents of\na public image on [Docker Hub](https://hub.docker.com/) and then execute a\ncommand within it.\n\nYou'll need to:\n\n- Do a small [authentication dance](https://docs.docker.com/registry/spec/auth/token/)\n- Fetch the [image manifest](https://docs.docker.com/registry/spec/api/#pulling-an-image-manifest)\n- [Pull layers](https://docs.docker.com/registry/spec/api/#pulling-a-layer) of an image and extract them to the chroot directory\n\nThe base URL for Docker Hub's public registry is `registry.hub.docker.com`.\n\nThe tester will run your program like this:\n\n```\nmydocker run alpine:latest /bin/echo hey\n```\n\nThe image used will be an [official\nimage](https://docs.docker.com/docker-hub/official_images/) from Docker\nHub. For example: [`alpine:latest`](https://hub.docker.com/_/alpine),\n[`alpine:latest`](https://hub.docker.com/_/alpine),\n[`busybox:latest`](https://hub.docker.com/_/busybox). When interacting with the\nRegistry API, you'll need to prepend `library/` to the image names.\n\n{{#lang_is_rust}}\nSince Rust doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n\nYou can use the [reqwest](https://crates.io/crates/reqwest) crate to make\nHTTP requests, we've included it in the `Cargo.toml` file. We've also included\n[serde_json](https://crates.io/crates/serde_json) to help with parsing JSON.\n{{/lang_is_rust}}\n\n{{#lang_is_go}}\nSince Go doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n{{/lang_is_go}}\n\n{{#lang_is_nim}}\nSince Nim doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n{{/lang_is_nim}}\n\n{{#lang_is_c}}\nSince C doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n\nYou can assume that `libcurl` is available in the build environment.\n{{/lang_is_c}}",
      "marketing_md": "In this stage, you'll fetch an image from Docker Hub and execute a command\nin it. You'll need to use [the Docker Registry\nAPI](https://docs.docker.com/registry/spec/api/) for this.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_fetch_from_registry.go#L8"
    }
  ]
}
