export default {
  "slug": "docker",
  "name": "Build your own Docker",
  "short_name": "Docker",
  "release_status": "deprecated",
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
      "marketing_md": "In this stage, you'll execute a program using `fork` + `exec`.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_basic_exec.go#L9"
    },
    {
      "slug": "kf3",
      "name": "Wireup stdout & stderr",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll relay the child program's stdout & stderr to the\nparent process.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_stdio.go#L9"
    },
    {
      "slug": "cn8",
      "name": "Handle exit codes",
      "difficulty": "easy",
      "marketing_md": "In this stage, you'll wait for the child program's exit code and exit with\nit.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_exit_code.go#L9"
    },
    {
      "slug": "if6",
      "name": "Filesystem isolation",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll restrict a program's access to the host filesystem\nby using [chroot](https://en.wikipedia.org/wiki/Chroot).",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_fs_isolation.go#L8"
    },
    {
      "slug": "lu7",
      "name": "Process isolation",
      "difficulty": "medium",
      "marketing_md": "In this stage, you'll restrict a program's access to the host's process\ntree by using [PID\nnamespaces](http://man7.org/linux/man-pages/man7/pid_namespaces.7.html).",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_process_isolation.go#L5"
    },
    {
      "slug": "hs1",
      "name": "Fetch an image from the Docker Registry",
      "should_skip_previous_stages_for_test_run": true,
      "difficulty": "hard",
      "marketing_md": "In this stage, you'll fetch an image from Docker Hub and execute a command\nin it. You'll need to use [the Docker Registry\nAPI](https://docs.docker.com/registry/spec/api/) for this.",
      "tester_source_code_url": "https://github.com/codecrafters-io/docker-tester/blob/18245703a5beed8ee0a7e1cbb7204a7ee3b3b5d1/internal/stage_fetch_from_registry.go#L8"
    }
  ]
}
