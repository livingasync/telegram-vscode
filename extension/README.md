## Features

Telegram for VSCode

## Usage

Use it from the sidebar

or

Open Command Palette with `CTRL`+`SHIFT`+`P` or `F1` and type `Open Telegram in a Tab`

## Requirements

Due to limitations in using Telegram website as an IFrame object we need to proxy all the request trough a little script that you can run in docker.
All the code is opensource and can be visited to the related repository. You can also run the script yourself without docker

1. Run the telegram-proxy-server docker container with
   ```sh
   docker run -d --name telegram-proxy-server livingasync/telegram-proxy-server
   ```

2. Reuse container for next time with
   ```sh
   docker start telegram-proxy-server
   ```
## Known Issues

Every feedback would be appreciated
If you need help or have any question, feel free to ask at zangico@gmail.com

## Release Notes

### 1.0.0

Initial release

### 1.1.0

Added sidebar feature
