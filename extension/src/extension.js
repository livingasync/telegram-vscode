const vscode = require('vscode');

function activate(context) {
  console.log('Extension "telegram-vscode" is being activated');

  let disposable = vscode.commands.registerCommand('telegram-vscode.openTelegramWeb', () => {
    console.log('Command "telegram-vscode.openTelegramWeb" is executed');

    const panel = vscode.window.createWebviewPanel(
      'telegramWeb',
      'Telegram Web',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    const proxyUrl = 'http://localhost:3000';

    panel.webview.html = getWebviewContent(proxyUrl);

    // Aggiungi listener per loggare i messaggi dalla webview
    panel.webview.onDidReceiveMessage(message => {
      console.log(`Message from webview: ${message}`);
    });
  });

  context.subscriptions.push(disposable);
  console.log('Command "telegram-vscode.openTelegramWeb" is registered');
}

function getWebviewContent(proxyUrl) {
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
  <iframe src="${proxyUrl}" onload="sendMessage('Iframe loaded')"></iframe>
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

function deactivate() {
  console.log('Extension "telegram-vscode" is being deactivated');
}

module.exports = {
  activate,
  deactivate
};
