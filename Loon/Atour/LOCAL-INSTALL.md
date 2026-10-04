# 亚朵签到 · Loon 本地单插件（R5）

获取、自动和手动签到已合并到同一插件，通过插件参数页面开关控制。建议优先使用 [远程订阅说明](https://github.com/shaohuayongji/Script/tree/master/Loon/Atour)。

1. 把 `atour.loon.js` 和 `atour.capture.js` 导入 Loon 的本地脚本，再导入 `AtourCheckIn.plugin`（公开目录中文件名为 `AtourCheckIn.local.plugin`）。需要 Loon Build 733 或以上。
2. 在插件参数页确认“获取登录信息（临时）”关闭、“自动签到”和“手动签到”开启。停用所有旧版和独立获取插件，避免重复规则。
3. 旧 R3/R4 会话继续用。首次获取或会话失效时临时打开获取开关，启用脚本及 MitM，安装并信任 Loon 证书，进入已登录 App 的签到页。
4. 收到“候选登录信息已保存 · R5”后关闭获取开关，保持整个插件开启；在 Loon 脚本列表运行“亚朵签到（手动）”。自动任务每天本地时间 08:40 运行，可单独关闭。

合并版声明 `miniapp.yaduo.com`，获取脚本关闭不等于移除 MitM 域名；若页面仍异常，请暂时关闭整个插件。轻量请求获取不读取正文或 App 响应，但手机兼容性仍待实测。不要改动其他插件需要的域名。

`loon-snippet.conf` 仍是无需获取和 MitM 的两条日常运行配置，可作为已有会话用户的备选；它没有插件参数开关。旧独立获取插件仅保留兼容，单订阅用户不要同时启用。

54 项模拟测试通过，100014/420000 签到拒绝尚未解决，未确认完整自动签到成功。日志版本为 `2026.10.04.5`，只分享脚本运行日志，不要分享完整 HTTP 请求或本地存储。

维护：

```sh
node build.cjs
node --check atour.loon.js
node --check atour.capture.js
node --test tests/atour.test.cjs
```

来源与验证边界见 `source-notes.md`、`verification.md`。
