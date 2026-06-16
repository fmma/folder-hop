# Folder Hop

Like Ctrl+P, but for folders. Type a directory name to filter, press Enter to dive in, and open any folder in a new VS Code window. No saved project list, no setup. Press `Ctrl+Shift+O` (`Cmd+Shift+O` on macOS) to start.

![Demo](https://raw.githubusercontent.com/fmma/folder-hop/main/demo.gif)

## Features

- Quick pick interface for browsing directories, similar to Ctrl+P for files.
- Type a name to filter, Enter to dive in: type, Enter, type, Enter to navigate quickly without the arrow keys.
- Case-sensitive matching that respects the filesystem.
- Hidden dot folders stay out of the way until the typed name starts with ".".
- Navigate to the parent directory with `..`.
- Open any directory in a new window with "Open this folder".
- Starts in the current workspace folder.

## Usage

Press `Ctrl+Shift+O` (`Cmd+Shift+O` on macOS) or run **Folder Hop: Open Folder in New Window** from the command palette.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fmma.folder-hop), or install manually:

```sh
git clone https://github.com/fmma/folder-hop.git
cd folder-hop
ln -s "$(pwd)" ~/.vscode/extensions/fmma.folder-hop
```

Reload VS Code after installing.

## License

MIT
