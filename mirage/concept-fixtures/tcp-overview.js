export default {
  data: {
    id: 'a1184ebd-316e-489c-872b-656fb6406bcd',
    type: 'concepts',
    attributes: {
      blocks: [
        {
          args: {
            markdown:
              'TCP is a widely used network protocol. It\'s a "reliable" protocol that runs on top of an unreliable protocol: IP, short for Internet Protocol. \n\nLet\'s dive deeper and understand how TCP works under the hood.',
          },
          type: 'markdown',
        },
        { args: { button_text: 'Continue' }, type: 'click_to_continue' },
        {
          args: { markdown: "We'll start by looking at IP (short for Internet Protocol), the protocol that TCP builds on top of." },
          type: 'markdown',
        },
        { args: { button_text: 'Continue' }, type: 'click_to_continue' },
        { args: { concept_question_slug: 'tcp-ip-dependency' }, type: 'concept_question' },
        {
          args: {
            markdown:
              '## IP - The Internet\'s postal service\n\nWhen a program sends data over the network using IP, the data is broken up and sent as multiple "packets".\n\nEach packet contains:\n- a header section\n- a data section',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown: 'The header contains a source and destination address, much like an envelope that you send through your local postal service.',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/packet' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              'The important similarity between IP and a postal service is that packets are **not guaranteed** to arrive at the destination. Although \nevery effort is made to get it there, sometimes packets get lost in transit.',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "Furthermore, if you send 5 packets at once, there's no guarantee that they'll arrive at their destination at the same time or in the same order.",
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'ip-limitations' }, type: 'concept_question' },
        { args: { markdown: 'TCP was created to address these limitations of IP.' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "## TCP's Guarantees\n\nPrimarily, TCP offers two guarantees: **(a)** Reliable delivery of packets and **(b)** In-order delivery of packets.",
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "**Guarantee #1 - Reliable Delivery**\n\nTCP ensures that no packets are lost in transit. It does this by asking the receiver to acknowledge all sent packets, and \nre-transmitting any packets if an acknowledgement isn't received.",
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/reliable-delivery' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              '**Guarantee #2 - Ordered Delivery**\n\nIn addition to guaranteeing packets reach their destination, TCP also guarantees that the packets are delivered in order. It \ndoes this by labelling each packet with a sequence number. The receiver tracks these numbers and reorders out-of-sequence packets. \nIf a packet is missing, the receiver waits for it to be re-transmitted.',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/ordered-delivery' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'tcp-guarantees' }, type: 'concept_question' },
        {
          args: {
            markdown:
              '## TCP Connections\n\nTCP is a connection-oriented protocol, which means that to interact over TCP a program must first "establish a connection". To do this, one \nprogram takes the role of a "server", and the other program takes the role of a "client".',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/server-client' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "The server waits for connections, and the client initiates a connection. Once a connection is established, the client & server can both receive \nand send data (it's a two-way channel).",
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'tcp-two-way-channel' }, type: 'concept_question' },
        {
          args: {
            markdown:
              'A TCP connection is identified using a unique combination of four values: \n\n- destination IP address\n- destination port number\n- source IP address\n- source port number',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "For example, let's say you're connecting to google.com. The values for your TCP connection will look like this: \n\n- **destination IP address**: x.x.x.x (Google's web server)\n- **destination port number**: 443 (Default port used by HTTPS)\n- **source IP address**: y.y.y.y (your computer)\n- **source port number**: 26789 (a random number, unused by any other connection on your computer)",
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/connection-identifiers' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              'If your browser opens multiple connections to Google\'s server, only the "source port number" will change, the rest will remain the same.',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'tcp-connection-identifiers' }, type: 'concept_question' },
        {
          args: { markdown: '## TCP Handshake\n\nThe TCP handshake is how clients establish connections with servers. This is a 3-step process.' },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              '**Step 1: SYN**\n\nFirst, the client initiates the connection by sending a SYN (synchronize) packet to the server, indicating a request to establish a \nconnection. This packet also contains a sequence number to maintain the order of the packets being sent.',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/handshake-1' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown: '**Step 2: SYN-ACK**\n\nThe server, upon receiving this SYN packet, sends back a SYN-ACK (synchronize-acknowledge) packet.',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/handshake-2' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              "**Step 3: ACK**\n\nIn the final step of this three-way handshake, the client acknowledges the server's SYN-ACK packet by sending an ACK (acknowledge) \npacket. The connection is considered established once this last packet is received by the server.",
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'tcp-overview/handshake-3' }, type: 'concept_animation' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'tcp-handshake-steps' }, type: 'concept_question' },
        {
          args: {
            markdown:
              'The three-way handshake ensures a reliable connection is created, verifies both devices are ready for data transmission, and sets \ninitial sequence numbers for proper ordering of data packets.',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
      ],
      'description-markdown': 'Learn about the TCP protocol and how it works.',
      slug: 'tcp-overview',
      title: 'TCP: An Overview',
    },
    relationships: {
      author: { data: null },
      questions: {
        data: [
          { id: '33e2aff0-ae9a-406c-b896-aef6d5d915ef', type: 'concept-questions' },
          { id: '90fd9df0-c7f5-4876-a856-be9a564df643', type: 'concept-questions' },
          { id: '88bedc53-afd7-4d6d-b272-f6a3a15a509e', type: 'concept-questions' },
          { id: 'feef1a64-04b9-4f37-9443-32e5b11029d0', type: 'concept-questions' },
          { id: '91b04790-4cf2-400b-b912-126e2e86ff91', type: 'concept-questions' },
          { id: '34d24b5c-0e84-4c11-a29b-8ac79742765b', type: 'concept-questions' },
        ],
      },
    },
  },
  included: [
    {
      id: '33e2aff0-ae9a-406c-b896-aef6d5d915ef',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'When sending data using IP, which of the following is true?',
        options: [
          {
            markdown: 'No packets will be lost',
            is_correct: false,
            explanation_markdown:
              'Packets may be lost and may be delivered out of order because IP is a best-effort protocol, meaning \nit does not guarantee packet delivery or order.',
          },
          {
            markdown: 'All packets will be delivered in order',
            is_correct: false,
            explanation_markdown:
              'Packets may be lost and may be delivered out of order because IP is a best-effort protocol, meaning \nit does not guarantee packet delivery or order.',
          },
          {
            markdown: 'Packets may be lost and may be delivered out of order',
            is_correct: true,
            explanation_markdown:
              'Packets may be lost and may be delivered out of order because IP is a best-effort protocol, meaning \nit does not guarantee packet delivery or order.',
          },
        ],
        slug: 'ip-limitations',
      },
      relationships: { concept: {} },
    },
    {
      id: '90fd9df0-c7f5-4876-a856-be9a564df643',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which of the following is true?',
        options: [
          { markdown: 'TCP depends on IP', is_correct: true, explanation_markdown: 'TCP relies on IP to route packets between systems.' },
          {
            markdown: 'IP depends on TCP',
            is_correct: false,
            explanation_markdown:
              "IP doesn't depend on TCP because IP is a lower-level protocol than TCP.\n\nTCP relies on IP to route packets between systems.",
          },
          {
            markdown: 'TCP and IP are the same',
            is_correct: false,
            explanation_markdown:
              'TCP and IP are not the same because they are two different protocols that \noperate at different layers of the networking stack. TCP is a transport protocol \nthat ensures reliable delivery of data between applications. IP, on the other hand, \nis a network protocol that provides addressing and routing functions for data packets.\n\nTCP relies on IP to route packets between systems.',
          },
        ],
        slug: 'tcp-ip-dependency',
      },
      relationships: { concept: {} },
    },
    {
      id: '88bedc53-afd7-4d6d-b272-f6a3a15a509e',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'When sending data using TCP, which of the following is true?',
        options: [
          {
            markdown: 'Some packets will be lost',
            is_correct: false,
            explanation_markdown: 'TCP ensures reliable data transmission by retransmitting lost or corrupted packets.',
          },
          {
            markdown: 'All packets will be delivered in order',
            is_correct: true,
            explanation_markdown:
              'TCP uses sequence numbers to maintain the correct order of data transmission and reassembles the packets at the destination.',
          },
          {
            markdown: 'Packets may be delivered out of order',
            is_correct: false,
            explanation_markdown: 'TCP ensures that all packets are delivered in the correct order.',
          },
        ],
        slug: 'tcp-guarantees',
      },
      relationships: { concept: {} },
    },
    {
      id: 'feef1a64-04b9-4f37-9443-32e5b11029d0',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Once a TCP connection is established, which of the following is true?',
        options: [
          {
            markdown: "The client can send data to the server, but it can't receive data from the server",
            is_correct: false,
            explanation_markdown:
              'A client needs to initiate a connection, but once the connection is established both the client and server can send and receive data.',
          },
          {
            markdown: "The server can send data to the client, but it can't receive data from the client",
            is_correct: false,
            explanation_markdown: 'TCP is a bidirectional communication protocol, meaning both the client and server can send and receive data.',
          },
          {
            markdown: 'The client and server can both send and receive data',
            is_correct: true,
            explanation_markdown: 'TCP is a bidirectional communication protocol, meaning both the client and server can send and receive data.',
          },
        ],
        slug: 'tcp-two-way-channel',
      },
      relationships: { concept: {} },
    },
    {
      id: '91b04790-4cf2-400b-b912-126e2e86ff91',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which is the correct ordering of steps in the TCP handshake?',
        options: [
          {
            markdown: 'SYN, ACK, SYN-ACK',
            is_correct: false,
            explanation_markdown:
              'The correct answer, SYN, SYN-ACK, ACK, represents the proper order of the three-way handshake: the client \nsends a SYN packet, the server responds with a SYN-ACK packet, and the client replies with an ACK packet.',
          },
          {
            markdown: 'SYN, SYN-ACK, ACK',
            is_correct: true,
            explanation_markdown:
              'The client sends a SYN packet, the server responds with a SYN-ACK packet, and the client replies with an ACK packet.',
          },
          {
            markdown: 'ACK, SYN, SYN-ACK',
            is_correct: false,
            explanation_markdown:
              'The correct answer, SYN, SYN-ACK, ACK, represents the proper order of the three-way handshake: the client \nsends a SYN packet, the server responds with a SYN-ACK packet, and the client replies with an ACK packet.',
          },
        ],
        slug: 'tcp-handshake-steps',
      },
      relationships: { concept: {} },
    },
    {
      id: '34d24b5c-0e84-4c11-a29b-8ac79742765b',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which of the following values are NOT used to identify a TCP connection?',
        options: [
          {
            markdown: 'The source & destination IP addresses',
            is_correct: false,
            explanation_markdown:
              'The source & destination IP addresses are indeed used to identify a TCP connection.\n\nThe correct answer is the source & destination MAC addresses, which are not used in identifying a TCP connection, \nas they pertain to the data link layer and not the transport layer where TCP operates.',
          },
          {
            markdown: 'The source & destination MAC addresses',
            is_correct: true,
            explanation_markdown:
              'MAC addresses  are not used in identifying a TCP connection as they pertain to the data link layer and not the \ntransport layer where TCP operates.',
          },
          {
            markdown: 'The source & destionation port numbers',
            is_correct: false,
            explanation_markdown:
              'The source and destination port numbers are indeed used to identify a TCP connection, they help differentiate between \nmultiple programs running on the same host.\n\nThe correct answer is the source & destination MAC addresses, which are not used in identifying a TCP connection, \nas they pertain to the data link layer and not the transport layer where TCP operates.',
          },
        ],
        slug: 'tcp-connection-identifiers',
      },
      relationships: { concept: {} },
    },
  ],
};
