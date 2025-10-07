require "yaml"
require "json"

definition_repository_path = ARGV[0]
definition_file_path = File.join(definition_repository_path, "course-definition.yml")

def exit_with_error(message)
  puts message
  exit 1
end

exit_with_error "#{definition_repository_path} is not a directory" unless File.directory?(definition_repository_path)
exit_with_error "#{definition_file_path} is not a file" unless File.file?(definition_file_path)

definition_file = YAML.load_file(definition_file_path)

definition_file["stages"].each do |stage|
  file = Dir.glob(File.join(definition_repository_path, "stage_descriptions", "*-#{stage["slug"]}.md")).first
  exit_with_error "Unable to locate stage description file for #{stage["slug"]} in #{definition_repository_path}/stage_descriptions" unless File.file?(file)
  stage["description_md"] = File.read(file)
end

puts "export default #{JSON.pretty_generate(definition_file)}"
