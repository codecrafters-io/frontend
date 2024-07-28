import os


def find_hbs_files(directory):
    hbs_file_paths = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".hbs"):
                hbs_file_paths.append(os.path.join(root, file))

    return hbs_file_paths


components_dir = "app/components"
hbs_file_paths = find_hbs_files(components_dir)

for hbs_file_path in hbs_file_paths:
    js_file_path = hbs_file_path.replace(".hbs", ".js")
    ts_file_path = hbs_file_path.replace(".hbs", ".ts")

    if os.path.exists(js_file_path):
        continue

    if os.path.exists(ts_file_path):
        continue

    print(f"Creating {js_file_path}")

    component_name = "".join(
        word.capitalize()
        for word in hbs_file_path.split("/")[-1].replace(".hbs", "").split("-")
    )

    with open(js_file_path, "w") as f:
        f.write(
            f"""import Component from '@glimmer/component';

export default class {component_name}Component extends Component {{
}}
"""
        )
