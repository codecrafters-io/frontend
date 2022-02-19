export default {
  "slug": "redis",
  "name": "Build your own Redis",
  "release_status": "live",
  "description_md": "In this challenge, you'll build a toy Redis clone\nthat's capable of handling basic commands like PING, GET\nand SET. Along the way, we'll learn about event loops, the Redis\nProtocol and more.\n",
  "short_description_md": "Learn about TCP servers, events loops, the Redis protocol and more\n",
  "completion_percentage": 30,
  "early_access_languages": [
    "crystal",
    "clojure"
  ],
  "supported_languages": [
    "python",
    "ruby",
    "go",
    "rust",
    "c",
    "haskell",
    "elixir",
    "php",
    "javascript",
    "java"
  ],
  "starter_repos": {
    "c": "https://github.com/codecrafters-io/redis-starter-c",
    "clojure": "https://github.com/codecrafters-io/redis-starter-clojure",
    "crystal": "https://github.com/codecrafters-io/redis-starter-crystal",
    "elixir": "https://github.com/codecrafters-io/redis-starter-elixir",
    "go": "https://github.com/codecrafters-io/redis-starter-go",
    "haskell": "https://github.com/codecrafters-io/redis-starter-haskell",
    "java": "https://github.com/codecrafters-io/redis-starter-java",
    "javascript": "https://github.com/codecrafters-io/redis-starter-javascript",
    "php": "https://github.com/codecrafters-io/redis-starter-php",
    "python": "https://github.com/codecrafters-io/redis-starter-python",
    "ruby": "https://github.com/codecrafters-io/redis-starter-ruby",
    "rust": "https://github.com/codecrafters-io/redis-starter-rust",
    "swift": "https://github.com/codecrafters-io/redis-starter-swift"
  },
  "marketing": {
    "description": "Learn about TCP servers, event loops, the Redis protocol and more",
    "difficulty": "medium",
    "introduction_md": "In this challenge, you’ll build an application that can speak the Redis\nprotocol, and is capable of serving basic commands like PING, ECHO, SET and\nGET. Along the way, you’ll learn about TCP servers, event loops and more.\n",
    "testimonials": [
      {
        "author_name": "Charles Guo",
        "author_description": "Software Engineer, Stripe",
        "author_avatar": "/images/testimonials/charles_guo.jpeg",
        "link": "https://github.com/shaldengeki",
        "text": "The Redis challenge was extremely fun. I ended up having to read the\nRedis Protocol specification doc pretty carefully in its entirety! The result\nfelt like lightly-guided independent study, if that makes sense. (Which, again, was lots of fun)\n"
      },
      {
        "author": "Patrick Burris",
        "author_description": "Senior Software Developer, CenturyLink",
        "author_avatar": "/images/testimonials/patrick_burris.jpeg",
        "link": "https://github.com/Jumballaya",
        "text": "I think the instant feedback right there in the git push is really cool.\nDidn't even know that was possible!\n"
      }
    ]
  },
  "stages": [
    {
      "slug": "init",
      "name": "Bind to a port",
      "description_md": "In this stage, your task is to start a TCP server on port 6379, the default port that Redis uses.\n",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll start a TCP server on port 6379, which is the\ndefault port that Redis uses.\n"
    },
    {
      "slug": "ping-pong",
      "name": "Respond to PING",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command.\n\nSince the tester client _only_ sends `PING` at the moment, it's okay to\nignore what the client sends and hardcode a response. We'll get to parsing\nclient input in later stages.\n\nKeep in mind that Redis clients & servers speak the Redis protocol, so\njust sending \"PONG\" back won't suffice. You'll need to encode it as a\n[RESP simple\nstring](https://redis.io/topics/protocol#resp-simple-strings).\n",
      "marketing_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command. You'll use [the Redis\nprotocol](https://redis.io/topics/protocol) to encode the reply.\n"
    },
    {
      "slug": "ping-pong-multiple",
      "name": "Respond to multiple PINGs",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same client.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to run a loop that reads input from a client and sends a\nresponse back. In JavaScript however, if you're listening to the\n[`data`](https://nodejs.org/api/net.html#net_event_data) event, this should be automatically handled for you. It\nis very likely that the code you had for the previous stage will pass this stage without any changes!\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nYou'll need to run a loop that reads input from a client and sends a\nresponse back.\n{{/lang_is_javascript}}\n",
      "marketing_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same client.\n"
    },
    {
      "slug": "concurrent-clients",
      "name": "Handle concurrent clients",
      "difficulty": "medium",
      "description_md": "In this stage, your server will need to handle multiple concurrent\nclients. Just like the previous stages, all clients will only send `PING`\ncommands for now.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to either use threads or implement an\n[Event Loop](https://en.wikipedia.org/wiki/Event_loop) to do this. In JavaScript however, since [the concurrency\nmodel itself is based on an event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), most\nstandard library functions are designed to support this kind of concurrent behaviour out of the box. It is very\nlikely that the code you had for the previous stage will pass this stage without any changes!\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nTo achieve this, you'll need to either use threads, or, if you're feeling\nadventurous, an [Event Loop](https://en.wikipedia.org/wiki/Event_loop) (like\nthe official Redis implementation does).\n{{/lang_is_javascript}}\n",
      "marketing_md": "In this stage, you'll add support for multiple concurrent clients to your\nRedis server. To achieve this you'll use an [Event\nLoop](https://en.wikipedia.org/wiki/Event_loop),\nlike the official Redis implementation does.\n"
    },
    {
      "slug": "echo",
      "name": "Implement the ECHO command",
      "difficulty": "medium",
      "description_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command.\n\nThe client will send you the command as a RESP array, which looks\nsomething like this:\n\n```\n*2\\r\\n$4\\r\\nECHO\\r\\n$3\\r\\nhey\\r\\n\n```\n\nSeems confusing? Read up about [sending commands to a Redis\nserver](https://redis.io/topics/protocol#sending-commands-to-a-redis-server).\n",
      "marketing_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command. You'll parse user input\naccording to the [the Redis protocol\nspecification](https://redis.io/topics/protocol).\n"
    },
    {
      "slug": "set_get",
      "name": "Implement the SET & GET commands",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to implement the [SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands. For now, you can ignore all extra\noptions for `SET` and just implement the simple form: `SET key value`. You'll add support\nfor expiry in the next stage.\n",
      "marketing_md": "In this stage, you'll need to implement the\n[SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands.\n"
    },
    {
      "slug": "expiry",
      "name": "Expiry",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to support setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.\n\n{{#lang_is_haskell}}\nThe [time](https://hackage.haskell.org/package/time) package is available\nto use as a dependency.\n{{/lang_is_haskell}}\n",
      "marketing_md": "In this stage, you'll add support for setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command."
    }
  ]
}
