此项目为本地化部署的文本转语音 Web 应用。使用 [Next.js](https://nextjs.org/) 和 [Microsoft Azure AI Speech](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/) 服务提供的 [文本转语音(Text-to-Speech)](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/text-to-speech) 功能，实现语音合成。Azure AI Speech 提供免费和付费两种订阅方式。用户订阅后，使用个人密钥调用 TTS 服务，实现高质量的文本转语音功能。

### 安装 & 启动

---

1. 下载最新版本的压缩文件，解压到本地目录。

1. 下载并安装 [Node.js](https://nodejs.org/en) ，推荐安装 `LTS v20.12.2` 或更高 `LTS` 版本。

1. 下载并安装 [Python](https://www.python.org/downloads/) ，根据 [node-gyp](https://github.com/nodejs/node-gyp#configuring-python-dependency) 官方文档要求，请安装 `Python 3.12` 或更高版本。

1. 本地目录中找到 `.env` 文件，填入 Azure AI Speech 服务的密钥和区域信息。无法找到 `.env` 文件时，确保已打开隐藏文件显示。

   ```shell
   # Azure AI Speech 服务的密钥
   SPEECH_KEY='密钥'

   # Azure AI Speech 服务的区域信息
   SPEECH_REGION='订阅区域'

   # Azure AI Speech 区域 API 地址
   REGION_VOICE_LIST_API='https://[订阅区域].tts.speech.microsoft.com/cognitiveservices/voices/list'
   ```

1. 自动安装依赖，并启动应用程序。

   - `Windows` 用户找到目录中 `install.bat` 文件双击运行安装 。安装结束后，应用将自动启动。

   - `Mac`，`Linux` 用户在终端中打开目录，执行 `sh ./install.sh` 命令进行安装。安装结束后，应用将自动启动。

   - 如果 `install.bat` 或 `install.sh` 无法执行或安装失败时，可尝试 [手动安装](#手动安装) 。

### 运行

---

应用安装成功。打开浏览器，访问 `http://localhost:3007` ，即可使用文本转语音功能。

- 关闭应用：关闭终端窗口即可。

- 重新启动应用：
  - `Windows` 用户执行目录中 `run.bat` 或者在终端打开目录执行 `npm start` 。
  - `Mac`，`Linux` 在终端打开目录执行 `sh ./run.sh` 命令启动应用，或执行 `npm start` 命令启动应用。

### 手动安装

---

1. 打开终端，进入应用目录。

1. 执行 `npm install  --omit=dev` 安装依赖。

1. 执行 `npm start` 启动应用。

- 关闭应用：关闭终端窗口即可。

- 重新启动应用：终端中在应用目录下执行 `npm start` 。
