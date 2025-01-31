import os
import shutil


def find_component_files(directory: str) -> tuple[list[str], set[str]]:
    """
    Find all component files (.ts, .js, .hbs) and their corresponding directories
    """
    component_files: list[str] = []
    component_dirs: set[str] = set()

    for root, dirs, files in os.walk(directory):
        # Add all directories to the set
        for dir_name in dirs:
            component_dirs.add(os.path.join(root, dir_name))

        # Collect all component files
        for file in files:
            if file.endswith((".ts", ".js", ".hbs")):
                component_files.append(os.path.join(root, file))

    return component_files, component_dirs


def get_base_name(file_path: str) -> str:
    """
    Get the base name without extension
    """
    return os.path.splitext(os.path.basename(file_path))[0]


def migrate_to_index(components_dir: str):
    component_files, component_dirs = find_component_files(components_dir)

    for file_path in component_files:
        file_dir = os.path.dirname(file_path)
        base_name = get_base_name(file_path)
        extension = os.path.splitext(file_path)[1]

        # Skip if it's already an index file
        if base_name == "index":
            continue

        # Check if there's a directory with the same name
        potential_dir = os.path.join(file_dir, base_name)

        if potential_dir in component_dirs:
            # Create the target directory if it doesn't exist
            target_dir = potential_dir
            os.makedirs(target_dir, exist_ok=True)

            # Define the new file path
            new_file_path = os.path.join(target_dir, f"index{extension}")

            # Skip if the target file already exists
            if os.path.exists(new_file_path):
                print(f"Skipping {file_path} - index file already exists")
                continue

            print(f"Moving {file_path} to {new_file_path}")

            # Move the file
            shutil.move(file_path, new_file_path)


if __name__ == "__main__":
    components_dir = "app/components"
    migrate_to_index(components_dir)
