const vscode = require("vscode");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

const home = os.homedir();

function expandHome(p) {
  return p.startsWith("~") ? path.join(home, p.slice(1)) : p;
}

function compactHome(p) {
  return p.startsWith(home) ? "~" + p.slice(home.length) : p;
}

async function listDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("folder-hop.open", async () => {
      const wsFolder = vscode.workspace.workspaceFolders?.[0];
      const startDir = wsFolder ? wsFolder.uri.fsPath : home;

      vscode.commands.executeCommand("notifications.clearAll");

      const qp = vscode.window.createQuickPick();
      qp.placeholder = "Enter to navigate, select Open to open";
      qp.ignoreFocusOut = true;
      qp.value = compactHome(startDir) + "/";
      qp.busy = true;
      qp.show();

      let pending = 0;

      const updateItems = async () => {
        const id = ++pending;
        qp.busy = true;

        const raw = qp.value;
        const expanded = expandHome(raw);
        const dir = raw.endsWith("/") ? expanded : path.dirname(expanded);
        const prefix = raw.endsWith("/") ? "" : path.basename(expanded);

        let names = await listDirs(dir);

        if (id !== pending) return;

        if (prefix) {
          const lower = prefix.toLowerCase();
          names = names.filter((n) => n.toLowerCase().startsWith(lower));
        }

        const items = [
          { label: "$(folder-opened) Open this folder", description: compactHome(dir), isOpenHere: true, alwaysShow: true },
        ];

        const parent = path.dirname(dir);
        if (parent !== dir) {
          items.push({ label: "..", description: compactHome(parent), alwaysShow: true });
        }

        for (const name of names) {
          items.push({ label: name, description: compactHome(path.join(dir, name)), alwaysShow: true });
        }

        qp.items = items;
        qp.busy = false;
      };

      updateItems();
      qp.onDidChangeValue(updateItems);

      qp.onDidAccept(async () => {
        const selected = qp.selectedItems[0];
        if (!selected) return;

        if (selected.isOpenHere) {
          qp.dispose();
          await vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(expandHome(selected.description)),
            true
          );
          return;
        }

        const desc = selected.description;
        qp.value = desc === "/" ? "/" : desc + "/";
      });

      qp.onDidHide(() => qp.dispose());
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
