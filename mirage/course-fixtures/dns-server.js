export default {
  "slug": "dns-server",
  "name": "Build your own DNS server",
  "short_name": "dns",
  "release_status": "live",
  "description_md": "DNS is a protocol used to resolve domain names to IP addresses. In this challenge, you'll build a DNS server that's capable of responding to\nbasic DNS queries.\n\nAlong the way you'll learn about the DNS protocol, DNS packet format, DNS record types, UDP servers and more.",
  "short_description_md": "Learn about the DNS protocol, DNS record types and more.",
  "completion_percentage": 15,
  "languages": [
    {
      "slug": "go"
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
      "slug": "javascript",
      "release_status": "beta"
    },
    {
      "slug": "ruby",
      "release_status": "beta"
    },
    {
      "slug": "typescript",
      "release_status": "beta"
    }
  ],
  "marketing": {
    "difficulty": "medium",
    "sample_extension_idea_title": "EDNS",
    "sample_extension_idea_description": "Extend the DNS protocol with different abilities",
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
      "slug": "ux2",
      "name": "Setup UDP server",
      "difficulty": "very_easy",
      "description_md": "In this stage, we'll setup a UDP server that can receive and respond to UDP packets on port 2053.\n\nThe tester will execute your program like this:\n\n```bash\n$ ./your_server.sh\n```\n\nThe tester will then send a UDP packet to port 2053.\n\nYour program should respond back with a UDP packet. It's okay to ignore the contents of the packet for now,\nwe'll work on that in the next stage.",
      "marketing_md": "In this stage, we'll start a UDP server on port 2053."
    },
    {
      "slug": "tz1",
      "name": "Write header section",
      "difficulty": "medium",
      "description_md": "All communications in the DNS protocol are carried in a single format called a \"message\". Each message consists of\n5 sections: header, question, answer, authority, and an additional space.\n\nIn this stage, we'll focus on the \"header\" section. We'll look at the other sections in later stages.\n\n### Header section structure\n\nThe header section of a DNS message contains the following fields: (we've also included the values that the tester expects in this stage)\n\n| Field                             | Size    | Description                                                                                                            |\n| ----------------------------------| ------- | ---------------------------------------------------------------------------------------------------------------------- |\n| Packet Identifier (ID)            | 16 bits | A random ID assigned to query packets. Response packets must reply with the same ID. <br />**Expected value**: 1234.   |\n| Query/Response Indicator (QR)     | 1 bit   | 1 for a reply packet, 0 for a question packet. <br />**Expected value**: 1.                                            |\n| Operation Code (OPCODE)           | 4 bits  | Specifies the kind of query in a message. <br />**Expected value**: 0.                                                 |\n| Authoritative Answer (AA)         | 1 bit   | 1 if the responding server \"owns\" the domain queried, i.e., it's authoritative. <br />**Expected value**: 0.           |\n| Truncation (TC)                   | 1 bit   | 1 if the message is larger than 512 bytes. Always 0 in UDP responses. <br />**Expected value**: 0.                     |\n| Recursion Desired (RD)            | 1 bit   | Sender sets this to 1 if the server should recursively resolve this query, 0 otherwise. <br />**Expected value**: 0.   |\n| Recursion Available (RA)          | 1 bit   | Server sets this to 1 to indicate that recursion is available. <br />**Expected value**: 0.                            |\n| Reserved (Z)                      | 3 bits  | Used by DNSSEC queries. At inception, it was reserved for future use. <br />**Expected value**: 0.                     |\n| Response Code (RCODE)             | 4 bits  | Response code indicating the status of the response. <br />**Expected value**: 0 (no error).                           |\n| Question Count (QDCOUNT)          | 16 bits | Number of questions in the Question section. <br />**Expected value**: 0.                                              |\n| Answer Record Count (ANCOUNT)     | 16 bits | Number of records in the Answer section. <br />**Expected value**: 0.                                                  |\n| Authority Record Count (NSCOUNT)  | 16 bits | Number of records in the Authority section. <br />**Expected value**: 0.                                               |\n| Additional Record Count (ARCOUNT) | 16 bits | Number of records in the Additional section. <br />**Expected value**: 0.                                              |\n\nThe header section is always 12 bytes long. Integers are encoded in big-endian format.\n\nYou can read more about the full DNS packet format on [Wikipedia](https://en.wikipedia.org/wiki/Domain_Name_System#DNS_message_format), or\nin [RFC 1035](https://tools.ietf.org/html/rfc1035#section-4.1). [This link](https://github.com/EmilHernvall/dnsguide/blob/b52da3b32b27c81e5c6729ac14fe01fef8b1b593/chapter1.md)\nis a good tutorial that walks through the DNS packet format in detail.\n\n---\n\nJust like in the previous stage, the tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053. Your program will need to respond with\na DNS reply packet that contains the header information described above.\n\nWe recommend creating an internal structure for a \"DNS message\" in your code, as we will build on this in later stages.\n\nNote: The tester sends an extra packet at the start of testing each stage. You can ignore it.",
      "marketing_md": "In this stage, we'll write a DNS packet's header contents"
    },
    {
      "slug": "bf2",
      "name": "Write question section",
      "difficulty": "medium",
      "description_md": "In this stage, you'll extend your DNS server to respond with the \"question\" section, the second section of a DNS message.\n\n### Question section structure\n\nThe question section contains a list of questions (usually just 1) that the sender wants to ask the receiver. This section is present\nin both query and reply packets.\n\nEach question has the following structure:\n\n- **Name**: A domain name, represented as a sequence of \"labels\" (more on this below)\n- **Type**: 2-byte int; the type of record (1 for an A record, 5 for a CNAME record etc., full list [here](https://www.rfc-editor.org/rfc/rfc1035#section-3.2.2))\n- **Class**: 2-byte int; usually set to `1` (full list [here](https://www.rfc-editor.org/rfc/rfc1035#section-3.2.4))\n\n[Section 4.1.2](https://www.rfc-editor.org/rfc/rfc1035#section-4.1.2) of the RFC covers the question section format in\ndetail. [Section 3.2](https://www.rfc-editor.org/rfc/rfc1035#section-3.2) has more details on Type and class.\n\n### Domain name encoding\n\nDomain names in DNS packets are encoded as a sequence of labels.\n\nLabels are encoded as `<length><content>`, where `<length>` is a single byte that specifies the length of the label,\nand `<content>` is the actual content of the label. The sequence of labels is terminated by a null byte (`\\x00`).\n\nFor example:\n\n- `google.com` is encoded as `\\x06google\\x03com\\x00` (in hex: `06 67 6f 6f 67 6c 65 03 63 6f 6d 00`)\n  - `\\x06google` is the first label\n      - `\\x06` is a single byte, which is the length of the label\n      - `google` is the content of the label\n  - `\\x03com` is the second label\n      - `\\x03` is a single byte, which is the length of the label\n      - `com` is the content of the label\n  - `\\x00` is the null byte that terminates the domain name\n\n---\n\nJust like in the previous stage, the tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053. Your program will need to respond with a\nDNS reply packet that contains the question section described above (along with the header section from the previous stage).\n\nHere are the expected values for the question section:\n\n| Field | Expected value                                                                                          |\n| ----- | ------------------------------------------------------------------------------------------------------- |\n| Name  | `\\x0ccodecrafters\\x02io` followed by a null byte (that's `codecrafters.io` encoded as a label sequence) |\n| Type  | 1 encoded as a 2-byte big-endian int (corresponding to the \"A\" record type)                             |\n| Class | 1 encoded as a 2-byte big-endian int (corresponding to the \"IN\" record class)                           |\n\nMake sure to update the `QDCOUNT` field in the header section accordingly, and remember to set the id to `1234`.",
      "marketing_md": "In this stage, we'll write a DNS packet's question section"
    },
    {
      "slug": "xm2",
      "name": "Write answer section",
      "difficulty": "easy",
      "description_md": "In this stage, you'll extend your DNS server to respond with the \"answer\" section, the third section of a DNS message.\n\n### Answer section structure\n\nThe answer section contains a list of RRs (Resource Records), which are answers to the questions asked in the question section.\n\nEach RR has the following structure:\n\n| Field                 | Type            | Description                                                                                                              |\n| --------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |\n| Name                  | Label Sequence  | The domain name encoded as a sequence of labels.                                                                         |\n| Type                  | 2-byte Integer  | `1` for an A record, `5` for a CNAME record etc., full list [here](https://www.rfc-editor.org/rfc/rfc1035#section-3.2.2) |\n| Class                 | 2-byte Integer  | Usually set to `1` (full list [here](https://www.rfc-editor.org/rfc/rfc1035#section-3.2.4))                              |\n| TTL (Time-To-Live)    | 4-byte Integer  | The duration in seconds a record can be cached before requerying.                                                        |\n| Length (`RDLENGTH`)   | 2-byte Integer  | Length of the RDATA field in bytes.                                                                                      |\n| Data (`RDATA`)        | Variable        | Data specific to the record type.                                                                                        |\n\n[Section 3.2.1](https://www.rfc-editor.org/rfc/rfc1035#section-3.2.1) of the RFC covers the answer section format in detail.\n\nIn this stage, we'll only deal with the \"A\" record type, which maps a domain name to an IPv4 address. The RDATA field for an \"A\" record\ntype is a 4-byte integer representing the IPv4 address.\n\n---\n\nJust like in the previous stage, the tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053.\n\nYour program will need to respond with a DNS reply packet that contains:\n\n- a header section (same as in stage #2)\n- a question section  (same as in stage #3)\n- an answer section (**new in this stage!**)\n\nYour answer section should contain a single RR, with the following values:\n\n| Field   | Expected Value                                                                                                                     |\n| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n| Name    | `\\x0ccodecrafters\\x02io` followed by a null byte (that's `codecrafters.io` encoded as a label sequence)                            |\n| Type    | `1` encoded as a 2-byte big-endian int (corresponding to the \"A\" record type)                                                      |\n| Class   | `1` encoded as a 2-byte big-endian int (corresponding to the \"IN\" record class)                                                    |\n| TTL     | Any value, encoded as a 4-byte big-endian int. For example: `60`.                                                                  |\n| Length  | `4`, encoded as a 2-byte big-endian int (corresponds to the length of the RDATA field)                                             |\n| Data    | Any IP address, encoded as a 4-byte big-endian int. For example: `\\x08\\x08\\x08\\x08` (that's `8.8.8.8` encoded as a 4-byte integer) |\n\nMake sure to update the `ANCOUNT` field in the header section accordingly, and remember to set the id to `1234`.",
      "marketing_md": "In this stage, we'll write a DNS packet's answer section"
    },
    {
      "slug": "uc8",
      "name": "Parse header section",
      "difficulty": "hard",
      "description_md": "Up until now, we were ignoring the contents of the DNS packet that we received and hardcoding `1234` as the ID in the response. In\nthis stage, you'll have to parse the DNS packet that you receive and respond with the same ID in the response. You'll also need to set\nsome other fields in the header section.\n\nJust like the previous stage, the tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053.\n\nYour program will need to respond with a DNS reply packet that contains a header section with the following values:\n\n| Field                              | Size    | Expected value                                                              |\n| ---------------------------------- | ------- | --------------------------------------------------------------------------- |\n| Packet Identifier (ID)             | 16 bits | Mimic the 16 bit packet identifier from the request packet sent by tester   |\n| Query/Response Indicator (QR)      | 1 bit   | 1                                                                           |\n| Operation Code (OPCODE)            | 4 bits  | Mimic the OPCODE value sent by the tester                                   |\n| Authoritative Answer (AA)          | 1 bit   | 0                                                                           |\n| Truncation (TC)                    | 1 bit   | 0                                                                           |\n| Recursion Desired (RD)             | 1 bit   | Mimic the RD value sent by the tester                                       |\n| Recursion Available (RA)           | 1 bit   | 0                                                                           |\n| Reserved (Z)                       | 3 bits  | 0                                                                           |\n| Response Code (RCODE)              | 4 bits  | 0 (no error) if OPCODE is 0 (standard query) else 4 (not implemented)       |\n| Question Count (QDCOUNT)           | 16 bits | Any valid value                                                             |\n| Answer Record Count (ANCOUNT)      | 16 bits | Any valid value                                                             |\n| Authority Record Count (NSCOUNT)   | 16 bits | Any valid value                                                             |\n| Additional Record Count (ARCOUNT)  | 16 bits | Any valid value                                                             |\n\nThe tester will not check what follows the header section as long as it is a valid DNS packet.\n\n**Note**: Your code will still need to pass tests for the previous stages. You shouldn't need to hardcode `1234` as the request ID anymore\nsince the tester sends `1234` as the ID in the previous stages. As long as you implement this stage correctly, your code should automatically pass\nthe previous stages as well.",
      "marketing_md": "In this stage, we'll parse a DNS packet's header section"
    },
    {
      "slug": "hd8",
      "name": "Parse question section",
      "difficulty": "easy",
      "description_md": "In this stage you'll extend your DNS server to parse the question section of the DNS message you receive.\n\nJust like the previous stage, the tester will execute your program like this:\n\n```bash\n./your_server.sh\n```\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053 that contains a question section as follows:\n\n| Field  | Value sent by the tester                                                        |\n| ------ | --------------------------                                                      |\n| Name   | A random domain encoded as a label sequence (refer to stage #3 for details)     |\n| Type   | `1` encoded as a 2-byte big-endian int (corresponding to the \"A\" record type)   |\n| Class  | `1` encoded as a 2-byte big-endian int (corresponding to the \"IN\" record class) |\n\nThe question type will always be `A` for this stage and the question class will always be `IN`. So your parser only needs to account for those record types for now.\n\nYour program will need to respond with a DNS reply packet that contains:\n\n- a header section (same as in stage #5)\n- a question section (**new in this stage**)\n- an answer section (**new in this stage**)\n\n**Expected values for the question section**:\n\n| Field  | Expected value                                                                  |\n| ------ | --------------------------                                                      |\n| Name   | Mimic the domain name (as label sequence)                                       |\n| Type   | `1` encoded as a 2-byte big-endian int (corresponding to the \"A\" record type)   |\n| Class  | `1` encoded as a 2-byte big-endian int (corresponding to the \"IN\" record class) |\n\n**Expected values for the answer section**:\n\n| Field   | Expected Value                                                                                                                     |\n| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n| Name    | Mimic the domain name (as label sequence)                                                                                          |\n| Type    | `1` encoded as a 2-byte big-endian int (corresponding to the \"A\" record type)                                                      |\n| Class   | `1` encoded as a 2-byte big-endian int (corresponding to the \"IN\" record class)                                                    |\n| TTL     | Any value, encoded as a 4-byte big-endian int. For example: `60`.                                                                  |\n| Length  | `4`, encoded as a 2-byte big-endian int (corresponds to the length of the RDATA field)                                             |\n| Data    | Any IP address, encoded as a 4-byte big-endian int. For example: `\\x08\\x08\\x08\\x08` (that's `8.8.8.8` encoded as a 4-byte integer) |",
      "marketing_md": "In this stage, we'll parse a DNS packet's question section"
    },
    {
      "slug": "yc9",
      "name": "Parse compressed packet",
      "difficulty": "medium",
      "description_md": "In this stage we will parse the DNS question section which has compressed the question label sequences. You will be sent multiple values in the question section and you have to parse the queries and respond with the same question section (no need for compression) in the response along with answers for them. As for the answer section, respond with an `A` record type for each question. The values for these A records can be anything of your choosing.\n\nAs we already know how the Question Section and Answer Section look like from the previous stages, we will just give high level details of the packet that you are sent and what the tester expects.\n\nHere is what the tester will send you:\n\n```\n| ------------------------------------------ |\n| Header                                     |\n| ------------------------------------------ |\n| Question 1 (un-compressed label sequence)  |\n| ------------------------------------------ |\n| Question 2 (compressed label sequence)     |\n| ------------------------------------------ |\n```\n\nWhat the tester expects in response:\n\n```\n| ------------------------------------------ |\n| Header                                     |\n| ------------------------------------------ |\n| Question 1 (un-compressed label sequence)  |\n| ------------------------------------------ |\n| Question 2 (un-compressed label sequence)  |\n| ------------------------------------------ |\n| Answer 1 (un-compressed label sequence)    |\n| ------------------------------------------ |\n| Answer 2 (un-compressed label sequence)    |\n| ------------------------------------------ |\n```\n\nYou don't need to compress your response. We will never ask you to do something that will overflow the buffer size restriction of UDP, so compressing your response packet is not something you have to worry about. Though if you like an extra challenge feel free to compress the DNS packet, the tester will work with it too.\n\nThe question type will always be `A` and the question class will always be `IN`.\n\n[This section](https://www.rfc-editor.org/rfc/rfc1035#section-4.1.4) of the RFC covers how this compression works.",
      "marketing_md": "In this stage, we'll parse a DNS packet's question in which the label sequences have been compressed"
    },
    {
      "slug": "gt1",
      "name": "Forwarding Server",
      "difficulty": "medium",
      "description_md": "In this stage, you will implement a forwarding DNS server.\n\nA forwarding DNS server, also known as a DNS forwarder, is a DNS server that is configured to pass DNS queries it receives from clients to another DNS server for resolution. Instead of directly resolving DNS queries by looking up the information in its own local cache or authoritative records.\n\n---\nIn this stage the tester will execute your program like this:\n\n```bash\n./your_server --resolver <address>\n```\n* where `<address>` will be of the form `<ip>:<port>`\n\nIt'll then send a UDP packet (containing a DNS query) to port 2053. Your program will be responsible for forwarding DNS queries to a specified DNS server, and then returning the response to the original requester (i.e. the tester).\n\nYour program will need to respond with a DNS reply packet that contains:\n- a header section (same as in stage #5)\n- a question section (same as in stage #6)\n- an answer section (new in this stage) mimicing what you received from the DNS server to which you forwarded the request.\n\nHere are a few assumptions you can make about the tester -\n* It will always send you queries for `A` record type. So your parsing logic only needs to take care of this.\n\nHere are few assumptions you can make about the DNS server you are forwarding the requests to -\n* It will always respond with an answer section for the queries that originate from the tester.\n* It will not contain other sections like (authority section and additional section)\n* It will only respond when there is only one question in the question section. If you send multiple questions in the question section, it will not respond at all. So when you receive multiple questions in the question section you will need to split it into two DNS packets and then send them to this resolver then merge the response in a single packet.\n\nRemember to mimic the packet identifier value sent by the tester in your response.",
      "marketing_md": "In this stage, we'll call a DNS server which will do the actual DNS resolution."
    }
  ]
}
