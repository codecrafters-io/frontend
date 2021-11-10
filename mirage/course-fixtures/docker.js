export default {
  "slug": "docker",
  "name": "Build your own Docker",
  "description_md": "In this challenge, you'll build a toy Docker implementation that can pull an\nimage from [Docker Hub](https://hub.docker.com/) and execute commands in it.\nAlong the way, you'll learn about\n[chroot](https://en.wikipedia.org/wiki/Chroot), [kernel\nnamespaces](https://en.wikipedia.org/wiki/Linux_namespaces), the [docker\nregistry API](https://docs.docker.com/registry/spec/api/) and much more.\n",
  "short_description_md": "Learn about chroot, kernel namespaces, the docker registry API and more\n",
  "completion_percentage": 30,
  "state": "live",
  "early_access_languages": [
    "rust"
  ],
  "supported_languages": [
    "c",
    "go",
    "nim",
    "php"
  ],
  "starter_repos": {
    "c": "https://github.com/codecrafters-io/docker-starter-c",
    "go": "https://github.com/codecrafters-io/docker-starter-go",
    "nim": "https://github.com/codecrafters-io/docker-starter-nim",
    "php": "https://github.com/codecrafters-io/docker-starter-php",
    "rust": "https://github.com/codecrafters-io/docker-starter-rust"
  },
  "marketing": {
    "description": "Learn about chroot, kernel namespaces, the docker registry API and more",
    "difficulty": "medium",
    "introduction_md": "In this challenge, you'll build a toy Docker implementation that can pull an\nimage from [Docker Hub](https://hub.docker.com/) and execute commands in it.\nAlong the way, you'll learn about\n[chroot](https://en.wikipedia.org/wiki/Chroot), [kernel\nnamespaces](https://en.wikipedia.org/wiki/Linux_namespaces), the [docker\nregistry API](https://docs.docker.com/registry/spec/api/) and much more.\n"
  },
  "stages": [
    {
      "slug": "init",
      "name": "Execute a program",
      "description_md": "In the first couple of stages of this challenge, you'll be using\n[`docker-explorer`](https://github.com/codecrafters-io/docker-explorer), a\ncustom test program that exposes a few commands like `echo` and `ls`.\n\nYou don't need to install `docker-explorer` on your machine, we've included\nit in the [Dockerfile]({{starter_repo_url}}/blob/master/Dockerfile) you'll use to\nrun your program locally. It'll be installed at `/usr/local/bin/docker-explorer`.\n\nIn the first stage, your task is to implement a very basic version of `docker\nrun` that will be executed like this:\n\n```\nyour_docker run ubuntu:latest /usr/local/bin/docker-explorer echo hey\n```\n\n(This is supposed to mimic the [`docker run`](https://docs.docker.com/engine/reference/run/) command)\n\nDon't worry about pulling the `ubuntu:latest` image for now, just execute a program\non your local machine and print its output. We'll work on pulling images from Docker Hub\nin stage 6.\n\nRead **\"Passing the first stage\"** in [the README]({{readme_url}}) of your repository for instructions on how to\npass this stage.\n",
      "marketing_md": "In this stage, you'll execute a program using `fork` + `exec`.\n"
    },
    {
      "slug": "stdio",
      "name": "Wireup stdout & stderr",
      "description_md": "In this stage, you'll need to pipe the program's stdout and stderr to the\nparent process.\n\nIf you've got any logs or print statements in your code, make sure to remove\nthem. The tester can't differentiate between debug logs and the actual\noutput!\n\nTo test this behaviour locally, you could use the `echo` + `echo_stderr`\ncommands that `docker-explorer` exposes. Run `docker-explorer --help` to\nview usage.\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nyour_docker run ubuntu:latest /usr/local/bin/docker-explorer echo hey\n```\n",
      "marketing_md": "In this stage, you'll relay the child program's stdout & stderr to the\nparent process.\n"
    },
    {
      "slug": "exit_code",
      "name": "Handle exit codes",
      "description_md": "In this stage, you'll need to relay the program's exit code to the parent\nprocess.\n\nIf the program you're executing exits with exit code 1, your program\nshould exit with exit code 1 too.\n\nTo test this behaviour locally, you could use the `exit` command that\n`docker-explorer` exposes. Run `docker-explorer --help` to view usage.\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nyour_docker run ubuntu:latest /usr/local/bin/docker-explorer exit 1\n```\n",
      "marketing_md": "In this stage, you'll wait for the child program's exit code and exit with\nit.\n"
    },
    {
      "slug": "fs_isolation",
      "name": "Filesystem isolation",
      "description_md": "In the previous stage, we executed a program that existed locally on our\nmachine. This program had write access to the whole filesystem, which\nmeans that it could do **dangerous** things!\n\nIn this stage, you'll use [chroot](https://en.wikipedia.org/wiki/Chroot)\nto ensure that the program you execute doesn't have access to any files on\nthe host machine. Create an empty temporary directory and `chroot` into it\nwhen executing the command. You'll need to copy the binary being executed\ntoo.\n\n{{#lang_is_rust}}\nAt the time of writing this, the implementation of chroot in Rust's standard library\n([std::os::unix::fs::chroot](https://doc.rust-lang.org/std/os/unix/fs/fn.chroot.html)) is still a\nnightly-only experimental API. We've included [libc](https://crates.io/crates/libc) as a dependency\ninstead.\n{{/lang_is_rust}}\n\n{{#lang_is_nim}}\nSince Nim's [posix module](https://nim-lang.org/docs/posix.html) doesn't\nhave `chroot` defined, you'll need to implement this yourself! For\nexamples on how to do this, view the source for other syscalls like\n[chdir](https://nim-lang.org/docs/posix.html#chdir%2Ccstring).\n{{/lang_is_nim}}\n\n{{#lang_is_go}}\nWhen executing your program within the chroot directory, you might run into an error that says\n`open /dev/null: no such file or directory`. This is because [Cmd.Run()](https://golang.org/pkg/os/exec/#Cmd.Run)\nand its siblings expect `/dev/null` to be present. You can work around this by either creating an empty\n`/dev/null` file inside the chroot directory, or by ensuring that `Cmd.Stdout`, `Cmd.Stderr` and `Cmd.Stdin` are not `nil`.\nMore details about this [here](https://rohitpaulk.com/articles/cmd-run-dev-null).\n{{/lang_is_go}}\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nyour_docker run ubuntu:latest /usr/local/bin/docker-explorer ls /some_dir\n```\n",
      "marketing_md": "In this stage, you'll restrict a program's access to the host filesystem\nby using [chroot](https://en.wikipedia.org/wiki/Chroot).\n"
    },
    {
      "slug": "process_isolation",
      "name": "Process isolation",
      "description_md": "In the previous stage, we guarded against malicious activity by\nrestricting an executable's access to the filesystem.\n\nThere's another resource that needs to be guarded: the process tree. The\nprocess you're executing is currently capable of viewing all other\nprocesses running on the host system, and sending signals to them.\n\nIn this stage, you'll use [PID\nnamespaces](http://man7.org/linux/man-pages/man7/pid_namespaces.7.html) to\nensure that the program you execute has its own isolated process tree.\nThe process being executed must see itself as PID 1.\n\n{{#lang_is_php}}\nYou'll need to use the `pcntl_unshare` function for this, which was\n[added in PHP 7.4](https://www.php.net/manual/en/migration74.new-functions.php), and isn't properly documented\nyet (as of 22 Jan 2021). Here's the [pull request](https://github.com/php/php-src/pull/3760) where it was added.\n{{/lang_is_php}}\n\nJust like the previous stage, the tester will run your program like this:\n\n```\nyour_docker run ubuntu:latest /usr/local/bin/docker-explorer mypid\n```\n",
      "marketing_md": "In this stage, you'll restrict a program's access to the host's process\ntree by using [PID\nnamespaces](http://man7.org/linux/man-pages/man7/pid_namespaces.7.html).\n"
    },
    {
      "slug": "fetch_from_registry",
      "name": "Fetch an image from the Docker Registry",
      "description_md": "Your docker implementation can now execute a program with a fair degree of\nisolation - it can't modify files or interact with processes running on\nthe host.\n\nIn this stage, you'll use [the Docker registry\nAPI](https://docs.docker.com/registry/spec/api/) to fetch the contents of\na public image on [Docker Hub](https://hub.docker.com/) and then execute a\ncommand within it.\n\nYou'll need to:\n\n- Do a small [authentication dance](https://docs.docker.com/registry/spec/auth/token/)\n- Fetch the [image manifest](https://docs.docker.com/registry/spec/api/#pulling-an-image-manifest)\n- [Pull layers](https://docs.docker.com/registry/spec/api/#pulling-a-layer) of an image and extract them to the chroot directory\n\nThe base URL for Docker Hub's public registry is `registry.hub.docker.com`.\n\nThe tester will run your program like this:\n\n```\nyour_docker run ubuntu:latest /bin/echo hey\n```\n\nThe image used will be an [official\nimage](https://docs.docker.com/docker-hub/official_images/) from Docker\nHub. For example: [`alpine:latest`](https://hub.docker.com/_/alpine),\n[`ubuntu:latest`](https://hub.docker.com/_/ubuntu),\n[`busybox:latest`](https://hub.docker.com/_/busybox). When interacting with the\nRegistry API, you'll need to prepend `library/` to the image names.\n\n{{#lang_is_rust}}\nSince Rust doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n\nYou can use the [reqwest](https://crates.io/crates/reqwest) crate to make\nHTTP requests, we've included it in the `Cargo.toml` file. We've also included\n[serde_json](https://crates.io/crates/serde_json) to help with parsing JSON.\n{{/lang_is_rust}}\n\n{{#lang_is_go}}\nSince Go doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n{{/lang_is_go}}\n\n{{#lang_is_nim}}\nSince Nim doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n{{/lang_is_nim}}\n\n{{#lang_is_c}}\nSince C doesn't have an archive extraction utility in its stdlib, you\nmight want to shell out and use `tar`.\n\nYou can assume that `libcurl` is available in the build environment.\n{{/lang_is_c}}\n",
      "marketing_md": "In this stage, you'll fetch an image from Docker Hub and execute a command\nin it. You'll need to use [the Docker Registry\nAPI](https://docs.docker.com/registry/spec/api/) for this.\n"
    }
  ]
}
