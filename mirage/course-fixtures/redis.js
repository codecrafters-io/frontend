export default {
  "slug": "redis",
  "name": "Build your own Redis",
  "short_name": "Redis",
  "release_status": "live",
  "description_md": "In this challenge, you'll build a toy Redis clone\nthat's capable of handling basic commands like PING, GET\nand SET. Along the way, we'll learn about event loops, the Redis\nProtocol and more.",
  "short_description_md": "Learn about TCP servers, the Redis protocol and more",
  "completion_percentage": 30,
  "concept_slugs": [
    "network-protocols",
    "tcp-overview"
  ],
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
      "slug": "crystal"
    },
    {
      "slug": "csharp"
    },
    {
      "slug": "elixir"
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
      "slug": "php"
    },
    {
      "slug": "python"
    },
    {
      "slug": "ruby"
    },
    {
      "slug": "rust"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "Persistence",
    "sample_extension_idea_description": "A Redis server that can read and write .rdb files",
    "testimonials": [
      {
        "author_name": "Charles Guo",
        "author_description": "Software Engineer, Stripe",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/charles-guo.png",
        "link": "https://github.com/shaldengeki",
        "text": "The Redis challenge was extremely fun. I ended up having to read the\nRedis Protocol specification doc pretty carefully in its entirety! The result\nfelt like lightly-guided independent study, if that makes sense. (Which, again, was lots of fun)"
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
      "slug": "persistence-rdb",
      "name": "RDB Persistence",
      "description_markdown": "In this challenge extension you'll add [persistence][redis-persistence] support to your Redis implementation.\n\nAlong the way you'll learn about Redis's [RDB file format][rdb-file-format] and more.\n\n[redis-persistence]: https://redis.io/docs/manual/persistence/\n[rdb-file-format]: https://github.com/sripathikrishnan/redis-rdb-tools/blob/548b11ec3c81a603f5b321228d07a61a0b940159/docs/RDB_File_Format.textile\n"
    },
    {
      "slug": "replication",
      "name": "Replication",
      "description_markdown": "In this challenge extension you'll add support for [Replication][redis-replication] to your Redis implementation.\n\nAlong the way you'll learn about how Redis's leader-follower replication works, the [PSYNC][redis-psync-command] command and more.\n\n[redis-replication]: https://redis.io/docs/management/replication/\n[redis-psync-command]: https://redis.io/commands/psync/\n"
    }
  ],
  "stages": [
    {
      "slug": "init",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server"
      ],
      "name": "Bind to a port",
      "description_md": "Welcome to the Build your own Redis challenge! Now that you've got your repository set up, it's time to start building your Redis server.\n\nIn this stage, you'll implement a TCP server that listens on port 6379.\n\n[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) is the underlying protocol used by protocols like HTTP, SSH and others\nyou're probably familiar with. Redis clients & servers use TCP to communicate with each other.\n\nDon't worry if you're unfamiliar with the TCP protocol, or what Redis clients & servers are. You'll learn more about this in the\nnext stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh\n```\n\nIt'll then try to connect to your TCP server on port 6379. If the connection succeeds, you'll pass this stage.\n\n### Notes\n\n- 6379 is the default port that Redis uses.\n- If you already have a Redis server running on your machine and listening on port 6379, you'll see a \"port already in use\" error when running your code. Try stopping the existing Redis server and running your code again.",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll start a TCP server on port 6379, which is the\ndefault port that Redis uses.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_bind.go#L11"
    },
    {
      "slug": "ping-pong",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server"
      ],
      "name": "Respond to PING",
      "difficulty": "easy",
      "description_md": "🎉 You now have a TCP server running on port 6379! It doesn't do anything useful yet though, let's change that.\n\nIn this stage, you'll implement support for the [PING](https://redis.io/commands/ping) command.\n\nRedis clients communicate with Redis servers by sending \"[commands](https://redis.io/commands/)\". For each command, a Redis server sends a response back to the client.\nCommands and responses are both encoded using the [Redis protocol](https://redis.io/topics/protocol) (we'll learn more about this in later stages).\n\n[PING](https://redis.io/commands/ping/) is one of the simplest Redis commands. It's used to check whether a Redis server is healthy.\n\nThe response for the `PING` command is `+PONG\\r\\n`. This is the string \"PONG\" encoded using the [Redis protocol](https://redis.io/docs/reference/protocol-spec/).\n\nIn this stage, we'll cut corners by ignoring client input and hardcoding `+PONG\\r\\n` as a response. We'll learn to parse client input in later stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh\n```\n\nIt'll then send a `PING` command to your server and expect a `+PONG\\r\\n` response.\n\n```bash\n$ redis-cli ping\n```\n\nYour server should respond with `+PONG\\r\\n`, which is \"PONG\" encoded as a [RESP simple string](https://redis.io/docs/reference/protocol-spec/#resp-simple-strings).\n\n### Notes\n\n- You can ignore the data that the tester sends you for this stage. We'll get to parsing\nclient input in later stages. For now, you can just hardcode `+PONG\\r\\n` as the response.\n- You can also ignore handling multiple clients and handling multiple PING commands in the stage, we'll get to that in later stages.\n- The exact bytes your program will receive won't be just `ping`, you'll receive something like this: `*1\\r\\n$4\\r\\nping\\r\\n`,\nwhich is the Redis protocol encoding of the `PING` command. We'll learn more about this in later stages.",
      "marketing_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command. You'll use [the Redis\nprotocol](https://redis.io/topics/protocol) to encode the reply.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L9"
    },
    {
      "slug": "ping-pong-multiple",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server"
      ],
      "name": "Respond to multiple PINGs",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same connection.\n\nThe tester will execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh\n```\n\nIt'll then send two PING commands using the same connection:\n\n```bash\n$ echo -e \"ping\\nping\" | redis-cli\n```\n\nThe tester will expect to receive two `+PONG\\r\\n` responses.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to run a loop that reads input from a connection and sends a\nresponse back. In JavaScript however, if you're listening to the\n[`data`](https://nodejs.org/api/net.html#net_event_data) event, this should be automatically handled for you. **It\nis very likely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nYou'll need to run a loop that reads input from a connection and sends a\nresponse back.\n{{/lang_is_javascript}}\n\nJust like the previous stage, you can hardcode `+PONG\\r\\n` as the response for this stage. We'll get to parsing\nclient input in later stages.",
      "marketing_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same client.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L35"
    },
    {
      "slug": "concurrent-clients",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server"
      ],
      "name": "Handle concurrent clients",
      "difficulty": "medium",
      "description_md": "In this stage, your server will need to handle multiple concurrent\nclients. Just like the previous stages, all clients will only send `PING`\ncommands for now.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to either use threads or implement an\n[Event Loop](https://en.wikipedia.org/wiki/Event_loop) to do this. In JavaScript however, since [the concurrency\nmodel itself is based on an event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), most\nstandard library functions are designed to support this kind of concurrent behaviour out of the box. **It is very\nlikely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nTo achieve this, you'll need to either use threads, or, if you're feeling\nadventurous, an [Event Loop](https://en.wikipedia.org/wiki/Event_loop) (like\nthe official Redis implementation does).\n{{/lang_is_javascript}}\n\nSince the tester client _only_ sends the PING command at the moment, it's okay to\nignore what the client sends and hardcode a response. We'll get to parsing\nclient input in later stages.",
      "marketing_md": "In this stage, you'll add support for multiple concurrent clients to your\nRedis server. To achieve this you'll use an [Event\nLoop](https://en.wikipedia.org/wiki/Event_loop),\nlike the official Redis implementation does.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L56"
    },
    {
      "slug": "echo",
      "name": "Implement the ECHO command",
      "difficulty": "medium",
      "description_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command.\n\nThe client will send you the command as a RESP array, which looks\nsomething like this:\n\n```\n*2\\r\\n$4\\r\\nECHO\\r\\n$3\\r\\nhey\\r\\n\n```\n\nSeems confusing? Read up about [sending commands to a Redis\nserver](https://redis.io/docs/reference/protocol-spec/#sending-commands-to-a-redis-server).",
      "marketing_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command. You'll parse user input\naccording to the [the Redis protocol\nspecification](https://redis.io/topics/protocol).",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_echo.go#L11"
    },
    {
      "slug": "set_get",
      "name": "Implement the SET & GET commands",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to implement the [SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands. For now, you can ignore all extra\noptions for `SET` and just implement the simple form: `SET key value`. You'll add support\nfor expiry in the next stage.",
      "marketing_md": "In this stage, you'll need to implement the\n[SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_get_set.go#L11"
    },
    {
      "slug": "expiry",
      "name": "Expiry",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to support setting a key with an expiry. The\nexpiry is provided in milliseconds using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.\n\nThe tester will do the following:\n\n```bash\n# First, it'll set a key with an expiry (100 milliseconds in this example)\n$ redis-cli set random_key random_value px 100\n\n# Immediately after, it'll send a GET command to retrieve the value\n# The response to this should be \"random_value\" (encoded as a RESP bulk string)\n$ redis-cli get random_key\n\n# Then, it'll wait for the key to expire and send another GET command\n# The response to this should be `$-1\\r\\n` (a \"null bulk string\")\n$ sleep 0.2 && redis-cli get random_key\n```\n\n{{#lang_is_haskell}}\nThe [time](https://hackage.haskell.org/package/time) package is available\nto use as a dependency.\n{{/lang_is_haskell}}",
      "marketing_md": "In this stage, you'll add support for setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/master/internal/test_expiry.go"
    },
    {
      "slug": "rdb-config",
      "primary_extension_slug": "persistence-rdb",
      "name": "RDB file config",
      "difficulty": "easy",
      "description_md": "Redis uses `.rdb` files for persistence. In this stage, you'll add support for reading the config values related to where RDB files are stored.\n\nThere are two config values that determine where RDB files are stored:\n\n- `dir`: The directory where RDB files are stored\n- `dbfilename`: The name of the RDB file\n\nThese values will be passed into your program like this:\n\n```\n./spawn_redis_server.sh --dir /tmp/redis-files --dbfilename dump.rdb\n```\n\nTo verify whether your program is reading config values correctly, the tester will send you two commands:\n\n```bash\nredis-cli CONFIG GET dir\nredis-cli CONFIG GET dbfilename\n```\n\nThe response to `CONFIG GET <key>` should be a RESP array with two elements: the key and the value.\n\nFor example, let's say the `dir` value is `/tmp/redis-files`. The expected response will be:\n\n```\n*2\\r\\n$3\\r\\ndir\\r\\n$16\\r\\n/tmp/redis-files\\r\\n\n```\n\n- `*2\\r\\n` indicates that the array has two elements\n- `$3\\r\\ndir\\r\\n` indicates that the first element is a bulk string with the value `dir`\n- `$16\\r\\n/tmp/redis-files\\r\\n` indicates that the second element is a bulk string with the value `/tmp/redis-files`\n\n**Note**: If your repository was created before 5th Oct 2023, it's possible that your `./spawn_redis_server.sh` script\nmight not be passing arguments on to your program. You'll need to edit `./spawn_redis_server.sh` to fix this, check\n[this PR](https://github.com/codecrafters-io/build-your-own-redis/pull/89/files) for details.\n",
      "marketing_md": "In this stage, you'll add support for reading the config values related to where RDB files are stored. You'll implement the `CONFIG GET` command.\n"
    },
    {
      "slug": "rdb-read-key",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read a key",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading a key from an RDB file.\n\nTo keep things simple, we'll start out by supporting RDB files that contain a single key.\n\nJan-Erik Rediger (author of [rdb-rs](https://rdb.fnordig.de/)) has a great [write-up](https://rdb.fnordig.de/file_format.html)\nthat explains the RDB file format in detail. We recommend using it as a reference when working on this stage.\n\nThe tester will create an RDB file with a single key and execute your program like this:\n\n```\n./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send a `keys *` command to your server.\n\n```bash\n$ redis-cli keys \"*\"\n```\n\nThe response to `keys *` should be a RESP array with one element: the key.\n\nFor example, let's say the RDB file contains a key called `foo`. The expected response will be:\n\n```\n*1\\r\\n$3\\r\\nfoo\\r\\n\n```\n\n- `*1\\r\\n` indicates that the array has one element\n- `$3\\r\\nfoo\\r\\n` indicates that the first element is a bulk string with the value `foo`\n\n**Note**: Remember, in this stage you only need to support RDB files that contain a single key, and you can ignore the value of the key. We'll\nget to handling multiple keys and reading values in later stages.\n\n**Note**: The `.rdb` file provided via `--dir`/`--dbfilename` might not exist. If the file doesn't exist, your program must treat it as if the database\nis currently empty.\n",
      "marketing_md": "In this stage, you'll add support for reading a key from an RDB file that contains a single key-value pair. You'll do this by implementing the `KEYS *` command.\n"
    },
    {
      "slug": "rdb-read-string-value",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read a string value",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading the value corresponding to a key from an RDB file.\n\nJust like with the previous stage, we'll stick to supporting RDB files that contain a single key for now.\n\nThe tester will create an RDB file with a single key and execute your program like this:\n\n```\n./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send a `get <key>` command to your server.\n\n```bash\n$ redis-cli get \"foo\"\n```\n\nThe response to `get <key>` should be a RESP bulk string with the value of the key.\n\nFor example, let's say the RDB file contains a key called `foo` with the value `bar`. The expected response will be `$3\\r\\nbar\\r\\n`.\n\nStrings can be encoded in three different ways in the RDB file format:\n\n- Length-prefixed strings\n- Integers as strings\n- Compressed strings\n\nIn this stage, you only need to support length-prefixed strings. We won't cover the other two types in this challenge.\n\nWe recommend using [this blog post](https://rdb.fnordig.de/file_format.html) as a reference when working on this stage.\n",
      "marketing_md": "In this stage, you'll add support for reading the value of a key from an RDB file that contains a single key-value pair.\n"
    },
    {
      "slug": "rdb-read-multiple-keys",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read multiple keys",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading multiple keys from an RDB file.\n\nThe tester will create an RDB file with multiple keys and execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send a `keys *` command to your server.\n\n```bash\n$ redis-cli keys \"*\"\n```\n\nThe response to `keys *` should be a RESP array with the keys as elements.\n\nFor example, let's say the RDB file contains two keys: `foo` and `bar`. The expected response will be:\n\n```\n*2\\r\\n$3\\r\\nfoo\\r\\n$3\\r\\nbar\\r\\n\n```\n\n- `*2\\r\\n` indicates that the array has two elements\n- `$3\\r\\nfoo\\r\\n` indicates that the first element is a bulk string with the value `foo`\n- `$3\\r\\nbar\\r\\n` indicates that the second element is a bulk string with the value `bar`\n",
      "marketing_md": "In this stage, you'll add support for reading multiple keys from an RDB file. You'll do this by extending the `KEYS *` command to support multiple keys.\n"
    },
    {
      "slug": "rdb-read-multiple-string-values",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read multiple string values",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading multiple string values from an RDB file.\n\nThe tester will create an RDB file with multiple keys and execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send multiple `get <key>` commands to your server.\n\n```bash\n$ redis-cli get \"foo\"\n$ redis-cli get \"bar\"\n```\n\nThe response to each `get <key>` command should be a RESP bulk string with the value corresponding to the key.\n",
      "marketing_md": "In this stage, you'll add support for reading multiple string values from an RDB file.\n"
    },
    {
      "slug": "rdb-read-value-with-expiry",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read value with expiry",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading values that have an expiry set.\n\nThe tester will create an RDB file with multiple keys. Some of these keys will have an expiry set, and some won't. The expiry timestamps\nwill also be random, some will be in the past and some will be in the future.\n\nThe tester will execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send multiple `get <key>` commands to your server.\n\n```bash\n$ redis-cli get \"foo\"\n$ redis-cli get \"bar\"\n```\n\nWhen a key has expired, the expected response is `$-1\\r\\n` (a \"null bulk string\").\n\nWhen a key hasn't expired, the expected response is a RESP bulk string with the value corresponding to the key.\n",
      "marketing_md": "In this stage, you'll add support for reading values that have an expiry set.\n"
    },
    {
      "slug": "repl-custom-port",
      "primary_extension_slug": "replication",
      "name": "Configure listening port",
      "difficulty": "easy",
      "description_md": "Welcome to the Replication extension!\n\nIn this extension, you'll extend your Redis server to support [leader-follower replication](https://redis.io/docs/management/replication/). You'll be able to run\nmultiple Redis servers with one acting as the \"master\" and the others as \"replicas\". Changes made to the master will be automatically replicated to the replicas.\n\nSince we'll need to run multiple instances of your Redis server at once, we can't run all of them on port 6379.\n\nIn this stage, you'll add support for starting the Redis server on a custom port. The port number will be passed to your program via the `--port` flag.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port 6380\n```\n\nIt'll then try to connect to your TCP server on the specified port number (`6380` in the example above). If the connection succeeds, you'll pass this stage.\n\n### Notes\n\n- Your program still needs to pass the previous stages, so if `--port` isn't specified, you should default to port 6379.\n- The tester will pass a random port number to your program, so you can't hardcode the port number from the example above.\n",
      "marketing_md": "In this stage, you'll add support for parsing the `--port` flag and starting Redis on a custom port.\n"
    },
    {
      "slug": "repl-info",
      "primary_extension_slug": "replication",
      "name": "The INFO command",
      "difficulty": "easy",
      "description_md": "In this stage, you'll add support for the [INFO](https://redis.io/commands/info/) command.\n\nThe `INFO` command returns information and statistics about a Redis server. In this stage, we'll add support for the\n`replication` section of the `INFO` command.\n\n### The replication section\n\nWhen you run the `INFO` command against a Redis server, you'll see something like this:\n\n```\n$ redis-cli info replication\n# Replication\nrole:master\nconnected_slaves:0\nmaster_replid:8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb\nmaster_repl_offset:0\nsecond_repl_offset:-1\nrepl_backlog_active:0\nrepl_backlog_size:1048576\nrepl_backlog_first_byte_offset:0\nrepl_backlog_histlen:\n```\n\nThe reply to this command is a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings) where each line is a key value pair, seperated by \":\".\n\nHere are what some of the important fields mean:\n\n- `role`: The role of the server (`master` or `slave`)\n- `connected_slaves`: The number of connected replicas\n- `master_replid`: The replication ID of the master (we'll get to this in later stages)\n- `master_repl_offset`: The replication offset of the master (we'll get to this in later stages)\n\nIn this stage, you'll only need to support the `role` key. We'll add support for other keys in later stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT>\n```\n\nIt'll then send the `INFO` command with `replication` as an argument.\n\n```bash\n$ redis-cli info replication\n```\n\nYour program should respond with a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings) where each line\nis a key value pair separated by `:`. The tester will only look for the `role` key, and assert that the value is `master`.\n\n### Notes\n\n- In the response for the `INFO` command, you only need to support the `role` key for this stage. We'll add support for the other keys in later stages.\n- The `# Replication` heading in the response is optional, you can ignore it.\n- The response to `INFO` needs to be encoded as a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings).\n  - An example valid response would be `$11\\r\\nrole:master\\r\\n` (the string `role:master` encoded as a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings))\n- The `INFO` command can be used without any arguments, in which case it returns all sections available. In this stage, we'll\n  always send `replication` as an argument to the `INFO` command, so you only need to support the `replication` section.\n",
      "marketing_md": "In this stage, you'll add support for the INFO command on the master.\n"
    },
    {
      "slug": "repl-info-replica",
      "primary_extension_slug": "replication",
      "name": "The INFO command on a replica",
      "difficulty": "medium",
      "description_md": "In this stage, you'll extend your [INFO](https://redis.io/commands/info/) command to run on a replica.\n\n### The `--replicaof` flag\n\nBy default, a Redis server assumes the \"master\" role. When the `--replicaof` flag is passed, the server assumes the \"slave\" role instead.\n\nHere's an example usage of the `--replicaof` flag:\n\n```\n./spawn_redis_server.sh --port 6380 --replicaof localhost 6379\n```\n\nIn this example, we're starting a Redis server in replica mode. The server itself will listen for connections on port 6380, but it'll\nalso connect to a master (another Redis server) running on localhost port 6379 and replicate all changes from the master.\n\nWe'll learn more about how this replication works in later stages. For now, we'll focus on adding support for the `--replicaof` flag, and\nextending the `INFO` command to support returning `role: slave` when the server is a replica.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT> --replicaof <MASTER_HOST> <MASTER_PORT>\n```\n\nIt'll then send the `INFO` command with `replication` as an argument to your server.\n\n```bash\n$ redis-cli info replication\n```\n\nYour program should respond with a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings) where each line\nis a key value pair separated by `:`. The tester will only look for the `role` key, and assert that the value is `slave`.\n\n### Notes\n\n- Your program still needs to pass the previous stage tests, so if `--replicaof` isn't specified, you should default to the `master` role.\n- Just like the last stage, you only need to support the `role` key in the response for this stage. We'll add support for the other keys in later stages.\n- You don't need to actually connect to the master server specified via `--replicaof` in this stage. We'll get to that in later stages.\n",
      "marketing_md": "In this stage, you'll add support for the --replicaof arg and INFO command on the replica.\n"
    },
    {
      "slug": "repl-id",
      "primary_extension_slug": "replication",
      "name": "Initial Replication ID and Offset",
      "difficulty": "easy",
      "description_md": "In this stage, you'll extend your `INFO` command to return two additional values: `master_replid` and `master_repl_offset`.\n\n### The replication ID and offset\n\nEvery Redis master has a replication ID: it is a large pseudo random string. This is set when the master is booted. Every time\na master instance restarts from scratch, its replication ID is reset.\n\nEach master also takes an offset that increments for every byte of replication stream that it is produced to be sent to replicas,\nto update the state of the replicas with the new changes modifying the dataset. We won't get into the details of how this offset\nis updated in this challenge. Just know that the value starts from `0` when a master is booted and no replicas have connected yet.\n\nIn this stage, you'll initialize a replication ID and offset for your master:\n\n- The ID can be any pseudo random alphanumeric string of 40 characters.\n  - For the purposes of this challenge, you don't need to actually generate a random string, you can hardcode it instead.\n  - As an example, you can hardcode `8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb` as the replication ID.\n- The offset is to be 0.\n\nThese two values should be returned as part of the INFO command output, under the `master_replid` and `master_repl_offset` keys respectively.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh\n```\n\nIt'll then send the `INFO` command with `replication` as an argument to your server.\n\n```bash\n$ redis-cli info replication\n```\n\nYour program should respond with a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings) where each line\nis a key value pair separated by `:`. The tester will look for the following keys:\n\n- `master_replid`, which should be a 40 character alphanumeric string\n- `master_repl_offset`, which should be `0`\n\n### Notes\n\n- Your code should still pass the previous stage tests, so the `role` key still needs to be returned\n",
      "marketing_md": "In this stage, you'll add support for reading a key from an RDB file that contains a single key-value pair. You'll do this by implementing the `KEYS *` command.\n"
    },
    {
      "slug": "repl-replica-ping",
      "primary_extension_slug": "replication",
      "name": "Send handshake (1/3)",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement part 1 of the handshake that happens when a replica connects to master.\n\n### Handshake\n\nWhen a replica connects to a master, it needs to go through a handshake process before receiving updates from the master.\n\nThere are three parts to this handshake:\n\n- The replica sends a `PING` to the master (**This stage**)\n- The replica sends `REPLCONF` twice to the master (Next stages)\n- The replica sends `PSYNC` to the master (Next stages)\n\nWe'll learn more about `REPLCONF` and `PSYNC` in later stages. For now, we'll focus on the first part of the handshake: sending `PING` to the master.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT> --replicaof <MASTER_HOST> <MASTER_PORT>\n```\n\nIt'll then assert that the replica connects to the master and sends the `PING` command.\n\n### Notes\n\n- The `PING` command should be sent as a RESP Array, like this : `*1\\r\\n$4\\r\\nping\\r\\n`\n",
      "marketing_md": "In this stage, you'll add support for starting the handshake from the Replica side.\n"
    },
    {
      "slug": "repl-replica-replconf",
      "primary_extension_slug": "replication",
      "name": "Send handshake (2/3)",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement part 2 of the handshake that happens when a replica connects to master.\n\n### Handshake (continued from previous stage)\n\nAs a recap, there are three parts to the handshake:\n\n- The replica sends a `PING` to the master (Previous stage)\n- The replica sends `REPLCONF` twice to the master (**This stage**)\n- The replica sends `PSYNC` to the master (Next stage)\n\nAfter receiving a response to `PING`, the replica then sends 2 [REPLCONF](https://redis.io/commands/replconf/) commands to the master.\n\nThe `REPLCONF` command is used to configure replication. Replicas will send this command to the master twice:\n\n- The first time, it'll be sent like this: `REPLCONF listening-port <PORT>`\n  - This is the replica notifying the master of the port it's listening on\n- The second time, it'll be sent like this: `REPLCONF capa eof capa psync2`\n  - This is the replica notifying the master of its capabilities (\"capa\" is short for \"capabilities\")\n  - You can safely hardcode these capabilities for now. We won't be using them in this challenge, we'll assume that the replica supports all capabilities.\n\nThese commands should be sent as RESP Arrays, so the exact bytes will look something like this:\n\n```\n# REPLCONF listening-port <PORT>\n*3\\r\\n$8\\r\\nREPLCONF\\r\\n$14\\r\\nlistening-port\\r\\n$4\\r\\n6380\\r\\n\n\n# REPLCONF capa eof capa psync2\n*5\\r\\n$8\\r\\nREPLCONF\\r\\n$4\\r\\ncapa\\r\\n$3\\r\\neof\\r\\n$4\\r\\ncapa\\r\\n$6\\r\\npsync2\\r\\n\n```\n\nFor both commands, the master will respond with `+OK\\r\\n` (\"OK\" encoded as a RESP Simple String).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT> --replicaof <MASTER_HOST> <MASTER_PORT>\n```\n\nIt'll then assert that the replica connects to the master and:\n\n- **(a)** sends the `PING` command\n- **(b)** sends the `REPLCONF` command with `listening-port` and `<PORT>` as arguments\n- **(c)** sends the `REPLCONF` command with `capa eof capa psync2` as arguments\n\n**Notes**\n\n- The response to `REPLCONF` will always be `+OK\\r\\n` (\"OK\" encoded as a RESP Simple String)\n",
      "marketing_md": "In this stage, you'll add support for continuing the handshake from the Replica side, by sending REPLCONF.\n"
    },
    {
      "slug": "repl-replica-psync",
      "primary_extension_slug": "replication",
      "name": "Send handshake (3/3)",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement part 3 of the handshake that happens when a replica connects to master.\n\n### Handshake (continued from previous stage)\n\nAs a recap, there are three parts to the handshake:\n\n- The replica sends a `PING` to the master (Previous stages)\n- The replica sends `REPLCONF` twice to the master (Previous stages)\n- The replica sends `PSYNC` to the master (**This stage**)\n\nAfter receiving response to the second `REPLCONF`, the replica then sends a [PSYNC](https://redis.io/commands/psync/) command to the master.\n\nThe `PSYNC` command is used to synchronize the state of the replica with the master. The replica will send this command to the master with two arguments:\n\n- The first argument is the replication ID of the master\n  - Since this is the first time the replica is connecting to the master, the replication ID will be `?` (a question mark)\n- The second argument is the offset of the master\n  - Since this is the first time the replica is connecting to the master, the offset will be `-1`\n\nSo the final command sent will be `PSYNC ? -1`.\n\nThis should be sent as a RESP Array, so the exact bytes will look something like this:\n\n<!-- TODO: Confirm whether 2nd arg is integer or string? -->\n\n```\n*3\\r\\n$5\\r\\nPSYNC\\r\\n$1\\r\\n?\\r\\n$2\\r\\n-1\\r\\n\n```\n\nThe master will respond with a [Bulk string](https://redis.io/docs/reference/protocol-spec/#bulk-strings) that looks like this:\n\n```\n+FULLRESYNC <REPL_ID> 0\\r\\n\n```\n\nYou can ignore the response for now, we'll get to handling it in later stages.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT> --replicaof <MASTER_HOST> <MASTER_PORT>\n```\n\nIt'll then assert that the replica connects to the master and:\n\n- **(a)** sends `PING` command\n- **(b)** sends `REPLCONF listening-port <PORT>`\n- **(c)** sends `REPLCONF capa eof capa psync2`\n- **(d)** sends `PSYNC ? -1`\n",
      "marketing_md": "In this stage, you'll add support for finishing the handshake from the Replica side, by sending PSYNC.\n"
    },
    {
      "slug": "repl-master-replconf",
      "primary_extension_slug": "replication",
      "name": "Receive handshake (1/2)",
      "difficulty": "easy",
      "description_md": "In this stage, we'll start implementing support for receiving a replication handshake as a master.\n\n### Handshake (continued from previous stage)\n\nWe'll now implement the same handshake we did in the previous stages, but on the master instead of the replica.\n\nAs a recap, there are three parts to the handshake:\n\n- The master receives a `PING` from the replica\n  - Your Redis server already supports the `PING` command, so there's no additional work to do here\n- The master receives `REPLCONF` twice from the replica (**This stage**)\n- The master receives `PSYNC` from the replica (Next stage)\n\nIn this stage, you'll add support for receiving the `REPLCONF` command from the replica.\n\nYou'll receive `REPLCONF` twice from the replica. For the purposes of this challenge, you can safely ignore the arguments for both commands and just\nrespond with `+OK\\r\\n` (\"OK\" encoded as a RESP Simple String).\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT>\n```\n\nIt'll then send the following commands:\n\n1. `PING` (expecting `+PONG\\r\\n` back)\n2. `REPLCONF listening-port <PORT>` (expecting `+OK\\r\\n` back)\n3. `REPLCONF capa eof capa psync2` (expecting `+OK\\r\\n` back)\n",
      "marketing_md": "In this stage, you'll add support for starting the handshake from the master side, by accepting REPLCONF.\n"
    },
    {
      "slug": "repl-master-psync",
      "primary_extension_slug": "replication",
      "name": "Receive handshake (2/2)",
      "difficulty": "easy",
      "description_md": "In this stage, you'll add support for receiving the [`PSYNC`](https://redis.io/commands/psync/) command from the replica.\n\n### Handshake (continued from previous stage)\n\nAs a recap, there are three parts to the handshake:\n\n- The master receives a `PING` from the replica (You've already implemented this)\n- The master receives `REPLCONF` twice from the replica (You've already implemented this)\n- The master receives `PSYNC` from the replica (**This stage**)\n\nAfter the replica sends `REPLCONF` twice, it'll send a `PSYNC ? -1` command to the master.\n\n- The first argument is `?`\n  - This is replication ID of the master, it is `?` because this is the first time the replica is connecting to the master.\n- The second argument is `-1`\n  - This is the replication offset, it is `-1` because this is the first time the replica is connecting to the master.\n\nThe final command you receive will look something like this:\n\n```\n*3\\r\\n$5\\r\\nPSYNC\\r\\n$1\\r\\n?\\r\\n$2\\r\\n-1\\r\\n\n```\n\n(That's `[\"PSYNC\", \"?\", \"-1\"]` encoded as a RESP Array)\n\nThe master needs to respond with `+FULLRESYNC <REPL_ID> 0\\r\\n` (\"FULLRESYNC <REPL_ID> 0\" encoded as a RESP Simple String). Here's what\nthe response means:\n\n- `FULLRESYNC` means that the master cannot perform incremental replication with the replica, and will thus start a \"full\" resynchronization.\n- `<REPL_ID>` is the replication ID of the master. You've already set this in the \"Replication ID & Offset\" stage.\n  - As an example, you can hardcode `8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb` as the replication ID.\n- `0` is the replication offset of the master. You've already set this in the \"Replication ID & Offset\" stage.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT>\n```\n\nIt'll then connect to your TCP server as a replica and execute the following commands:\n\n1. `PING` (expecting `+PONG\\r\\n` back)\n2. `REPLCONF listening-port <PORT>` (expecting `+OK\\r\\n` back)\n3. `REPLCONF capa eof capa psync2` (expecting `+OK\\r\\n` back)\n4. `PSYNC ? -1` (expecting `+FULLRESYNC <REPL_ID> 0\\r\\n` back)\n\n**Notes**:\n\n- In the response, `<REPL_ID>` needs to be replaced with the replication ID of the master which you've initialized in previous stages.\n",
      "marketing_md": "In this stage, you'll add support for accepting PSYNC, and starting a FULLRESYNC.\n"
    },
    {
      "slug": "repl-master-psync-rdb",
      "primary_extension_slug": "replication",
      "name": "Empty RDB Transfer",
      "difficulty": "easy",
      "description_md": "In this stage, you'll add support for sending an empty RDB file to the replica. This is part of the \"full resynchronization\" process.\n\n### Full resynchronization\n\nWhen a replica connects to a master for the first time, it sends a `PSYNC ? -1` command. This is the replica's way of\ntelling the master that it doesn't have any data yet, and needs to be fully resynchronized.\n\nThe master acknowledges this by sending a `FULLRESYNC` response to the replica.\n\nAfter sending the `FULLRESYNC` response, the master will then send a RDB file of its current state to the replica. The file\nis sent as a RESP Bulk String. The replica is expected to load the file into memory, replacing its current state.\n\nFor the purposes of this challenge, you don't have to actually construct an RDB file. We'll assume that the master's database is always empty,\nand just hardcode an empty RDB file to send to the replica.\n\nYou can find the hex representation of an empty RDB file [here](https://github.com/codecrafters-io/redis-tester/blob/main/internal/assets/empty_rdb_hex.md).\n\nThe tester will accept any valid RDB file that is empty, you don't need to send the exact file above.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT>\n```\n\nIt'll then connect to your TCP server as a replica and execute the following commands:\n\n1. `PING` (expecting `+PONG\\r\\n` back)\n2. `REPLCONF listening-port <PORT>` (expecting `+OK\\r\\n` back)\n3. `REPLCONF capa eof capa psync2` (expecting `+OK\\r\\n` back)\n4. `PSYNC ? -1` (expecting `+FULLRESYNC <REPL_ID> 0\\r\\n` back)\n\nAfter receiving a response to the last command, the tester will expect to receive an empty RDB file from your server.\n\n### Notes\n\n- The [RDB file link](https://github.com/codecrafters-io/redis-tester/blob/main/internal/assets/empty_rdb_hex.md) contains hex & base64 representations\n  of the file. You need to decode these into binary contents before sending it to the replica.\n- The RDB file should be sent as a RESP Bulk String, like this: `$<length>\\r\\n<contents>\\r\\n`\n  - `<length>` is the length of the file in bytes\n  - `<contents>` is the contents of the file\n- If you want to learn more about the RDB file format, read [this blog post](https://rdb.fnordig.de/file_format.html). This challenge\n  has a separate extension dedicated to reading RDB files.\n",
      "marketing_md": "In this stage, you'll add support for sending an empty RDB file to the replica. This is part of the \"full resynchronization\" process.\n"
    },
    {
      "slug": "repl-master-cmd-prop",
      "primary_extension_slug": "replication",
      "name": "Command Propagation",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for propagating write commands from a master to a replica.\n\n### Command propagation\n\nA master takes all write commands sent to it and propagates them to all connected replicas. The replicas\nprocess these commands and apply them to their own state.\n\nThis propagation starts after the handshake is complete and the master has sent the RDB file to the replica. Every\nwrite command is sent to the replica as a RESP array, and the replica processes it as if it were a command sent by a client. Unlike\nregular commands, in this case no response is sent from the replica. The master just keeps sending commands as they come in without stopping\nto read responses from the replica.\n\nCommands like `PING`, `ECHO` etc. are not considered \"write\" commands, so they aren't propagated. Commands like `SET`, `DEL` etc. are\nconsidered \"write\" commands, so they are propagated.\n\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n./spawn_redis_server.sh --port <PORT>\n```\n\nIt'll then connect to your TCP server as a replica and execute the following commands:\n\n1. `PING` (expecting `+PONG\\r\\n` back)\n2. `REPLCONF listening-port <PORT>` (expecting `+OK\\r\\n` back)\n3. `REPLCONF capa eof capa psync2` (expecting `+OK\\r\\n` back)\n4. `PSYNC ? -1` (expecting `+FULLRESYNC <REPL_ID> 0\\r\\n` back)\n\nThe tester will then wait for your server to send an RDB file.\n\nOnce the RDB file is received, the tester will send series of write commands to your program (as a separate Redis client, not the replica).\n\n```bash\n$ redis-cli SET foo 1\n$ redis-cli SET bar 2\n$ redis-cli SET baz 3\n```\n\nThe tester will then assert that these commands were propagated to the replica server.\n\n### Notes\n\n- In the official Redis implementation, replicas send periodic acknowledgements to the master letting it know how much of the replication stream they've\n  processed. We won't implement this in this challenge, we'll just assume that replicas process all commands sent to them in a timely manner.\n\n- A true implementation would buffer the commands so that they can be sent to the replica after it loads the RDB file. For the\n  purposes of this challenge, you can assume that the replica is ready to receive commands immediately after receiving the RDB file.\n",
      "marketing_md": "In this stage, you'll add support for finishing the sync handshake from the master side, by sending a RDB file.\n"
    },
    {
      "slug": "repl-cmd-processing",
      "primary_extension_slug": "replication",
      "name": "Command Processing",
      "difficulty": "hard",
      "description_md": "In this stage you'll add support for receiving commands sent by the Master server, asynchronously.\nThe Master will send only commands that alter the database, everything will be RESP encoded.\n\n### Tests\n\nThe tester will execute your program like this:\n(Note 2 servers are started, one as master, one as replica).\n\n```\n./spawn_redis_server.sh --port <PORT>\n./spawn_redis_server.sh --port <PORT> --replicaof <HOST> <PORT>\n```\n\nThe servers should finish the handshake between them. (PING, REPLCONF, PSYNC)\nIt'll then send `SET` commands to the master from a client.\n\n```bash\n$ redis-cli SET myKey \"Hello\"\n```\n\nIt'll then expect the commands to be propagated to the replica, and the replica to parse them, and apply them against its DB.\nIt will send `GET` requests to the replica from another client.\n\n```bash\n$ redis-cli GET myKey\n```\n\nIt'll expect to receive the correct values as sent to the Master.\n",
      "marketing_md": "In this stage, you'll add support for processing commands received by the replica from the master.\n"
    },
    {
      "slug": "repl-final-boss",
      "primary_extension_slug": "replication",
      "name": "Support multiple Replicas",
      "difficulty": "hard",
      "description_md": "Congratulations on reaching the final stage of the Redis replication challenge! By now, you should have a Redis master instance and at least one replica configured.\nIn this stage you'll aim to ensure your replication setup is robust, data between the master and replicas remain consistent, and your system can handle multiple replicas.\n\n### Tests\n\nThe tester will execute your program like this:\n(The spawn_redis.sh is not your implementation of Redis.)\n\n```\n./spawn_redis_server.sh --port <PORT>\n./spawn_redis.sh --replicaof localhost:6379 --port 6380\n./spawn_redis.sh --replicaof localhost:6379 --port 6381\n./spawn_redis.sh --replicaof localhost:6379 --port 6382\n```\n\nThe master should finish the handshake with all the replicas. (PING, REPLCONF, PSYNC)\nIt'll then send `SET` commands to the master from a client.\n\n```bash\n$ redis-cli SET mykey \"Hello\"\n```\n\nIt'll then expect the commands to be propagated to all the replicas, and the replicas to parse them, and apply them against its DB.\nIt will send `GET` requests to the replicas from another client.\n\n```bash\n$ redis-cli GET myKey\n```\n\nIt'll expect to receive the correct values as sent to the Master.\n",
      "marketing_md": "In this stage, you'll complete your implementation of Redis replication.\n"
    }
  ]
}
