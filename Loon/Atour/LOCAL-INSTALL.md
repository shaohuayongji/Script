# 亚朵签到 · Loon 本地安装（R4）

R3 在用户手机上干扰 App 页面加载。R4 日常插件移除 HTTP 拦截和 MitM；获取改为临时、独立的请求脚本。手机实际页面恢复仍须确认，100014/420000 签到业务拒绝尚未解决。

建议优先使用 [远程订阅说明](https://github.com/shaohuayongji/Script/tree/master/Loon/Atour)。已有 R3 会话可继续用，无需重新抓取。

## 本地安装

1. 把 `atour.loon.js` 导入手机 Loon 的本地脚本，再导入 `AtourCheckIn.plugin`（公开目录下载版本名为 `AtourCheckIn.local.plugin`）。只有 cron 和 generic 两条规则，不需要 MitM。
2. 停用所有旧版签到插件和旧抓取规则，确认新描述以 R4 开头。先检查 App 签到页面正常显示。
3. 首次获取或会话失效时，把 `atour.capture.js` 导入本地脚本，再临时导入 `AtourCapture.plugin`（公开目录中为 `AtourCapture.local.plugin`）。启用脚本与 MitM，安装并信任 Loon 证书，打开已登录的 App 签到页。
4. 收到“候选登录信息已保存 · R4”后关闭整个获取插件。日常仅开启签到插件。
5. 在脚本列表找到“亚朵签到（手动）”，点运行。候选信息由服务器状态查询验证后才替换旧会话；失败则停止。每天本地时间 08:40 自动执行。

`loon-snippet.conf` 只提供两条日常脚本规则，可合并进现有配置；不要继续保留旧 `http-response` 规则或因本插件加入的 MitM 域名。其他插件依赖的域名应由其配置管理。

## 运行与日志

先查状态、未签到时仅尝试一次、提交后再查状态确认。服务要求验证码时请在 App 正常完成。尚未实测完整自动签到成功。日志版本为 `2026.10.04.4`；失败时复制手动脚本 `start mode=checkin` 到 `finish mode=checkin` 的日志。获取脚本使用 `mode=capture_request`。日志隐藏凭据和服务器原文，不要发送完整抓包或本地存储。

## 维护

主逻辑在 `src/atour-main.js`；轻量获取脚本为 `atour.capture.js`。本地运行：

```sh
node build.cjs
node --check atour.loon.js
node --check atour.capture.js
node --test tests/atour.test.cjs
```

52 项模拟测试通过；测试无真实账号或网络请求。来源、协议和可用性边界见 `source-notes.md` 与 `verification.md`。
