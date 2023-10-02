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
    }
  ],
  "stages": [
    {
      "slug": "init",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview"
      ],
      "name": "Bind to a port",
      "description_md": "In this stage, your task is to start a TCP server on port 6379, the default port that redis uses.",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll start a TCP server on port 6379, which is the\ndefault port that Redis uses.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_bind.go#L11"
    },
    {
      "slug": "ping-pong",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview"
      ],
      "name": "Respond to PING",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command.\n\nThe tester will execute your program like this:\n\n```bash\n$ ./spawn_redis_server.sh\n```\n\nIt'll then send a `PING` command to your server and expect a `+PONG\\r\\n` response.\n\n```bash\n$ redis-cli PING\n```\n\nYour server should respond with `+PONG\\r\\n`, which is \"PONG\" encoded as a [RESP simple string](https://redis.io/docs/reference/protocol-spec/#resp-simple-strings).\n\nYou can ignore the data that the tester sends you for this stage. We'll get to parsing\nclient input in later stages. For now, you can just hardcode `+PONG\\r\\n` as the response.\n\n**Note**: The exact bytes your program will receive won't be just `ping`, you'll receive something like this: `*1\\r\\n$4\\r\\nping\\r\\n`,\nwhich is the Redis protocol encoding of the `PING` command. We'll learn more about this in later stages.",
      "marketing_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command. You'll use [the Redis\nprotocol](https://redis.io/topics/protocol) to encode the reply.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L9"
    },
    {
      "slug": "ping-pong-multiple",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview"
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
        "tcp-overview"
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
      "description_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command.\n\nThe client will send you the command as a RESP array, which looks\nsomething like this:\n\n```\n*2\\r\\n$4\\r\\nECHO\\r\\n$3\\r\\nhey\\r\\n\n```\n\nSeems confusing? Read up about [sending commands to a Redis\nserver](https://redis.io/docs/reference/protocol-spec/#send-commands-to-a-redis-server).",
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
      "description_md": "In this stage, you'll need to support setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.\n\nThe tester will first send a `SET` command with an expiry, like this: `SET <key> <value> PX <expiry>`.\nThen, it will send a `GET` command to retrieve the value, like this: `GET <key>`. If the key has expired, the\ntester will expect a Null value as the response. Read about \"Null Bulk Strings\"\n[here](https://redis.io/docs/reference/protocol-spec/#resp-bulk-strings) to know how to send a Null value.\n\n{{#lang_is_haskell}}\nThe [time](https://hackage.haskell.org/package/time) package is available\nto use as a dependency.\n{{/lang_is_haskell}}",
      "marketing_md": "In this stage, you'll add support for setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/master/internal/test_expiry.go"
    },
    {
      "slug": "rdb-config",
      "primary_extension_slug": "persistence-rdb",
      "name": "RDB file config",
      "difficulty": "easy",
      "description_md": "Redis uses `.rdb` files for persistence. In this stage, you'll add support for reading the config values related to where RDB files are stored.\n\nThere are two config values that determine where RDB files are stored:\n\n- `dir`: The directory where RDB files are stored\n- `dbfilename`: The name of the RDB file\n\nThese values will be passed into your program like this:\n\n```\n./spawn_redis_server.sh --dir /tmp/redisfiles --dbfilename dump.rdb\n```\n\nTo verify whether your program is reading config values correctly, the tester will send you two commands:\n\n```bash\nredis-cli CONFIG GET dir\nredis-cli CONFIG GET dbfilename\n```\n\nThe response to `CONFIG GET <key>` should be a RESP array with two elements: the key and the value.\n\nFor example, let's say the `dir` value is `/tmp/redis-files`. The expected response will be:\n\n```\n*2\\r\\n$3\\r\\ndir\\r\\n$16\\r\\n/tmp/redis-files\\r\\n\n```\n\n- `*2\\r\\n` indicates that the array has two elements\n- `$3\\r\\ndir\\r\\n` indicates that the first element is a bulk string with the value `dir`\n- `$16\\r\\n/tmp/redis-files\\r\\n` indicates that the second element is a bulk string with the value `/tmp/redis-files`\n",
      "marketing_md": "In this stage, you'll add support for reading the config values related to where RDB files are stored. You'll implement the `CONFIG GET` command.\n"
    },
    {
      "slug": "rdb-read-key",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read a key",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading a key from an RDB file.\n\nTo keep things simple, we'll start out by supporting RDB files that contain a single key.\n\nJan-Erik Rediger (author of [rdb-rs](https://rdb.fnordig.de/)) has a great [blog post](https://jan-erik.red/blog/2019/12/30/redis-rdb-file-format/)\nthat explains the RDB file format in detail. We recommended using it as a reference when working on this stage.\n\nThe tester will create an RDB file with a single key and execute your program like this:\n\n```\n./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send a `keys *` command to your server.\n\n```bash\n$ redis-cli keys \"*\"\n```\n\nThe response to `keys *` should be a RESP array with one element: the key.\n\nFor example, let's say the RDB file contains a key called `foo`. The expected response will be:\n\n```\n*1\\r\\n$3\\r\\nfoo\\r\\n\n```\n\n- `*1\\r\\n` indicates that the array has one element\n- `$3\\r\\nfoo\\r\\n` indicates that the first element is a bulk string with the value `foo`\n\n**Note**: Remember, in this stage you only need to support RDB files that contain a single key, and you can ignore the value of the key. We'll\nget to handling multiple keys and reading values in later stages.\n",
      "marketing_md": "In this stage, you'll add support for reading a key from an RDB file that contains a single key-value pair. You'll do this by implementing the `KEYS *` command.\n"
    },
    {
      "slug": "rdb-read-string-value",
      "primary_extension_slug": "persistence-rdb",
      "name": "Read a string value",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for reading the value corresponding to a key from an RDB file.\n\nJust like with the previous stage, we'll stick to supporting RDB files that contain a single key for now.\n\nThe tester will create an RDB file with a single key and execute your program like this:\n\n```\n./spawn_redis_server.sh --dir <dir> --dbfilename <filename>\n```\n\nIt'll then send a `get <key>` command to your server.\n\n```bash\n$ redis-cli get \"foo\"\n```\n\nThe response to `get <key>` should be a RESP bulk string with the value of the key.\n\nFor example, let's say the RDB file contains a key called `foo` with the value `bar`. The expected response will be `$3\\r\\nbar\\r\\n`.\n\nStrings can be encoded in three different ways in the RDB file format:\n\n- Length-prefixed strings\n- Integers as strings\n- Compressed strings\n\nIn this stage, you only need to support length-prefixed strings. We won't cover the other two types in this challenge.\n\nWe recommend using [this blog post](https://jan-erik.red/blog/2019/12/30/redis-rdb-file-format/) as a reference when working on this stage.\n",
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
    }
  ]
}
