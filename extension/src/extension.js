const vscode = require('vscode');
const { execFile } = require('child_process');
const path = require('path');
const os = require('os');

const platform = os.platform();
let serverExecutable;

if (platform === 'win32') {
  serverExecutable = 'telegram-proxy-server-win.exe';
} else if (platform === 'darwin') {
  serverExecutable = 'telegram-proxy-server-mac';
} else if (platform === 'linux') {
  serverExecutable = 'telegram-proxy-server-linux';
} else {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

const serverPath = path.resolve(__dirname, 'binaries', serverExecutable);
const logger = vscode.window.createOutputChannel('Telegram-VSCode');

function activate(context) {

    execFile(serverPath, (error, stdout, stderr) => {
        if (error) {
            logger.appendLine(`Error executing server: ${error.message}`);
            logger.appendLine(`stderr: ${stderr}`);
            return;
        }
        logger.appendLine(`Server output: ${stdout}`);
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('telegram-vscode.openTelegramWeb', () => {
            const panel = vscode.window.createWebviewPanel(
                'telegramWebviewTab',
                'Telegram',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            panel.webview.html = getWebviewContent();
        })
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('telegramWebview', {
            resolveWebviewView(webviewView, context, token) {
                webviewView.webview.options = {
                    enableScripts: true
                };
                webviewView.webview.html = getWebviewContent();
            }
        })
    );

    context.subscriptions.push(logger);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Telegram Web</title>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                }
                iframe {
                    border: none;
                    height: 100%;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <iframe src="http://localhost:49152" onload="sendMessage('Iframe loaded')"></iframe>
            <script>
                function sendMessage(message) {
                    const vscode = acquireVsCodeApi();
                    vscode.postMessage({ text: message });
                }

                window.addEventListener('message', event => {
                    console.log('Received message:', event.data);
                });
            </script>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
