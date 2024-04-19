export default function createLanguages(server) {
  server.create('language', { name: 'C', slug: 'c', trackStatus: 'beta' });
  server.create('language', { name: 'C#', slug: 'csharp', trackStatus: 'beta' });
  server.create('language', { name: 'C++', slug: 'cpp', trackStatus: 'beta' });
  server.create('language', { name: 'Clojure', slug: 'clojure', trackStatus: 'beta' });
  server.create('language', { name: 'Crystal', slug: 'crystal', trackStatus: 'beta' });
  server.create('language', { name: 'Elixir', slug: 'elixir', trackStatus: 'beta' });
  server.create('language', { name: 'Gleam', slug: 'gleam', trackStatus: 'beta' });
  server.create('language', { name: 'Go', slug: 'go', trackStatus: 'live' });
  server.create('language', { name: 'Haskell', slug: 'haskell', trackStatus: 'beta' });
  server.create('language', { name: 'Java', slug: 'java', trackStatus: 'beta' });
  server.create('language', { name: 'JavaScript', slug: 'javascript', trackStatus: 'beta' });
  server.create('language', { name: 'Kotlin', slug: 'kotlin', trackStatus: 'beta' });
  server.create('language', { name: 'Nim', slug: 'nim', trackStatus: 'beta' });
  server.create('language', { name: 'PHP', slug: 'php', trackStatus: 'beta' });
  server.create('language', { name: 'Python', slug: 'python', trackStatus: 'live' });
  server.create('language', { name: 'Ruby', slug: 'ruby', trackStatus: 'beta' });
  server.create('language', { name: 'Rust', slug: 'rust', trackStatus: 'live' });
  server.create('language', { name: 'Scala', slug: 'scala', trackStatus: 'beta' });
  server.create('language', { name: 'Swift', slug: 'swift', trackStatus: 'beta' });
  server.create('language', { name: 'TypeScript', slug: 'typescript', trackStatus: 'beta' });
  server.create('language', { name: 'Zig', slug: 'zig', trackStatus: 'beta' });
}
