# 亚朵签到 · Loon 远程插件

插件与脚本托管在 `shaohuayongji/Script`，本目录为 `Loon/Atour`。无需单独导入本地 JavaScript 文件，插件的两条规则都引用同一个远程脚本。

## 订阅链接

复制以下完整地址，在 Loon 的插件管理中添加远程插件并启用：

```text
https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCheckIn.plugin
```

[打开插件文件](https://raw.githubusercontent.com/shaohuayongji/Script/master/Loon/Atour/AtourCheckIn.plugin) · [查看脚本](https://github.com/shaohuayongji/Script/blob/master/Loon/Atour/atour.loon.js)

## 首次配置

1. 在 Loon 中添加上面的远程插件，确认 **亚朵签到** 插件已启用，两条脚本规则均加载成功。
2. 启用脚本/重写和 MitM；安装并信任 Loon 自己生成的 MitM 证书，启动 Loon 连接。插件声明了 `miniapp.yaduo.com`，已有自定义配置时确认该域名未被排除。
3. 打开并登录 **亚朵 App**，进入会员签到页“签到集拼图”。查询成功后应收到 **登录信息已保存** 通知。仍未获取时，可通过 App 的正常流程手动签到一次，成功响应也能保存会话。
4. 在 Loon 的脚本列表中手动执行 **亚朵签到**。当天若已在 App 签过，显示“今日已签到”只能验证查询；次日未签到时再测试，才能确认你的账号是否接受普通自动签到请求。
5. 每天设备本地时间 **08:40** 自动运行。保持设备联网和 Loon 运行；上海时区下为北京时间 08:40。

如果此前已添加本地配置或同功能插件，请停用旧的定时/抓取规则，避免重复运行。旧版保存的 `atour_loon_session_v1` 可继续使用，无需把凭据填写到 GitHub。

## 验证码与会话失效

**官方签到页包含极验验证流程，不能保证完全无人值守。** 脚本先查今日状态，未完成时仅尝试一次普通签到，随后再查询确认；服务要求验证码时停止并提醒在 App 正常完成。不会伪造动态签名、验证码结果或重放一次性验证头。

- **今日已签到**：服务器状态查询确认，未重复提交。
- **签到成功**：提交后状态查询确认今日完成。
- **需要人工验证**：去亚朵 App 完成验证码和签到。
- **需要重新登录**：回 App 登录并重新进入签到页，更新本地会话。
- **需要动态签名适配**：本次含签名/时效参数，不能持久重放；重新打开普通状态页面。如果服务强制要求签名，目前此方案不适用。
- **签到结果待确认**：响应丢失、异常或复查未确认；在 App 核对，脚本不会反复提交。

登录 token、Cookie 和必要设备头只保存在手机的 Loon 本地；仓库和通知不保存真实凭据。排查只需提供通知文字、HTTP 状态或业务码，不要分享完整请求或本地存储。

## 更新与验证范围

订阅和脚本地址使用 `master` 分支。仓库更新后，在 Loon 中更新插件，并确认远程脚本同步到最新版本；GitHub Raw 可能短暂缓存。若无法下载，先确认设备能访问 `raw.githubusercontent.com`。

2026-10-04：本地 **45 项模拟测试通过**，已核对官方公开前端和匿名只读接口。尚未在你的真实账号、iPhone/Loon 上实测，合成加密样本也不代表真实账号响应。首次使用须手动验证。

公开接口依据及历史脚本核查见 [source-notes.md](source-notes.md)，测试边界见 [verification.md](verification.md)。[第三方标准库与许可](THIRD_PARTY_NOTICES.md)随单文件脚本内置保留。[本地安装方式](LOCAL-INSTALL.md)可作为不用远程订阅时的备选。

完整源码、固定依赖和测试资料见 `atour-source.zip`，下载并解压后，可读主逻辑在 `src/atour-main.js`。本地维护流程：

```sh
node build.cjs
node --check atour.loon.js
node --test tests/atour.test.cjs
```

Loon 格式依据：[官方插件文档](https://github.com/Loon0x00/LoonManual/blob/master/docs/cn/plugin.md)、[脚本类型](https://github.com/Loon0x00/LoonManual/blob/master/docs/cn/script.md)。
