export default {
  "slug": "http-server",
  "name": "Build your own HTTP server",
  "short_name": "HTTP server",
  "release_status": "live",
  "description_md": "HTTP is the protocol that powers the web. In this challenge, you'll build a HTTP server that's\ncapable of handling simple GET/POST requests, serving files and handling multiple concurrent connections.\n\nAlong the way, we'll learn about TCP connections, HTTP headers, HTTP verbs, handling multiple connections and more.",
  "short_description_md": "Learn about TCP servers, the HTTP protocol and more",
  "completion_percentage": 10,
  "concept_slugs": [
    "network-protocols",
    "tcp-overview"
  ],
  "languages": [
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
      "slug": "rust"
    },
    {
      "slug": "java",
      "release_status": "beta"
    },
    {
      "slug": "c",
      "release_status": "beta"
    },
    {
      "slug": "cpp",
      "release_status": "beta"
    },
    {
      "slug": "csharp",
      "release_status": "beta"
    },
    {
      "slug": "ruby",
      "release_status": "beta"
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
    "difficulty": "easy",
    "sample_extension_idea_title": "Pipelining",
    "sample_extension_idea_description": "A HTTP server that supports HTTP/1.1 pipelining",
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
      "slug": "http-compression",
      "name": "HTTP Compression",
      "description_markdown": "In this challenge extension you'll add [compression][http-compression] support to your HTTP server implementation.\n\nAlong the way you'll learn about compression, compression scheme negotiation and more.\n\n[http-compression]: https://en.wikipedia.org/wiki/HTTP_compression\n"
    }
  ],
  "stages": [
    {
      "slug": "at4",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server",
        "python-tcp-server"
      ],
      "name": "Bind to a port",
      "difficulty": "very_easy",
      "description_md": "In this stage, you'll create a TCP server that listens on port 4221.\n\n[TCP](https://www.cloudflare.com/en-ca/learning/ddos/glossary/tcp-ip/) is the underlying protocol used by HTTP servers.\n\n\n### Tests\n\nThe tester will execute your program like this:\n\n```\n$ ./your_server.sh\n```\n\nThen, the tester will try to connect to your server on port 4221. The connection must succeed for you to pass this stage.",
      "marketing_md": "In this stage, you'll build a TCP server that listens on port 4221."
    },
    {
      "slug": "ia4",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server",
        "python-tcp-server"
      ],
      "name": "Respond with 200",
      "difficulty": "very_easy",
      "description_md": "In this stage, your server will respond to an HTTP request with a `200` response.\n\n### HTTP response\n\nAn HTTP response is made up of three parts, each separated by a [CRLF](https://developer.mozilla.org/en-US/docs/Glossary/CRLF) (`\\r\\n`):\n1.  Status line.\n2.  Zero or more headers, each ending with a CRLF.\n3.  Optional response body.\n\nIn this stage, your server's response will only contain a status line. Here's the response your server must send:\n```javascript\nHTTP/1.1 200 OK\\r\\n\\r\\n\n```\n\nHere's a breakdown of the response:\n```javascript\n// Status line\nHTTP/1.1  // HTTP version\n200       // Status code\nOK        // Optional reason phrase\n\\r\\n      // CRLF that marks the end of the status line\n\n// Headers (empty)\n\\r\\n      // CRLF that marks the end of the headers\n\n// Response body (empty)\n```\n\n### Tests\n\nThe tester will execute your program like this:\n```bash\n$ ./your_server.sh\n```\n\nThe tester will then send an HTTP `GET` request to your server:\n```bash\n$ curl -v http://localhost:4221\n```\n\nYour server must respond to the request with the following response:\n```javascript\nHTTP/1.1 200 OK\\r\\n\\r\\n\n```\n\n### Notes\n\n- You can ignore the contents of the request. We'll cover parsing requests in later stages.\n- For more information about HTTP responses, see the [MDN Web Docs on HTTP responses](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_responses) or the [HTTP/1.1 specification](https://datatracker.ietf.org/doc/html/rfc9112#name-message).\n- This challenge uses HTTP/1.1.\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll extend your TCP server to respond to a HTTP request with a 200 response."
    },
    {
      "slug": "ih0",
      "name": "Extract URL path",
      "difficulty": "easy",
      "description_md": "In this stage, your server will extract the URL path from an HTTP request, and respond with either a `200` or `404`, depending on the path.\n\n### HTTP request\n\nAn HTTP request is made up of three parts, each separated by a [CRLF](https://developer.mozilla.org/en-US/docs/Glossary/CRLF) (`\\r\\n`):\n\n1.  Request line.\n2.  Zero or more headers, each ending with a CRLF.\n3.  Optional request body.\n\nHere's an example of an HTTP request:\n```javascript\nGET /index.html HTTP/1.1\\r\\nHost: localhost:4221\\r\\nUser-Agent: curl/7.64.1\\r\\nAccept: */*\\r\\n\\r\\n\n```\n\nHere's a breakdown of the request:\n```javascript\n// Request line\nGET                          // HTTP method\n/index.html                  // Request target\nHTTP/1.1                     // HTTP version\n\\r\\n                         // CRLF that marks the end of the request line\n\n// Headers\nHost: localhost:4221\\r\\n     // Header that specifies the server's host and port\nUser-Agent: curl/7.64.1\\r\\n  // Header that describes the client's user agent\nAccept: */*\\r\\n              // Header that specifies which media types the client can accept\n\\r\\n                         // CRLF that marks the end of the headers\n\n// Request body (empty)\n```\n\nThe \"request target\" specifies the URL path for this request. In this example, the URL path is `/index.html`.\n\nNote that each header ends in a CRLF, and the entire header section also ends in a CRLF.\n\n### Tests\n\nThe tester will execute your program like this:\n```bash\n$ ./your_server.sh\n```\n\nThe tester will then send two HTTP requests to your server.\n\nFirst, the tester will send a `GET` request, with a random string as the path:\n```bash\n$ curl -v http://localhost:4221/abcdefg\n```\n\nYour server must respond to this request with a `404` response:\n```javascript\nHTTP/1.1 404 Not Found\\r\\n\\r\\n\n```\n\nThen, the tester will send a `GET` request, with the path `/`:\n```bash\n$ curl -v http://localhost:4221\n```\n\nYour server must respond to this request with a `200` response:\n```javascript\nHTTP/1.1 200 OK\\r\\n\\r\\n\n```\n\n### Notes\n\n- You can ignore the headers for now. You'll learn about parsing headers in a later stage.\n- In this stage, the request target is written as a URL path. But the request target actually has [four possible formats](https://datatracker.ietf.org/doc/html/rfc9112#section-3.2). The URL path format is called the \"origin form,\" and it's the most commonly used format. The other formats are used for more niche scenarios, like sending a request through a proxy.\n- For more information about HTTP requests, see the [MDN Web Docs on HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_requests) or the [HTTP/1.1 specification](https://datatracker.ietf.org/doc/html/rfc9112#name-message).\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for returning a 404 response if a path isn't valid."
    },
    {
      "slug": "cn2",
      "name": "Respond with body",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement the `/echo/{str}` endpoint, which accepts a string and returns it in the response body.\n\n### Response body\n\nA response body is used to return content to the client. This content may be an entire web page, a file, a string, or anything else that can be represented with bytes.\n\nYour `/echo/{str}` endpoint must return a `200` response, with the response body set to given string, and with a `Content-Type` and `Content-Length` header.\n\nHere's an example of an `/echo/{str}` request:\n```javascript\nGET /echo/abc HTTP/1.1\\r\\nHost: localhost:4221\\r\\nUser-Agent: curl/7.64.1\\r\\nAccept: */*\\r\\n\\r\\n\n```\n\nAnd here's the expected response:\n```javascript\nHTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 3\\r\\n\\r\\nabc\n```\n\nHere's a breakdown of the response:\n```javascript\n// Status line\nHTTP/1.1 200 OK\n\\r\\n                          // CRLF that marks the end of the status line\n\n// Headers\nContent-Type: text/plain\\r\\n  // Header that specifies the format of the response body\nContent-Length: 3\\r\\n         // Header that specifies the size of the response body, in bytes\n\\r\\n                          // CRLF that marks the end of the headers\n\n// Response body\nabc                           // The string from the request\n```\n\nThe two headers are required for the client to be able to parse the response body. Note that each header ends in a CRLF, and the entire header section also ends in a CRLF.\n\n### Tests\n\nThe tester will execute your program like this:\n```bash\n$ ./your_server.sh\n```\n\nThe tester will then send a `GET` request to the `/echo/{str}` endpoint on your server, with some random string.\n```bash\n$ curl -v http://localhost:4221/echo/abc\n```\n\nYour server must respond with a `200` response that contains the following parts:\n- `Content-Type` header set to `text/plain`.\n- `Content-Length` header set to the length of the given string.\n- Response body set to the given string.\n```javascript\nHTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 3\\r\\n\\r\\nabc\n```\n\n### Notes\n- For more information about HTTP responses, see the [MDN Web Docs on HTTP responses](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#http_responses) or the [HTTP/1.1 specification](https://datatracker.ietf.org/doc/html/rfc9112#name-message).\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for responding with a custom body in your HTTP response."
    },
    {
      "slug": "fs3",
      "name": "Read header",
      "difficulty": "easy",
      "description_md": "In this stage, you'll implement the `/user-agent` endpoint, which reads the `User-Agent` request header and returns it in the response body.\n\n### The `User-Agent` header\n\nThe [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) header describes the client's user agent.\n\nYour `/user-agent` endpoint must read the `User-Agent` header, and return it in your response body. Here's an example of a `/user-agent` request:\n```javascript\n// Request line\nGET\n/user-agent\nHTTP/1.1\n\\r\\n\n\n// Headers\nHost: localhost:4221\\r\\n\nUser-Agent: foobar/1.2.3\\r\\n  // Read this value\nAccept: */*\\r\\n\n\\r\\n\n\n// Request body (empty)\n```\n\nHere is the expected response:\n```javascript\n// Status line\nHTTP/1.1 200 OK               // Status code must be 200\n\\r\\n\n\n// Headers\nContent-Type: text/plain\\r\\n\nContent-Length: 12\\r\\n\n\\r\\n\n\n// Response body\nfoobar/1.2.3                  // The value of `User-Agent`\n```\n\n### Tests\n\nThe tester will execute your program like this:\n```bash\n$ ./your_server.sh\n```\n\nThe tester will then send a `GET` request to the `/user-agent` endpoint on your server. The request will have a `User-Agent` header.\n```bash\n$ curl -v --header \"User-Agent: foobar/1.2.3\" http://localhost:4221/user-agent\n```\n\nYour server must respond with a `200` response that contains the following parts:\n- `Content-Type` header set to `text/plain`.\n- `Content-Length` header set to the length of the `User-Agent` value.\n- Message body set to the `User-Agent` value.\n```javascript\nHTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 12\\r\\n\\r\\nfoobar/1.2.3\n```\n\n### Notes\n- Header names are [case-insensitive](https://datatracker.ietf.org/doc/html/rfc9112#name-field-syntax).\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for parsing HTTP request headers."
    },
    {
      "slug": "ej5",
      "concept_slugs": [
        "network-protocols",
        "tcp-overview",
        "go-tcp-server",
        "rust-tcp-server",
        "python-tcp-server"
      ],
      "name": "Concurrent connections",
      "difficulty": "easy",
      "description_md": "In this stage, you'll add support for concurrent connections.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to either use threads or implement an\n[Event Loop](https://en.wikipedia.org/wiki/Event_loop) to do this. In JavaScript however, since [the concurrency\nmodel itself is based on an event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), most\nstandard library functions are designed to support this kind of concurrent behaviour out of the box. **It is very\nlikely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_javascript}}\n\n{{#lang_is_typescript}}\nIn most languages, you'd need to either use threads or implement an\n[Event Loop](https://en.wikipedia.org/wiki/Event_loop) to do this. In TypeScript however, since [the concurrency\nmodel itself is based on an event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), most\nstandard library functions are designed to support this kind of concurrent behaviour out of the box. **It is very\nlikely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_typescript}}\n\n### Tests\n\nThe tester will execute your program like this:\n```bash\n$ ./your_server.sh\n```\n\nThen, the tester will create multiple concurrent TCP connections to your server. (The exact number of connections is determined at random.) After that, the tester will send a single `GET` request through each of the connections.\n```bash\n$ (sleep 3 && printf \"GET / HTTP/1.1\\r\\n\\r\\n\") | nc localhost 4221 &\n$ (sleep 3 && printf \"GET / HTTP/1.1\\r\\n\\r\\n\") | nc localhost 4221 &\n$ (sleep 3 && printf \"GET / HTTP/1.1\\r\\n\\r\\n\") | nc localhost 4221 &\n```\n\nYour server must respond to each request with the following response:\n```javascript\nHTTP/1.1 200 OK\\r\\n\\r\\n\n```\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for handling multiple concurrent connections."
    },
    {
      "slug": "ap6",
      "name": "Return a file",
      "difficulty": "medium",
      "description_md": "In this stage, you'll implement the `/files/{filename}` endpoint, which returns a requested file to the client.\n\n### Tests\nThe tester will execute your program with a `--directory` flag. The `--directory` flag specifies the directory where the files are stored, as an absolute path.\n```\n$ ./your_server.sh --directory /tmp/\n```\n\nThe tester will then send two `GET` requests to the `/files/{filename}` endpoint on your server.\n\n#### First request\nThe first request will ask for a file that exists in the files directory:\n```\n$ echo -n 'Hello, World!' > /tmp/foo\n$ curl -i http://localhost:4221/files/foo\n```\n\nYour server must respond with a `200` response that contains the following parts:\n- `Content-Type` header set to `application/octet-stream`.\n- `Content-Length` header set to the size of the file, in bytes.\n- Response body set to the file contents.\n```\nHTTP/1.1 200 OK\\r\\nContent-Type: application/octet-stream\\r\\nContent-Length: 14\\r\\n\\r\\nHello, World!\n```\n\n#### Second request\nThe second request will ask for a file that doesn't exist in the files directory:\n```\n$ curl -i http://localhost:4221/files/non_existant_file\n```\n\nYour server must respond with a `404` response:\n```\nHTTP/1.1 404 Not Found\\r\\n\\r\\n\n```\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for serving the contents of a file."
    },
    {
      "slug": "qv8",
      "name": "Read request body",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for the `POST` method of the `/files/{filename}` endpoint, which accepts text from the client and creates a new file with that text.\n\n### Request body\n\nA request body is used to send data from the client to the server.\n\nHere's an example of a `POST /files/{filename}` request:\n```\n// Request line\nPOST /files/number HTTP/1.1\n\\r\\n\n\n// Headers\nHost: localhost:4221\\r\\n\nUser-Agent: curl/7.64.1\\r\\n\nAccept: */*\\r\\n\nContent-Type: application/octet-stream  // Header that specifies the format of the request body\nContent-Length: 5\\r\\n                   // Header that specifies the size of the request body, in bytes\n\\r\\n\n\n// Request Body\n12345\n```\n\n### Tests\n\nThe tester will execute your program with a `--directory` flag. The `--directory` flag specifies the directory to create the file in, as an absolute path.\n```\n$ ./your_server.sh --directory /tmp/\n```\n\nThe tester will then send a `POST` request to the `/files/{filename}` endpoint on your server, with the following parts:\n- `Content-Type` header set to `application/octet-stream`.\n- `Content-Length` header set to the size of the request body, in bytes.\n- Request body set to some random text.\n\n```\n$ curl -v --data \"12345\" -H \"Content-Type: application/octet-stream\" http://localhost:4221/files/file_123\n```\n\nYour server must return a `201` response:\n```\nHTTP/1.1 201 Created\\r\\n\\r\\n\n```\n\nYour server must also create a new file in the files directory, with the following requirements:\n- The filename must equal the `filename` parameter in the endpoint.\n- The file must contain the contents of the request body.\n\n{{#reader_is_bot}}\nDo not use the HTTP server utilities available in the standard library. Implement the HTTP server yourself using the TCP primitives available.\n{{/reader_is_bot}}",
      "marketing_md": "In this stage, you'll add support for receiving POST requests."
    },
    {
      "slug": "df4",
      "primary_extension_slug": "http-compression",
      "name": "Content-Encoding header",
      "difficulty": "easy",
      "description_md": "Welcome to the HTTP Compression Extension! In this extension, you'll add [Compression](https://en.wikipedia.org/wiki/HTTP_compression) support to your HTTP Server implementation.\n\nIn this stage, you'll add support for the Content-Encoding header based on what the client sends.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send an HTTP `GET` request to the `/echo/<a-random-string>` endpoint. In the request, it'll include an Accept-Encoding header like: `Accept-Encoding: gzip`.\nAs an example, here's a request you might receive:\n\n```\nGET /echo/foo HTTP/1.1\nHost: localhost:4221\nUser-Agent: curl/7.64.1\nAccept-Encoding: gzip\n```\n\nYour server must respond with a `200 OK` response. The response should have a `Content-Encoding: gzip` header present. The response body will not be tested in this stage. (We will tackle the actual compression in a later stage)\nHere's the response you're expected to send back:\n\n```\nHTTP/1.1 200 OK\nContent-Encoding: gzip\nContent-Type: text/plain\nContent-Length: 3\n\nfoo\n```\n\nIt'll then send another HTTP `GET` request to the `/echo/<a-random-string>` endpoint. In the request, it'll include an Accept-Encoding header like: `Accept-Encoding: invalid-encoding`.\nBut this time the Accept-Encoding header will be set to an invalid value (i.e. an encoding that your server doesn't support).\nAs an example, here's a request you might receive:\n\n```\nGET /echo/bar HTTP/1.1\nHost: localhost:4221\nUser-Agent: curl/7.64.1\nAccept-Encoding: invalid-encoding\n```\n\nYour server must respond with a `200 OK` response. The response should NOT have a `Content-Encoding` header present. The response body will not be tested in this stage.\nHere's the response you're expected to send back:\n\n```\nHTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 3\n\nbar\n```\n\n### Notes\n\n1.  Header names are case-insensitive, i.e. `accept-encoding: gzip` and `Accept-Encoding: gzip` are equivalent. We won't test this explicitly in this challenge, but it's a good practice to lowercase your header names before comparison.\n",
      "marketing_md": "In this stage, you'll add support for reading the `Accept-Encoding` header sent by clients, and respond with `Content-Encoding` header in your response.\n"
    },
    {
      "slug": "ij8",
      "primary_extension_slug": "http-compression",
      "name": "Multiple compression schemes",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for choosing a compression scheme when multiple values are passed in via the `Accept-Encoding` header.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send an HTTP `GET` request to the `/echo/<a-random-string>` endpoint. In the request, it'll include an Accept-Encoding header set to multiple values, like: `Accept-Encoding: encoding-1, gzip, encoding-2`.\nOne of the values in the list will be `gzip`, but the other values will be invalid encoding names.\n\nAs an example, here's a request you might receive:\n\n```\nGET /echo/foo HTTP/1.1\nHost: localhost:4221\nUser-Agent: curl/7.64.1\nAccept-Encoding: encoding-1, gzip, encoding-2\n```\n\nYour server must respond with a `200 OK` response. The response should have a `Content-Encoding: gzip` header present. The response body will not be tested in this stage. (We will tackle the actual compression in a later stage)\nHere's the response you're expected to send back:\n\n```\nHTTP/1.1 200 OK\nContent-Encoding: gzip\nContent-Type: text/plain\nContent-Length: 3\n\nfoo\n```\n\nIt'll then send another HTTP `GET` request to the `/echo/<a-random-string>` endpoint. In the request, it'll include an Accept-Encoding header like: `Accept-Encoding: encoding-1, encoding-2`.\nBut this time the Accept-Encoding header will not contain gzip, it'll only contain invalid values (i.e. encodings that your server doesn't support).\nAs an example, here's a request you might receive:\n\n```\nGET /echo/bar HTTP/1.1\nHost: localhost:4221\nUser-Agent: curl/7.64.1\nAccept-Encoding: encoding-1, encoding-2\n```\n\nYour server must respond with a `200 OK` response. The response should NOT have a `Content-Encoding` header present. The response body will not be tested in this stage.\nHere's the response you're expected to send back:\n\n```\nHTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 3\n\nbar\n```\n\n### Notes\n\n1.  Header names are case-insensitive, i.e. `accept-encoding: gzip` and `Accept-Encoding: gzip` are equivalent. We won't test this explicitly in this challenge, but it's a good practice to lowercase your header names before comparison.\n",
      "marketing_md": "In this stage, you'll add support for reading multiple compression values from `Accept-Encoding` header sent by clients, and respond with `Content-Encoding` header in your response.\n"
    },
    {
      "slug": "cr8",
      "primary_extension_slug": "http-compression",
      "name": "Gzip compression",
      "difficulty": "medium",
      "description_md": "In this stage, you'll add support for returning responses compressed using gzip.\n\n### Tests\n\nThe tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send an HTTP `GET` request to the `/echo/<a-random-string>` endpoint. In the request, it'll include an Accept-Encoding header like: `Accept-Encoding: gzip`.\nAs an example, here's a request you might receive:\n\n```\nGET /echo/foo HTTP/1.1\nHost: localhost:4221\nUser-Agent: curl/7.64.1\nAccept-Encoding: gzip\n```\n\nYour server must respond with a `200 OK` response. The response should have a `Content-Encoding: gzip` header present. The response body should be the random string sent in the request, gzip encoded. And the `Content-Length` header should be the length of the gzip encoded data.\nHere's the response you're expected to send back:\nIf the raw string was `foo`, the hex encoded data would be `gzip-encoded-data`\nHex representation of it would be `1f8b08008c643b6602ff4bcbcf07002165738c03000000`\n\n```\nHTTP/1.1 200 OK\nContent-Encoding: gzip\nContent-Type: text/plain\nContent-Length: 23\n\ngzip-encoded-data\n```\n",
      "marketing_md": "In this stage, you'll add support for encoding the response body using `gzip`.\n"
    }
  ]
}
