import axios from "axios";

const setIntervalId = setInterval(async () => {
  try {
    const res = await axios.get("http://localhost:3007");
    console.log(`服务器响应状态码: ${res.status}`);

    if (res.status === 200 || res.status === 307) {
      console.log(`服务器已启动...`);
      clearInterval(setIntervalId);
    } else {
      console.log(`服务器启动失败...`);
      clearInterval(setIntervalId);
    }
  } catch (error) {
    if (error.response) {
      console.log(`错误响应状态码: ${error.response.status}`);
      if (error.response.status === 307) {
        console.log(`服务器已启动...`);
        clearInterval(setIntervalId);
        return;
      }
    } else {
      console.log(`无法连接到服务器，检查网络连接: ${error.message}`);
    }
    console.log(`服务器正在启动...`);
  }
}, 1000);
