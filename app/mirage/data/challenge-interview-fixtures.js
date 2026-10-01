export const readyInterviewAttributes = {
  brief: [
    'Q1 (trace-through, app/main.py:12-30): Walk me through what happens when a client sends PING.',
    'Q2 (failure mode, app/main.py:14-16): What happens if a RESP command arrives split across two reads?',
  ].join('\n'),
  codeFiles: [
    {
      path: 'app/main.py',
      contents: [
        'import socket',
        'import threading',
        '',
        '',
        'def handle_client(connection):',
        '    while True:',
        '        data = connection.recv(1024)',
        '',
        '        if not data:',
        '            break',
        '',
        '        connection.sendall(b"+PONG\\r\\n")',
        '',
        '',
        'def main():',
        '    server_socket = socket.create_server(("localhost", 6379), reuse_port=True)',
        '',
        '    while True:',
        '        connection, _ = server_socket.accept()',
        '        threading.Thread(target=handle_client, args=(connection,)).start()',
        '',
        '',
        'if __name__ == "__main__":',
        '    main()',
      ].join('\n'),
    },
    {
      path: 'app/resp.py',
      contents: ['def encode_simple_string(value):', '    return f"+{value}\\r\\n".encode()'].join('\n'),
    },
  ],
  conversationToken: 'fake-conversation-token',
  maxDurationSeconds: 480,
  status: 'ready',
};

export const scoredInterviewReport = {
  overall_verdict: 'mixed',
  planned_question_count: 3,
  questions: [
    {
      anchor: { path: 'app/main.py', start_line: 5, end_line: 12 },
      evidence_quote: 'Each client gets its own thread, and the loop keeps reading until the socket closes.',
      question: 'Walk me through what happens when a client sends PING.',
      strong_answer_points: ['A thread is spawned per connection', 'recv returns an empty bytes object when the client disconnects'],
      verdict: 'demonstrated',
      verdict_explanation: 'Traced the request through their own code accurately.',
    },
    {
      anchor: { path: 'app/main.py', start_line: 7, end_line: 7 },
      evidence_quote: 'I think recv always gives you the full command?',
      question: 'What happens if a RESP command arrives split across two reads?',
      strong_answer_points: ['TCP is a byte stream, so one read can hold part of a command', 'Buffer input until a full RESP frame is parsed'],
      verdict: 'not_demonstrated',
      verdict_explanation: 'Assumed each read returns exactly one command.',
    },
  ],
  review_suggestions: ['Read up on how TCP delivers a byte stream rather than messages.'],
  summary: 'Solid grasp of the connection lifecycle, but the RESP parsing assumes each read holds exactly one command.',
};
