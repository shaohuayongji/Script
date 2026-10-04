# 亚朵 Loon 签到：来源与验证记录

核查日期：2026-10-04（Asia/Shanghai）。本文记录公开来源和验证边界，不保存账号 token、Cookie、验证码或完整请求。所有网络探测均为公开静态文件或未登录的只读查询；没有在服务器执行签到、抽奖、兑换、登录或发送验证码。

## GitHub 历史脚本

- 原作者 [Sliverkiss 的亚朵 Gist](https://gist.github.com/Sliverkiss/2e2093bfd5f524d58c8e90fed9beacfd) 创建于 `2023-10-16T08:21:53Z`；GitHub API 显示最近修订 [3a62a89ca16225945b7db55f274b20bffef84580](https://gist.github.com/Sliverkiss/2e2093bfd5f524d58c8e90fed9beacfd/3a62a89ca16225945b7db55f274b20bffef84580) 提交于 `2023-11-23T06:55:23Z`。其仍可审查的早期修订 [e399523e428f3c173ec4b95c892725006c3128ff](https://gist.github.com/Sliverkiss/2e2093bfd5f524d58c8e90fed9beacfd/e399523e428f3c173ec4b95c892725006c3128ff) 提交于 `2023-10-16T08:21:52Z`。这是修订时间，不代表现在的接口有效性。
- [jivei/Surge 的 `js/atour.js` 镜像](https://github.com/jivei/Surge/blob/main/js/atour.js) 文件提交记录为 [f84ffb53d17c3ce1899ca8fefd964f7d2db29fbd](https://github.com/jivei/Surge/commit/f84ffb53d17c3ce1899ca8fefd964f7d2db29fbd)，日期 `2023-09-16T12:41:23Z`。脚本头写初始日期 `2023-08-06`、修复通知及增加抽奖日期 `2023-08-08`；后两者是作者注释，不是仓库当前维护证明。
- 原脚本保存手动签到请求的全部请求头和查询字符串，随后以 GET 重放 `/atourlife/signIn/signIn`；以 `retcode === 0` 判定业务成功，并读取 `result.debrisDesc`。它另执行 POST 抽奖接口 `/signIn/lottery`。
- 旧教程引用的 [Sliverkiss/helloworld 原始路径](https://raw.githubusercontent.com/Sliverkiss/helloworld/master/Study/adjd.js) 在本次访问返回 HTTP 404。原作者路径已删除和业务签到接口失效是不同结论。
- 新 Loon 实现仅用于签到和状态检查，须避免把旧脚本的自动抽奖、旧依赖环境、一次性验证码头整体搬入。

## 当前官方前端证据

[亚朵官网会员 H5 首页](https://wechat.yaduo.com/hy/) 在核查日引用 `client-hybrid-h5/prod/20260917191702` 构建。目录时间、脚本中的 Sentry release 标识均属于官方构建标识，不能单独替代真实账号实测。

主要公开源码来源：

- [通用客户端 `app.32fbbca238.js`](https://oss-front-code-prod-c.yaduo.com/client-hybrid-h5/prod/20260917191702/static/js/app.32fbbca238.js)
- [签到页 `activity-signEveryDay.32fbbca238.js`](https://oss-front-code-prod-c.yaduo.com/client-hybrid-h5/prod/20260917191702/static/js/activity-signEveryDay.32fbbca238.js)
- [客户端依赖 `chunk-vendors.32fbbca238.js`](https://oss-front-code-prod-c.yaduo.com/client-hybrid-h5/prod/20260917191702/static/js/chunk-vendors.32fbbca238.js)
- [官方签到页入口](https://wechat.yaduo.com/hy/signEveryDay)

当前路由名为 `signEveryDay`，标题为“签到集拼图”。服务 base URL 为 `https://miniapp.yaduo.com/atourlife`。官方代码仍调用下表中的路径：

| 请求 | 用途 | 官方前端读取的结果字段 |
| --- | --- | --- |
| GET `/signIn/indexInfoV2` | 查询签到首页和今日状态 | `result.todaySignInComplete`、`continuousSignInInfo`、`debrisInfo`、`collectNum`、`canExchangeNum`、`prizeName` |
| GET `/signIn/signIn` | 执行签到（会改变账号状态） | `result.debrisDesc`、`prizeDesc`、`needLottery` |
| GET `/signIn/signInLog` | 查询签到日历 | `result.allNum`、`continueSignInNum`、`signInDate`、`today` |

通用 GET 请求的公开参数名为 `token`、`platType`、`appVer`、`channelId`、`activitySource`、`activityId`、`activeId`、`clientId` 和随机数 `r`。当前 H5 默认 `channelId` 为 `300001`。登录身份应由用户自己的正常客户端流量在 Loon 本机保存；本文没有任何参数实值。

## 验证码、签名与登录限制

官方签到页创建时初始化极验 4（type 为 `sign`），点击“立即签到”调用 `showCaptcha`。完成验证后，客户端调用 `getValidate`，再把 `Lotnumber`、`Captchaoutput`、`Passtoken`、`Gentime` 放入签到请求头。`100042` 是官方验证码模块识别的验证要求码，`10002` 是通用客户端处理的登录失效码。

这些验证结果具有一次性或时效性；新脚本不应重复使用它们，也不应伪造缺失验证字段。官方 `Lacktype` 是正常客户端在验证码 SDK 网络异常时记录的故障信息，不能视为可靠的自动签到方案。遇到验证要求应停止并提醒用户回亚朵 App 完成正常验证。

通用客户端会附同盾指纹 `At-Client-Code`。`At-Client-Sign` 只有调用参数 `isNeedTdSign` 为 true 时才由同盾 SDK 生成；本次读取的签到页面未传这个参数，默认不生成此签名。已有签名或验证结果不能假定可以跨接口、跨日期无限重放。

## 响应加密

官方通用响应拦截器按 `x-encryption` 或 `X-Encryption` 选择解析方式：

- 值 `1`：模块 `311` 的解密函数。Base64URL 转普通 Base64 并补齐 padding，得到字节后转十六进制，检查并去掉非压缩点前缀 `04`，再使用公开客户端内置的 SM2 常量和 `sm2.doDecrypt(..., 0)`。模式 `0` 为 `C1C2C3`；依赖实现以 SM3 验证 C3，失败返回空结果。
- 值 `2`：模块 `109` 的 AES 解密函数。同样先规范化 Base64URL，然后使用 AES-256-CBC、PKCS7 padding 和公开客户端内置的 UTF-8 key/IV 常量，结果按 UTF-8 文本及 JSON 解析。
- 这些常量位于公开官网 JavaScript，属于通用客户端协议数据，并非用户账号凭据；本文不重复抄录值，实施可从对应模块核对。
- 在本次读取的 app、签到页及 vendor 代码中，没有发现可请求明文响应的 header 或 query 参数。正常客户端行为是读取响应头并完成解密。
- 如果加密模式、密文结构、完整性检查或 JSON 结构不符合预期，应报告解析/协议错误，不能当作签到成功或直接归类为登录失效。

## 实际只读探测及结论边界

2026-10-04 09:44（中国时间），不带账号登录信息访问只读接口：

- `/signIn/indexInfoV2`：HTTP 200，返回业务 JSON，`retcode: 10003`、`result: null`，消息为“哎呀！真抱歉,朵儿一时手忙脚乱出了些小问题~”。
- `/signIn/signInLog`：HTTP 405，返回阿里 Tengine 防护 HTML。

09:48 的 `/signIn/indexInfoV2` 匿名响应样本再次为 HTTP 200、同一 `retcode: 10003`；Content-Type 为 `text/json;charset=UTF-8`，没有 `x-encryption` 响应头。匿名样本未观察到真正的加密响应，因而加密支持只能用正常协议的合成样本验证，不能声称已成功解密真实账号响应。

缺少登录参数、匿名环境、防护限制都可能影响这些结果。上述结果不能证实签到接口失效，也不能证实无人值守签到有效。当前官方页面仍包含签到接口是静态证据；真实可用性必须由用户自己的 Loon 和账号运行结果验证。

因此交付应明确区分：公开代码核查、模拟测试、匿名只读探测、真实账号签到实测。脚本成功还应尽可能经 `/signIn/indexInfoV2` 的 `todaySignInComplete` 再次确认，遇验证码、登录失效、加密/结构变化即提示需要用户处理。

## R2：用户截图触发的获取修正

用户提供的旧版 Loon 通知“需要动态签名适配”只说明成功响应获取触发了 `At-Client-Sign` 或可疑查询字段检查，截图无法区分具体原因。旧版将请求头存在等同于接口强制要求动态签名，证据不足。R2 去掉签名头后保存登录信息，随后运行时先查询状态；只有服务器普通查询成功且状态可识别，才允许尝试一次普通签到。查询失败仍停止，并显示业务码，不断言签名一定是原因。没有生成、重放签名或验证码结果。

查询字符串中 `sign`、`signature`、`nonce`、`timestamp`、`ts` 等可疑字段仍不会持久保存，现在通知只显示已知字段名用于排查，不输出任何值。新增手动入口采用 [Loon 官方 generic 类型](https://nsloon.app/docs/Script/#generic)。R2 仅有模拟回归验证，尚未获得真实账号自动签到成功证据。

## R3：真实账号状态可用，签到返回 100014

用户提供 R2 手动运行日志，包含 `capturedWithDynamicSign=true`，普通状态查询 `indexInfoV2` 返回 HTTP 200、无响应加密、retcode 0、todaySigned false；随后普通 `signIn` 返回 HTTP 200、无响应加密、retcode 100014，脚本停止。该日志能确认此账号的普通状态查询可用及本次签到业务拒绝，不能证明签到成功或失败的确切原因。

再次检索官方公开 App H5 主文件、签到页与 vendors，未找到 100014 的明确处理或定义；公开 GitHub 搜索也未找到可作为可靠解释的匹配。本次未发送任何新的真实账号或匿名签到请求。R3 增加错误文字的固定关键词标签，不输出 retmsg 原文，不将 100014 硬编码为某个错误；仍需用户运行日志或 App 正常签到结果帮助进一步区分原因。

## R4：用户 App 对照截图触发的流量隔离修正

用户反馈旧插件开启时日历、拼图和按钮未正常加载，关闭后恢复。旧版使用 `http-response requires-body=true` 并在捕获过程中初始化密码库、读取和解析响应；VM 中输入不变不代表真实 Loon 的响应截获兼容。暂未确定是缓冲、解码、超时、MitM 或其他具体机制，不能声称已定位。

R4 主插件只保留 cron/generic，不包含 HTTP 拦截或 MitM。临时获取插件使用独立 `http-request requires-body=false`，只读状态请求 URL 和请求头，保存候选凭据后原样 `$done({})` 放行；不读取 App 响应、没有密码库或额外请求。候选由独立运行的状态查询验证后才替换旧会话。依据为 [Loon 官方脚本类型](https://nsloon.app/docs/Script/)和 [Script API](https://nsloon.app/docs/Script/script_api/)。获取仍需要临时 MitM，必须获取后关闭。

R3 用户日志另有普通签到业务码 420000，未获得可信定义。100014/420000 自动签到失败尚未解决。R4 手机页面恢复及临时获取兼容性待实测；52 项本地模拟测试只能证明逻辑和模拟 API 下的放行行为。

## R5：单订阅与功能开关

用户要求在同一插件页面手动控制各功能。依据 [Loon 官方插件文档](https://nsloon.app/docs/Plugin/)（Build 733+），使用 `[Argument]` 的 switch，分别以 `enable={capture_enabled}`、`enable={auto_enabled}`、`enable={manual_enabled}` 绑定三条脚本。获取默认 false，另两项默认 true；获取还传入 `argument=[{capture_enabled}]`，脚本仅接受明确 true，关闭或异常参数原样放行。旧独立获取插件保留兼容，但单订阅用户应停用它。

合并版需要声明 `miniapp.yaduo.com`。官方 MitM 文档仅记载 hostname、通配及排除，并未确认同一布尔参数能控制域名；未编造条件域名语法。关闭获取脚本不移除 MitM 声明，不能沿用 R4 日常版“无 MitM”的结论。54 项模拟测试通过；手机开关显示、MitM 兼容性和 100014/420000 签到原因仍待验证。

## R6：用户录屏与临时 App 签到诊断

用户 R5 录屏确认当前开关和获取流程可执行，该次 App 页面正常加载；脚本状态查询 retcode 0、候选晋升成功，signIn 仍为 100014。普通请求未带签名、验证码、设备头；这只能作为与 App 正常提交对比的线索，不能确定该业务码定义或失败原因。

临时诊断开关默认关闭，使用两个仅匹配 signIn 的请求/响应脚本，均 `requires-body=false`，不截取 App 响应正文。依据 [Loon Script API](https://nsloon.app/docs/Script/script_api/)读取 URL 中白名单字段名、请求头存在性和响应状态/加密标签；实际值不输出或持久保存。不发送额外请求、不保存或重放验证结果。最近 40 个本地脱敏事件通过手动报告入口导出；不具备远程读取用户手机日志的能力。

只读状态入口单独构建，固定启用 QUERY_ONLY，避免参数丢失时误提交。用户在 App 完成人工签到后可查服务器状态。65 项模拟测试通过；诊断 HTTP 200 无法证明 App 业务成功，须结合 App 提示与只读查询。R6 手机兼容性和全自动签到仍待验证。

补充用户 App 手动签到录屏：正常点击立即签到后出现点选验证窗口；用户完成验证后页面显示“签到成功”及“今日已签到”。这证实该次 App 操作的人工验证与成功结果；脚本普通请求没有该次验证信息，但仍不能据此给 100014 固定编码含义。没有捕获或解答验证题目，也没有获取、保存或重放验证结果。诊断启用前的历史请求不可补录，已完成当日签到不应为了日志重复提交。
