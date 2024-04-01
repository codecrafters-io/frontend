export default {
  data: {
    id: '5c1bd3bf-bc05-4047-932f-de77575a361f',
    type: 'concepts',
    attributes: {
      blocks: [
        {
          args: { markdown: 'Network protocols are sets of rules or standards used by devices to communicate with each other over a network.' },
          type: 'markdown',
        },
        { args: { button_text: 'Continue' }, type: 'click_to_continue' },
        {
          args: {
            markdown:
              'Some examples of network protocols are:\n\n- HTTP, used for web browsing\n- SMTP, used for email\n- FTP, used for file transfers',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'not-a-network-protocol' }, type: 'concept_question' },
        {
          args: {
            markdown:
              'Network protocols can be broadly categorized into "layers". Each layer relies on the layer below it and provides services to the layer above it.',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: 'One model that categorizes network protocols into layers is the TCP/IP model. It has 4 layers:' }, type: 'markdown' },
        { args: { concept_animation_slug: 'network-protocols/layers' }, type: 'concept_animation' },
        { args: { markdown: "We'll go over each layer individually and look at some examples." }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'how-many-layers-in-tcp-ip-model' }, type: 'concept_question' },
        { args: { markdown: '## Link Layer' }, type: 'markdown' },
        { args: { markdown: "Let's start by looking at the **Link Layer**, the bottom-most layer." }, type: 'markdown' },
        { args: { concept_animation_slug: 'network-protocols/layer-1' }, type: 'concept_animation' },
        {
          args: { markdown: 'It is responsible for sending data over a physical medium, such as a cable or a wireless connection.' },
          type: 'markdown',
        },
        { args: { button_text: 'Examples?' }, type: 'click_to_continue' },
        { args: { markdown: 'Some examples of Link Layer protocols are:\n\n- Ethernet\n- Wi-Fi\n- Bluetooth' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'which-is-a-link-layer-protocol' }, type: 'concept_question' },
        { args: { markdown: '## Internet Layer' }, type: 'markdown' },
        { args: { concept_animation_slug: 'network-protocols/layer-2' }, type: 'concept_animation' },
        {
          args: {
            markdown:
              'The **Internet Layer** is the next layer. It is responsible for routing data across different networks to get it to the right destination.\n\nThe Internet Layer relies on services provided by the Link Layer.',
          },
          type: 'markdown',
        },
        { args: { button_text: 'Examples?' }, type: 'click_to_continue' },
        {
          args: {
            markdown:
              'The fundamental protocol in this layer is the Internet Protocol (IP). But there are others too:\n\n- ICMP, used by programs like `ping` to test connectivity\n- ARP, used to map IP addresses to MAC addresses',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: "Okay! We've looked at the first two layers of the TCP/IP model. Two to go." }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: '## Transport Layer' }, type: 'markdown' },
        { args: { concept_animation_slug: 'network-protocols/layer-3' }, type: 'concept_animation' },
        {
          args: {
            markdown:
              "This layer's job is to provide reliable data transfer between two devices.\n\nThe Transport Layer relies on services provided by the Internet Layer.",
          },
          type: 'markdown',
        },
        { args: { button_text: 'Examples?' }, type: 'click_to_continue' },
        {
          args: {
            markdown:
              'The most commonly used Transport Layer protocols are:\n\n- TCP, for reliable delivery of data\n- UDP, for fast but less reliable delivery\n\nThere are a few other not so popular ones too (like RUDP, DCCP etc.), but TCP & UDP are the most common ones.',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'realtime-video-streaming-udp-or-tcp' }, type: 'concept_question' },
        { args: { markdown: 'Okay, onto our final layer!' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: '## Application Layer' }, type: 'markdown' },
        { args: { concept_animation_slug: 'network-protocols/layer-4' }, type: 'concept_animation' },
        {
          args: {
            markdown:
              'This is the top-most layer, where most of the actual applications that we use live.\n\nThe Application Layer relies on protocols like TCP/UDP in the Transport Layer.',
          },
          type: 'markdown',
        },
        { args: { button_text: 'Examples?' }, type: 'click_to_continue' },
        { args: { markdown: 'HTTP, SMTP, FTP etc. are all Application Layer protocols.' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        {
          args: {
            markdown:
              '# Summary\n\nYou\'ve now learnt about the TCP/IP model, which categorizes network protocols into 4 layers. This \nmodel is also referred to as the "Internet Protocol Suite".\n\nHere\'s a quick overview of the layers and examples of protocols in each layer them:',
          },
          type: 'markdown',
        },
        { args: { concept_animation_slug: 'network-protocols/layers-with-examples' }, type: 'concept_animation' },
        {
          args: {
            markdown:
              'Links for further reading: \n\n- [Internet Protocol Suite](https://en.wikipedia.org/wiki/Internet_protocol_suite) (Wikipedia page)\n- [The layers in the TCP/IP model](https://subscription.packtpub.com/book/networking-and-servers/9781783989522/1/ch01lvl1sec10/the-layers-in-the-tcp-ip-model) (chapter from the book "Networking & Servers")',
          },
          type: 'markdown',
        },
        { args: {}, type: 'click_to_continue' },
      ],
      'description-markdown': 'Learn about various network protocols and the TCP/IP model.',
      slug: 'network-protocols',
      title: 'Network Protocols',
    },
    relationships: {
      author: { data: null },
      questions: {
        data: [
          { id: '3c9c5042-f401-457f-9b44-f45cadff227b', type: 'concept-questions' },
          { id: 'f069efa4-f24d-4599-ad1e-dca327b2aa70', type: 'concept-questions' },
          { id: 'dbebe3c6-46c7-4de3-86a0-a6c2c67b7f84', type: 'concept-questions' },
          { id: 'd85d5e3c-cd8d-4716-b527-db8db3525a36', type: 'concept-questions' },
        ],
      },
    },
  },
  included: [
    {
      id: '3c9c5042-f401-457f-9b44-f45cadff227b',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which of the following is NOT a network protocol?',
        options: [
          {
            markdown: 'SMTP',
            is_correct: false,
            explanation_markdown:
              'SMTP is incorrect because it is a network protocol used for sending emails.\n\nPDF is the correct answer because it is a document file format, not a network protocol.',
          },
          {
            markdown: 'HTTP',
            is_correct: false,
            explanation_markdown:
              'HTTP is incorrect because it is indeed a network protocol that is used for web browsing.\n\nPDF is the correct answer because it is a document file format, not a network protocol.',
          },
          {
            markdown: 'FTP',
            is_correct: false,
            explanation_markdown:
              'FTP (File Transfer Protocol) is wrong because it is indeed a network protocol used for transferring files\n\nPDF is the correct answer because it is a document file format, not a network protocol.',
          },
          {
            markdown: 'PDF',
            is_correct: true,
            explanation_markdown: 'PDF is the correct answer because it is a document file format, not a network protocol.',
          },
        ],
        slug: 'not-a-network-protocol',
      },
      relationships: { concept: {} },
    },
    {
      id: 'f069efa4-f24d-4599-ad1e-dca327b2aa70',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'How many layers does the TCP/IP model have?',
        options: [
          { markdown: '1 layer', is_correct: false, explanation_markdown: 'The TCP/IP model has 4 layers.' },
          { markdown: '4 layers', is_correct: true, explanation_markdown: 'The TCP/IP model has 4 layers.' },
          {
            markdown: '7 layers',
            is_correct: false,
            explanation_markdown: "The TCP/IP model has 4 layers. However, there's another model called the OSI model that has 7 layers.",
          },
          { markdown: '11 layers', is_correct: false, explanation_markdown: 'The TCP/IP model has 4 layers.' },
        ],
        slug: 'how-many-layers-in-tcp-ip-model',
      },
      relationships: { concept: {} },
    },
    {
      id: 'dbebe3c6-46c7-4de3-86a0-a6c2c67b7f84',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which of the following is a Link Layer protocol?',
        options: [
          {
            markdown: 'Ethernet',
            is_correct: true,
            explanation_markdown: 'Ethernet is a Link Layer protocol. HTTP, FTP & SMTP are Application Layer protocols.',
          },
          { markdown: 'HTTP', is_correct: false, explanation_markdown: 'HTTP is an Application Layer protocol.' },
          { markdown: 'FTP', is_correct: false, explanation_markdown: 'FTP is an Application Layer protocol.' },
          { markdown: 'SMTP', is_correct: false, explanation_markdown: 'SMTP is an Application Layer protocol.' },
        ],
        slug: 'which-is-a-link-layer-protocol',
      },
      relationships: { concept: {} },
    },
    {
      id: 'd85d5e3c-cd8d-4716-b527-db8db3525a36',
      type: 'concept-questions',
      attributes: {
        'query-markdown': 'Which protocol is best suited for real-time video streaming? (Zoom, Skype etc.)',
        options: [
          {
            markdown: 'TCP',
            is_correct: false,
            explanation_markdown:
              "TCP can be used for real-time video streaming, but UDP is a more common choice because it is faster. In real-time video streaming, it's preferable to \nlose a few packets than to deliver all packets but with a delay.",
          },
          {
            markdown: 'UDP',
            is_correct: true,
            explanation_markdown:
              "UDP is a good choice for real-time video streaming because it is a fast but not-so-reliable protocol. It doesn't try to retransmit lost packets like TCP, which could cause delays.",
          },
        ],
        slug: 'realtime-video-streaming-udp-or-tcp',
      },
      relationships: { concept: {} },
    },
  ],
};
