# 亚朵签到 · Loon 远程插件

## R4：优先修复 App 页面受影响的问题

用户对照截图显示：R3 插件开启时，签到日历、拼图和按钮加载不完整；关闭插件后正常。具体机制尚未定位，不能把本地模拟中的“原样放行”等同于手机上的实际兼容性。

R4 将日常签到与临时获取分开：**签到插件没有 HTTP 拦截规则，也没有 MitM 域名声明**；仅手动/每天 08:40 执行。获取插件改用约 5 KB 的独立请求脚本，不加载密码库、不读取请求或响应正文、不发额外网络请求。存储、日志或通知出错时仍调用 `$done({})` 放行原请求。获取仍需临时 MitM，手机兼容性须实测，获取后关闭。

**已经用 R3 保存过登录信息的用户，无需重新获取。** 先更新原签到插件，确认描述以 R4 开头；停用所有旧版或重复的抓取规则。关闭并重新打开 App 签到页，先确认页面恢复。若暂不测试自动签到，也可关闭“亚朵签到”的 cron 规则，仅保留手动入口。

## 远程订阅

日常启用：[亚朵签到插件](https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCheckIn.plugin)

```text
https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCheckIn.plugin
```

**仅在首次获取或登录失效时临时启用**：[亚朵获取登录信息插件](https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCapture.plugin)

```text
https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCapture.plugin
```

不要同时保留旧 R1/R2/R3 插件和新版；旧版包含响应拦截规则。原订阅地址不变，R4 脚本 URL 带 `?v=20261004-4` 刷新缓存。日常日志版本应为 `[ATOUR 2026.10.04.4`。

## 首次获取与日常运行

1. 添加并启用“亚朵签到”远程插件，确认两条规则“亚朵签到”和“亚朵签到（手动）”加载成功。此插件不需要抓取或 MitM。
2. 尚无登录信息时，添加并临时启用“亚朵获取登录信息”插件。开启脚本及 MitM，安装并信任 Loon 自己生成的证书；连接 Loon，登录亚朵 App，打开“签到集拼图”。该插件仅匹配 `miniapp.yaduo.com` 的 `indexInfoV2` 状态请求。
3. 收到“候选登录信息已保存 · R4”后，**关闭整个获取插件**。无需点击 App 签到，也不要长期启用获取插件。若开启它仍导致页面异常，立即关闭，并反馈获取脚本日志。
4. 在 Loon 的脚本列表中找到“亚朵签到（手动）”，使用运行按钮执行。先查询服务器状态，候选信息有效且状态可识别时才替换旧会话；验证失败保留旧会话并停止本次运行，不会转用旧账号提交。
5. 日常只启用签到插件；设备本地时间每天 08:40 运行。当天已经在 App 签到时仅查状态，未签到时尝试一次普通签到，再查询确认。验证码需在 App 正常完成。

旧 `atour_loon_session_v1` 会话继续使用；候选信息单独保存在 `atour_loon_candidate_v1`，不会在打开 App 时直接覆盖旧会话。候选信息通知表示已保存请求中的凭据，不代表登录有效或签到成功。

## 当前可用性与失败日志

用户真实 R3 日志确认：普通状态查询 HTTP 200、retcode 0、todaySigned false；普通签到返回 **100014 或 420000**。尚无可靠业务码定义或完整自动签到成功记录。R4 修复的是插件结构与 App 流量干扰风险，**没有宣称解决这些签到业务拒绝**。官方页面有极验流程，不能保证无人值守签到成功。

脚本仍保留固定错误标签、HTTP 状态、业务码、运行阶段与随机运行编号。`retmsgTags=unclassified` 只表示错误文字未命中预设关键词；标签不能当成业务码定义。不会输出完整 URL、Token、Cookie、签名、验证码、姓名、手机号、服务器原文或原始网络错误。

提供日志时：手动脚本复制从 `start mode=checkin` 到 `finish mode=checkin`；临时获取脚本复制从 `start mode=capture_request` 到 `finish mode=capture_request`。不同 Loon 版本入口位置不同，以脚本详情中的日志/运行记录为准。不要发送完整 HTTP 抓包或本地存储。

## 验证与维护

2026-10-04：52 项本地模拟测试通过，覆盖请求放行、正文不读取、本地 API 异常、候选会话验证与竞争更新、旧会话兼容、签到前后状态确认、AES/SM2 解密、失败停止和日志隐私。模拟测试不是 iPhone Loon 页面恢复或真实签到成功证明。

源码、固定依赖和测试位于 `atour-source.zip`；本地安装见 [LOCAL-INSTALL.md](LOCAL-INSTALL.md)。依据见 [source-notes.md](source-notes.md)，验证边界见 [verification.md](verification.md)，内置密码库许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

```sh
node build.cjs
node --check atour.loon.js
node --check atour.capture.js
node --test tests/atour.test.cjs
```

配置参考：[Loon 官方脚本类型](https://nsloon.app/docs/Script/)、[Script API](https://nsloon.app/docs/Script/script_api/)。
