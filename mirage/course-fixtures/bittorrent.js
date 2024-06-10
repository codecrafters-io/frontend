export default {
  "slug": "bittorrent",
  "name": "Build your own BitTorrent",
  "short_name": "BitTorrent",
  "release_status": "live",
  "description_md": "BitTorrent is a peer-to-peer file sharing protocol used for distributing large amounts of data. In this challenge, you'll\nbuild a BitTorrent client that's capable of downloading a publicly available file using the BitTorrent protocol.\n\nAlong the way, you'll learn about the BitTorrent protocol, .torrent files more.",
  "short_description_md": "Learn about .torrent files, the BitTorrent Peer Protocol and more",
  "completion_percentage": 15,
  "languages": [
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
      "slug": "elixir",
      "release_status": "beta"
    },
    {
      "slug": "go"
    },
    {
      "slug": "haskell",
      "release_status": "beta"
    },
    {
      "slug": "java",
      "release_status": "beta"
    },
    {
      "slug": "javascript"
    },
    {
      "slug": "kotlin",
      "release_status": "beta"
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
      "slug": "zig",
      "release_status": "beta"
    },
    {
      "slug": "typescript",
      "release_status": "beta"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "Multiple Peers",
    "sample_extension_idea_description": "A bittorrent client that can download a file by combining pieces from multiple peers",
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
  "stages": [
    {
      "slug": "ns2",
      "name": "Decode bencoded strings",
      "difficulty": "very_easy",
      "description_md": "[Bencode](https://en.wikipedia.org/wiki/Bencode) (pronounced *Bee-encode*) is a serialization format used in [the BitTorrent protocol](https://www.bittorrent.org/beps/bep_0003.html). It is used in torrent files and in communication between trackers and peers.\n\nBencode supports four data types:\n- strings\n- integers\n- arrays\n- dictionaries\n\nIn this stage, we'll focus on decoding strings.\n\nStrings are encoded as `<length>:<contents>`. For example, the string `\"hello\"` is encoded as `\"5:hello\"`.\n\nYou'll implement a `decode` command which takes a bencoded value as input and prints the decoded value as JSON.\n\nHere’s how the tester will execute your program:\n\n```\n$ ./your_bittorrent.sh decode 5:hello\n\"hello\"\n```",
      "marketing_md": "[Bencode](https://en.wikipedia.org/wiki/Bencode) is a binary serialization format used in BitTorrent protocol. In this stage, you’ll decode a bencoded string."
    },
    {
      "slug": "eb4",
      "name": "Decode bencoded integers",
      "difficulty": "easy",
      "description_md": "In this stage, you'll extend the `decode` command to support bencoded integers.\n\nIntegers are encoded as `i<number>e`. For example, `52` is encoded as `i52e` and `-52` is encoded as `i-52e`.\n\nHere's how the tester will execute your program:\n\n```\n$ ./your_bittorrent.sh decode i52e\n52\n```\n\n{{#lang_is_go}}\nIf you'd prefer to use a library for this stage, [bencode-go](https://github.com/jackpal/bencode-go) is available for you to use.\n{{/lang_is_go}}\n{{#lang_is_python}}\nIf you'd prefer to use a library for this stage, [bencode.py](https://pypi.org/project/bencode.py/) is available for you to use.\n{{/lang_is_python}}\n{{#lang_is_rust}}\nIf you'd prefer to use a library crate for this stage, [serde-bencode](https://github.com/toby/serde-bencode/) is available for you to use.\n{{/lang_is_rust}}\n{{#lang_is_java}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_java}}\n{{#lang_is_kotlin}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_kotlin}}",
      "marketing_md": "In this stage, you’ll decode a bencoded integer."
    },
    {
      "slug": "ah1",
      "name": "Decode bencoded lists",
      "difficulty": "easy",
      "description_md": "In this stage, you'll extend the `decode` command to support bencoded lists.\n\nLists are encoded as `l<bencoded_elements>e`.\n\nFor example, `[\"hello\", 52]` would be encoded as `l5:helloi52ee`. Note that there are no separators between the elements.\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh decode l5:helloi52ee\n[“hello”,52]\n```\n\n{{#lang_is_go}}\nIf you'd prefer to use a library for this stage, [bencode-go](https://github.com/jackpal/bencode-go) is available for you to use.\n{{/lang_is_go}}\n{{#lang_is_python}}\nIf you'd prefer to use a library for this stage, [bencode.py](https://pypi.org/project/bencode.py/) is available for you to use.\n{{/lang_is_python}}\n{{#lang_is_rust}}\nIf you'd prefer to use a library crate for this stage, [serde-bencode](https://github.com/toby/serde-bencode/) is available for you to use.\n{{/lang_is_rust}}\n{{#lang_is_java}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_java}}\n{{#lang_is_kotlin}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_kotlin}}",
      "marketing_md": "In this stage, you’ll decode a bencoded list."
    },
    {
      "slug": "mn6",
      "name": "Decode bencoded dictionaries",
      "difficulty": "easy",
      "description_md": "In this stage, you'll extend the `decode` command to support bencoded dictionaries.\n\nA dictionary is encoded as `d<key1><value1>...<keyN><valueN>e`. `<key1>`, `<value1>` etc. correspond to the bencoded keys & values. The keys are sorted in lexicographical order and must be strings.\n\nFor example, `{\"hello\": 52, \"foo\":\"bar\"}` would be encoded as: `d3:foo3:bar5:helloi52ee` (note that the keys were reordered).\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh decode d3:foo3:bar5:helloi52ee\n{\"foo\":\"bar\",\"hello\":52}\n```\n\n{{#lang_is_go}}\nIf you'd prefer to use a library for this stage, [bencode-go](https://github.com/jackpal/bencode-go) is available for you to use.\n{{/lang_is_go}}\n{{#lang_is_python}}\nIf you'd prefer to use a library for this stage, [bencode.py](https://pypi.org/project/bencode.py/) is available for you to use.\n{{/lang_is_python}}\n{{#lang_is_rust}}\nIf you'd prefer to use a library crate for this stage, [serde-bencode](https://github.com/toby/serde-bencode/) is available for you to use.\n{{/lang_is_rust}}\n{{#lang_is_java}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_java}}\n{{#lang_is_kotlin}}\nIf you'd prefer to use a library for this stage, [bencode](https://github.com/dampcake/bencode) parser is available for you to use.\n{{/lang_is_kotlin}}",
      "marketing_md": "In this stage, you’ll decode a bencoded dictionary."
    },
    {
      "slug": "ow9",
      "name": "Parse torrent file",
      "difficulty": "easy",
      "description_md": "In this stage, you'll parse a torrent file and print information about the torrent.\n\nA torrent file (also known as a [metainfo file](https://www.bittorrent.org/beps/bep_0003.html#metainfo-files)) contains a bencoded dictionary with the following keys and values:\n\n- `announce`:\n    - URL to a \"tracker\", which is a central server that keeps track of peers participating in the sharing of a torrent.\n- `info`:\n    - A dictionary with keys:\n        - `length`: size of the file in bytes, for single-file torrents\n        - `name`: suggested name to save the file / directory as\n        - `piece length`: number of bytes in each piece\n        - `pieces`: concatenated SHA-1 hashes of each piece\n\n{{#lang_is_java}}\n**Note**: .torrent files contain bytes that aren’t valid UTF-16 characters. You’ll run into problems if you try to read the contents of this file as a `String`. Use `byte[]` instead.\n{{/lang_is_java}}\n{{#lang_is_kotlin}}\n**Note**: .torrent files contain bytes that aren’t valid UTF-16 characters. You’ll run into problems if you try to read the contents of this file as a `String`. Use `byte[]` instead.\n{{/lang_is_kotlin}}\n{{#lang_is_rust}}\n**Note:** .torrent files contain bytes that aren’t valid UTF-8 characters. You'll run into problems if you try to read the contents of this file as a `String`. Use `&[u8]` or `Vec<u8>` instead.\n{{/lang_is_rust}}\n{{#lang_is_elixir}}\n**Note:** .torrent files contain bytes that aren’t valid UTF-8 characters. You'll run into problems if you try to read the contents of this file as a `String`. Use `binary` instead, see `IO.iodata_to_binary()`.\n{{/lang_is_elixir}}\n\n{{^lang_is_java}}\n{{^lang_is_kotlin}}\n{{^lang_is_rust}}\n{{^lang_is_elixir}}\n**Note:** .torrent files contain bytes that aren’t valid UTF-8 characters. If the language you're using treats strings as a sequence of unicode characters (like Python's [str](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)), you'll need to use a byte sequence (like Python's [bytes](https://docs.python.org/3/library/stdtypes.html#bytes-objects)) instead.\n{{/lang_is_elixir}}\n{{/lang_is_rust}}\n{{/lang_is_kotlin}}\n{{/lang_is_java}}\n\n**Note**: The `info` dictionary looks slightly different for multi-file torrents. For this challenge, we'll only implement support for single-file torrents.\n\nIn this stage, we'll focus on extracting the tracker URL and the length of the file (in bytes).\n\nHere’s how the tester will execute your program:\n\n```\n$ ./your_bittorrent.sh info sample.torrent\n```\n\nand here’s the output it expects:\n\n```\nTracker URL: http://bittorrent-test-tracker.codecrafters.io/announce\nLength: 92063\n```",
      "marketing_md": "In this stage, you’ll parse a .torrent file and extract information about the torrent."
    },
    {
      "slug": "rb2",
      "name": "Calculate info hash",
      "difficulty": "medium",
      "description_md": "Info hash is a unique identifier for a torrent file. It's used when talking to trackers or peers.\n\nIn this stage, you'll calculate the info hash for a torrent file and print it in hexadecimal format.\n\nTo calculate the info hash, you'll need to:\n\n- Extract the `info` dictionary from the torrent file after parsing\n- Bencode the contents of the `info` dictionary\n- Calculate the SHA-1 hash of this bencoded dictionary\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh info sample.torrent\n```\nand here’s the output it expects:\n```\nTracker URL: http://bittorrent-test-tracker.codecrafters.io/announce\nLength: 92063\nInfo Hash: d69f91e6b2ae4c542468d1073a71d4ea13879a7f\n```",
      "marketing_md": "In this stage, you'll calculate a unique identifier for a torrent, known as info hash, used in communication with trackers and peers."
    },
    {
      "slug": "bf7",
      "name": "Piece hashes",
      "difficulty": "easy",
      "description_md": "In a torrent, a file is split into equally-sized parts called **pieces**. A piece is usually 256 KB or 1 MB in size.\n\nEach piece is assigned a SHA-1 hash value. On public networks, there may be malicious peers that send fake data. These hash values allow us to verify the integrity of each piece that we'll download.\n\nPiece length and piece hashes are specified in the `info` dictionary of the torrent file under the following keys:\n\n- `piece length`: number of bytes in each piece, an integer\n- `pieces`: concatenated SHA-1 hashes of each piece (20 bytes each), a string\n\nThe [BitTorrent Protocol Specification](https://www.bittorrent.org/beps/bep_0003.html#info-dictionary) has more information about these keys.\n\nIn this stage, the tester will expect your program to print piece length and a list of piece hashes in hexadecimal format.\n\nHere's how the tester will execute your program:\n```\n$ ./your_bittorrent.sh info sample.torrent\n```\nand here's the output it expects:\n```\nTracker URL: http://bittorrent-test-tracker.codecrafters.io/announce\nLength: 92063\nInfo Hash: d69f91e6b2ae4c542468d1073a71d4ea13879a7f\nPiece Length: 32768\nPiece Hashes:\ne876f67a2a8886e8f36b136726c30fa29703022d\n6e2275e604a0766656736e81ff10b55204ad8d35\nf00d937a0213df1982bc8d097227ad9e909acc17\n```",
      "marketing_md": "In this stage, you'll extract hash values for each piece of the file. On public networks, there may be malicious peers sending fake data. Piece hashes will help us ensure the integrity of downloaded pieces."
    },
    {
      "slug": "fi9",
      "name": "Discover peers",
      "difficulty": "medium",
      "description_md": "Trackers are central servers that maintain information about peers participating in the sharing and downloading of a torrent.\n\nIn this stage, you'll make a GET request to a HTTP tracker to discover peers to download the file from.\n\n### Tracker GET request\n\nYou'll need to make a request to the tracker URL you extracted in the previous stage, and include these query params:\n\n- `info_hash`: the info hash of the torrent\n    - 20 bytes long, will need to be URL encoded\n    - **Note**: this is **NOT** the hexadecimal representation, which is 40 bytes long\n- `peer_id`: a unique identifier for your client\n    - A string of length 20 that you get to pick. You can use something like `00112233445566778899`.\n- `port`: the port your client is listening on\n    - You can set this to `6881`, you will not have to support this functionality during this challenge.\n- `uploaded`: the total amount uploaded so far\n    - Since your client hasn't uploaded anything yet, you can set this to `0`.\n- `downloaded`: the total amount downloaded so far\n    - Since your client hasn't downloaded anything yet, you can set this to `0`.\n- `left`: the number of bytes left to download\n    - Since you client hasn't downloaded anything yet, this'll be the total length of the file (you've extracted this value from the torrent file in previous stages)\n- `compact`: whether the peer list should use the [compact representation](https://www.bittorrent.org/beps/bep_0023.html)\n    - For the purposes of this challenge, set this to `1`.\n    - The compact representation is more commonly used in the wild, the non-compact representation is mostly supported for backward-compatibility.\n\nRead [the BitTorrent Protocol Specification](https://www.bittorrent.org/beps/bep_0003.html#trackers) for more information about these query parameters.\n\n### Tracker response\n\nThe tracker's response will be a bencoded dictionary with two keys:\n\n- `interval`:\n    - An integer, indicating how often your client should make a request to the tracker.\n    - You can ignore this value for the purposes of this challenge.\n- `peers`.\n    - A string, which contains list of peers that your client can connect to.\n    - Each peer is represented using 6 bytes. The first 4 bytes are the peer's IP address and the last 2 bytes are the peer's port number.\n\n---\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh peers sample.torrent\n```\nand here’s the output it expects:\n```\n178.62.82.89:51470\n165.232.33.77:51467\n178.62.85.20:51489\n```",
      "marketing_md": "In this stage, you’ll interact with a tracker, a central server that keeps track of peers participating in the sharing of a torrent. You'll make a GET request to a HTTP tracker to discover peers from whom you can download the file."
    },
    {
      "slug": "ca4",
      "name": "Peer handshake",
      "difficulty": "medium",
      "description_md": "In this stage, you’ll establish a TCP connection with a peer and complete a handshake.\n\nThe handshake is a message consisting of the following parts as described in the [peer protocol](https://www.bittorrent.org/beps/bep_0003.html#peer-protocol):\n\n1. length of the protocol string (BitTorrent protocol) which is `19` (1 byte)\n2. the string `BitTorrent protocol` (19 bytes)\n3. eight reserved bytes, which are all set to zero (8 bytes)\n4. sha1 infohash (20 bytes) (**NOT** the hexadecimal representation, which is 40 bytes long)\n5. peer id (20 bytes) (you can use `00112233445566778899` for this challenge)\n\nAfter we send a handshake to our peer, we should receive a handshake back in the same format.\n\nYour program should print the hexadecimal representation of the peer id you've received during the handshake.\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh handshake sample.torrent <peer_ip>:<peer_port>\n```\nand here’s the output it expects:\n```\nPeer ID: 0102030405060708090a0b0c0d0e0f1011121314\n```\n(Exact value will be different as it is randomly generated.)\n\n**Note**: To get a peer IP & port to test this locally, run `./your_bittorrent.sh peers sample.torrent` and pick any peer from the list.",
      "marketing_md": "In this stage, you’ll establish a TCP connection with a peer and complete a handshake according to [BitTorrent Peer Protocol](https://www.bittorrent.org/beps/bep_0003.html#peer-protocol)"
    },
    {
      "slug": "nd2",
      "name": "Download a piece",
      "difficulty": "hard",
      "description_md": "In this stage, you'll download one piece and save it to disk. In the next stage we'll combine these pieces into a file.\n\nTo download a piece, your program will need to send [peer messages](https://www.bittorrent.org/beps/bep_0003.html#peer-messages) to a peer. The overall flow looks like this:\n\n- Read the torrent file to get the tracker URL\n    - you've done this in previous stages\n- Perform the tracker GET request to get a list of peers\n    - you've done this in previous stages\n- Establish a TCP connection with a peer, and perform a handshake\n    - you've done this in previous stages\n- Exchange multiple [peer messages](https://www.bittorrent.org/beps/bep_0003.html#peer-messages) to download the file\n    - **This is the part you'll implement in this stage**\n\n### Peer Messages\n\nPeer messages consist of a message length prefix (4 bytes), message id (1 byte) and a payload (variable size).\n\nHere are the peer messages you'll need to exchange once the handshake is complete:\n\n- Wait for a `bitfield` message from the peer indicating which pieces it has\n    - The message id for this message type is `5`.\n    - You can read and ignore the payload for now, the tracker we use for this challenge ensures that all peers have all pieces available.\n- Send an `interested` message\n    - The message id for `interested` is `2`.\n    - The payload for this message is empty.\n- Wait until you receive an `unchoke` message back\n    - The message id for `unchoke` is `1`.\n    - The payload for this message is empty.\n- Break the piece into blocks of 16 kiB (16 * 1024 bytes) and send a `request` message for each block\n    - The message id for `request` is `6`.\n    - The payload for this message consists of:\n        - `index`: the zero-based piece index\n        - `begin`: the zero-based byte offset within the piece\n            - This'll be `0` for the first block, `2^14` for the second block, 2*2^14 for the third block etc.\n        - `length`: the length of the block in bytes\n            - This'll be `2^14` (16 * 1024) for all blocks except the last one.\n            - The last block will contain `2^14` bytes or less, you'll need calculate this value using the piece length.\n- Wait for a `piece` message for each block you've requested\n    - The message id for `piece` is `7`.\n    - The payload for this message consists of:\n        - `index`: the zero-based piece index\n        - `begin`: the zero-based byte offset within the piece\n        - `block`: the data for the piece, usually `2^14` bytes long\n\nAfter receiving blocks and combining them into pieces, you'll want to check the integrity of each piece by comparing it's hash\nwith the piece hash value found in the torrent file.\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh download_piece -o /tmp/test-piece-0 sample.torrent 0\n```\nand here’s the output it expects:\n```\nPiece 0 downloaded to /tmp/test-piece-0.\n```\n\n**Optional:** To improve download speeds, you can consider pipelining your requests. [BitTorrent Economics Paper](http://bittorrent.org/bittorrentecon.pdf) recommends having 5 requests pending at once, to avoid a delay between blocks being sent.",
      "marketing_md": "In this stage, you'll connect to a peer and download a piece of the file. You'll download the piece in blocks, which you'll later combine and verify using SHA-1, a cryptographic hash value."
    },
    {
      "slug": "jv8",
      "name": "Download the whole file",
      "difficulty": "hard",
      "description_md": "In this stage, you’ll download the entire file and save it to disk.\n\nYou can start with using a single peer to download all the pieces. You’ll need to download all the pieces, verify their integrity using piece hashes, and combine them to assemble the file.\n\nHere’s how the tester will execute your program:\n```\n$ ./your_bittorrent.sh download -o /tmp/test.txt sample.torrent\n```\nand here’s the output it expects:\n```\nDownloaded sample.torrent to /tmp/test.txt.\n```\n\n**Optional:** To improve download speeds, you can download from multiple peers at once. You could have a work queue consisting of each piece that needs to be downloaded. Your worker (connection with a peer) could pick a piece from the work queue, attempt to download it, check the integrity, and write the downloaded piece into a buffer. Any failure (network issue, hashes not matching, peer not having the piece etc.) would put the piece back into the work queue to be tried again.",
      "marketing_md": "In this stage, you'll download the entire file. You'll download all the pieces, verify them using SHA-1 and save them to disk."
    }
  ]
}
