# 用户节省金额展示功能设计文档

> 状态：设计方案  
> 目标功能：向用户展示“RAPI 已帮你节省约 xx 元”  
> 基准日期：2026-07-27  
> 相关页面：用户概览、钱包、用量日志、模型广场  
> 相关模块：`model/pricing.go`、`controller/pricing.go`、`service/text_quota.go`、`model/log.go`、`web/src/features/pricing/**`、`web/src/features/dashboard/**`、`web/src/features/usage-logs/**`

## 1. 背景

当前系统已经具备完整的模型价格展示与消费日志能力：

- 模型广场通过 `/api/pricing` 暴露模型价格、分组倍率、可用分组、供应商与端点信息。
- 后端计费在请求结算时写入消费日志，日志包含实际扣费 `quota`、模型名、分组、token 数、计费倍率和 `other` 快照。
- 前端已有统一的额度与货币格式化能力，可以把 quota 展示为 USD、CNY 或自定义货币。
- 价格同步已支持官方倍率预设、`models.dev`、OpenRouter 和其他 new-api 兼容定价接口。

因此，“节省金额”不需要从零建立一套独立价格系统。更合理的做法是复用模型广场和计费日志已有数据，在结算时固化一次“官方定价估算”，后续查询只做聚合和展示。

### 1.1 官方定价声明

本文中的基准价定义为“官方定价快照”：即模型广场中已由系统或管理员确认来源于模型服务商官方公开定价的价格数据。节省金额只基于该官方定价快照计算。

实现和运营必须遵守以下约束：

- 只有已确认来自官方定价的数据才能进入节省估算。
- `models.dev`、OpenRouter、兼容 `/api/pricing` 或 `/api/ratio_config` 只能作为导入通道；导入后必须被标记为“已确认官方定价”才可参与节省估算。
- 管理员自定义折扣价、渠道采购价、站内促销价、充值优惠价和分组优惠价不得作为官方定价。
- 每个官方定价快照必须记录来源、更新时间和确认状态。
- 官方定价来源应尽量记录服务商官方价格页、官方文档或官方公告 URL，便于管理员审计。
- 无法确认官方来源的模型必须跳过节省估算，不得用默认倍率猜测。

## 2. 目标

- 在用户侧展示本月、近 24 小时等短时间窗口内的估算节省金额。
- 复用现有模型广场价格体系，避免重复维护模型价格。
- 保证历史节省金额不会因后续价格表调整而漂移。
- 文案明确为“估算”和“官方定价”，不作为严格财务账单。
- 对管理员可解释：每条日志能追溯官方定价、实际扣费和差额。
- 不影响现有计费、预扣费、结算、退款和订阅扣费语义。

## 3. 非目标

- 不承诺节省金额与任何官方账单逐分一致。
- 不抓取或实时校验所有上游官网价格。
- 不把“官方定价”用于实际扣费。
- 不在第一阶段支持所有复杂任务类、图片、音频、视频和特殊表达式的完整官方价对齐。
- 不在第一阶段展示累计节省金额；累计值依赖日志保留策略，需等聚合表或汇总字段落地后再承诺。
- 不在第一阶段统计任务类、固定按次类、动态表达式类和会产生后续退款/重算的异步请求。
- 不新增生产依赖，不引入外部价格 SaaS。
- 不修改受保护的项目品牌、许可、归属、包名和元数据。

## 4. 核心口径

### 4.1 展示口径

用户可见文案统一使用估算表达：

- `RAPI 已帮你节省约 {{amount}}`
- `按官方定价估算`
- `官方定价更新时间：{{time}}`
- `部分特殊请求暂不计入节省估算`

避免使用以下绝对表述：

- `真实节省`
- `官方账单价`
- `保证比官方便宜`
- `精确节省`

### 4.2 计算口径

每次请求结算时计算并记录：

```text
estimated_official_quota = 按官方定价估算的 quota
actual_quota = 当前请求实际扣费 quota
savings_quota = max(estimated_official_quota - actual_quota, 0)
savings_ratio = savings_quota / estimated_official_quota
```

只展示非负节省。若实际价格高于官方定价估算，`savings_quota` 记为 `0`，不向用户展示“亏损”或负节省。该请求仍可写入 `savings_estimate`，用于统计覆盖率和管理员解释，但前端不展示“节省 0”。

官方定价估算不叠加站内分组倍率、用户特殊倍率、充值折扣、渠道采购成本或管理员促销策略；实际扣费则直接使用本次请求最终写入日志的 `quota`。因此该差额表达的是“用户按 RAPI 实际扣费相比官方公开定价少消耗的额度”，而不是上游采购成本差额。

### 4.3 金额换算

后端统一存储 quota，不存储展示货币金额。前端继续使用现有额度/货币格式化逻辑把 `savings_quota` 转换为站点配置的展示货币。

这样可以保持：

- 账务基础单位一致。
- 多货币展示随站点配置自动变化。
- 历史数据不受汇率展示配置影响。
- 展示金额是“按官方定价与站内实际扣费折算的额度差额”，不是用户真实付款差额。

## 5. 数据来源设计

### 5.1 官方定价来源

第一优先级使用系统内已有官方定价快照：

1. 模型广场当前本地“官方定价快照”。
2. 官方倍率预设。
3. 已由管理员确认来源为官方定价的同步结果。
4. 已由管理员确认来源为官方定价的兼容 `/api/pricing` 或 `/api/ratio_config` 价格源。

不建议直接把当前模型广场“最终展示价”当成官方价，因为模型广场展示价会叠加分组倍率、充值倍率和站点优惠策略。官方定价应是一个独立的“基准价快照”，但其字段结构应与模型广场定价结构保持一致。

### 5.2 官方定价维护流程

官方定价快照的维护建议放在“系统设置 -> 分组与模型定价设置”或模型广场管理入口中，沿用现有价格同步能力：

1. 管理员从官方倍率预设、同步源或手工录入导入候选价格。
2. 系统展示候选价格与当前站内定价的差异，但不自动参与节省估算。
3. 管理员逐批确认“这些价格来自官方公开定价”，并填写或保留 `source_url`、`source_updated_at`。
4. 确认动作写入管理审计日志，记录操作者、模型范围、来源和更新时间。
5. 确认后刷新官方定价快照缓存；旧消费日志保持原快照，不回写历史。

如果官方价格长期未更新，系统不应静默继续强调节省金额。建议默认超过 90 天时在管理员端提示“官方定价可能已过期”；是否继续计算由后续配置决定，MVP 可继续使用已确认快照，但用户侧必须展示该快照的更新时间。

### 5.2.1 模型广场复用边界

模型广场可以作为官方定价快照的主要展示和维护入口，但节省估算不能直接读取模型广场“最终展示价”。两者关系如下：

- 模型广场展示层可以继续展示站内可用分组、分组价格和动态价格说明。
- 节省估算只读取模型广场定价结构中被标记为 `official_confirmed=true` 的官方基准价字段。
- 如果同一个模型同时存在官方基准价和站内分组价，节省估算使用官方基准价，实际扣费使用消费日志最终 `quota`。
- 如果模型广场价格是从第三方聚合源同步而来，但未经过管理员官方确认，只能用于模型广场参考展示，不能用于“RAPI 已帮你节省”。
- 如果后续在模型广场展示“约省 xx%”，也必须使用同一份官方定价快照，避免用户概览、日志详情和模型广场口径不一致。

这可以回应“模型广场已有官方定价”的产品直觉：是复用模型广场的定价能力，但需要把“官方基准价”和“站内展示价”明确分层。

### 5.2.2 官方来源 URL 校验

官方定价来源 URL 用于审计和解释，不能成为安全风险或隐私泄露点。MVP 建议：

- 只允许 `http` 和 `https` URL。
- 保存前去除明显敏感的 query 参数，例如 `token`、`key`、`secret`、`signature`。
- 普通用户侧优先展示来源域名和更新时间，完整 URL 可放在管理员端。
- 管理员端允许查看完整 URL，但不得包含内部渠道控制台、带签名的临时链接或私有价格单。
- URL 为空时仍可确认官方定价，但必须记录 `source` 和 `source_updated_at`，并在审计日志中说明来源依据。

### 5.3 实际价来源

实际价以现有消费日志为准：

- 文本类：`service/text_quota.go` 结算后的 `summary.Quota`，作为 MVP 唯一统计来源。
- 任务类：现有任务结算路径中的最终 `Quota`，后续阶段接入。
- 固定按次类：现有 `ModelPriceHelperPerCall` 后的实际扣费，后续阶段接入。
- 订阅扣费：仍按实际消耗记录，展示层可说明“节省估算按请求实际消耗统计，不区分钱包或订阅来源”。

任务类、固定按次类和异步请求必须等失败退款、超时退款、实际用量重算和差额结算路径全部能同步修正节省估算后再纳入统计。MVP 不统计这些路径，避免退款后仍展示过高节省金额。

### 5.4 历史稳定性

必须在日志写入时记录估算结果，而不是查询时按最新价格重算。原因：

- 官方价格可能变更。
- 管理员可能同步新的模型倍率。
- 用户分组、特殊倍率和充值汇率可能变化。
- 模型别名和映射可能调整。

日志快照是历史展示唯一可信来源。

如果实例关闭消费日志、日志保留周期过短，或日志被清理/归档，MVP 只展示当前可查询日志窗口内的节省估算。前端不得把缺失日志推断为 0 消费或 0 节省，应隐藏金额或展示覆盖率不足提示。

## 6. 后端设计

### 6.1 配置结构

新增一个运营配置，建议命名为 `savings_estimate_setting`：

```json
{
  "enabled": false,
  "show_on_dashboard": true,
  "show_on_usage_logs": true,
  "reference_price_source": "official_snapshot",
  "require_official_confirmation": true,
  "include_unpriced_models": false,
  "official_price_stale_days": 90,
  "max_summary_days": 31,
  "max_summary_log_rows": 50000,
  "updated_at": 1764230400
}
```

配置原则：

- 默认关闭，只有官方定价快照和展示文案确认后再开启。
- 关闭时不计算、不展示；已写入的历史 `savings_estimate` 仍保留在日志中，但前端不展示。
- 未配置官方定价或未确认官方来源的模型默认跳过，不猜价格。
- 后续如允许默认倍率回退，也必须先将该默认倍率标记为已确认官方定价。
- `max_summary_days` 限制用户侧查询窗口，避免把日志查询做成长期统计。
- `max_summary_log_rows` 是 MVP 的保护阈值；超过后应返回部分结果标识或提示用户缩小时间范围。

### 6.2 官方定价快照

新增运行时价格快照结构，字段尽量与 `model.Pricing` 对齐：

```go
type SavingsOfficialPrice struct {
    ModelName              string
    QuotaType              int
    ModelRatio             float64
    CompletionRatio        float64
    ModelPrice             float64
    CacheRatio             *float64
    CreateCacheRatio       *float64
    ImageRatio             *float64
    AudioRatio             *float64
    AudioCompletionRatio   *float64
    BillingMode            string
    BillingExpr            string
    Source                 string
    SourceURL              string
    SourceUpdatedAt        int64
    OfficialConfirmed      bool
    ConfirmedAt            int64
    ConfirmedBy            string
}
```

该结构不需要第一阶段建表。MVP 可从现有 ratio 配置和同步数据构建内存快照，持久化仍放在 `options` 表中的 JSON 配置里，符合当前系统设置模式。`ConfirmedBy` 只用于管理员审计，不向普通用户展示。

后续当价格源、审计和版本管理复杂化后，再考虑独立表。

### 6.2.1 缓存与失效策略

官方定价快照可以复用现有模型广场的一分钟缓存思路，但需要独立失效语义：

- 管理员确认、取消确认或更新官方定价后，立即刷新官方定价快照缓存。
- 站内分组倍率、用户特殊倍率、渠道成本、充值倍率变化时，不应刷新历史日志中的节省估算。
- 快照缓存只影响新请求写入的 `savings_estimate`；旧日志始终按日志内快照展示。
- 如果缓存刷新失败，应停止写入新的节省估算并记录系统错误，不能使用过期或半更新快照继续生成用户可见金额。
- 多实例部署下，优先复用现有 option/settings 广播或缓存失效机制；没有跨实例通知时，允许短时间内按旧快照写入，但必须受 `source_updated_at` 约束并可审计。

### 6.3 日志字段

不建议第一阶段修改 `logs` 表结构。应复用 `logs.other`，新增普通用户可见字段：

```json
{
  "savings_estimate": {
    "schema_version": 1,
    "calculator": "text_token_v1",
    "official_quota": 1200,
    "actual_quota": 800,
    "savings_quota": 400,
    "source": "official_snapshot",
    "source_url": "https://provider.example/pricing",
    "source_updated_at": 1764230400,
    "official_confirmed": true,
    "matched_model": "gpt-4o",
    "pricing_mode": "per_token",
    "estimated": true
  }
}
```

字段说明：

| 字段 | 说明 |
| ---- | ---- |
| `schema_version` | 日志快照结构版本，MVP 固定为 `1` |
| `calculator` | 估算计算器标识，例如 `text_token_v1` |
| `official_quota` | 按官方定价估算的 quota |
| `actual_quota` | 本次实际扣费 quota |
| `savings_quota` | 非负节省 quota |
| `source` | 官方定价来源 |
| `source_url` | 官方定价来源 URL，可为空；写入前必须确认可公开或完成脱敏 |
| `source_updated_at` | 官方定价源更新时间 |
| `official_confirmed` | 是否已确认来源于官方定价 |
| `matched_model` | 本次估算匹配到的官方定价模型名 |
| `pricing_mode` | `per_token`、`per_request`、`tiered_expr` 等 |
| `estimated` | 固定为 `true`，向前端明确这是估算数据 |

不放入 `admin_info`，因为节省金额是用户可见价值信息；但可额外在 `admin_info` 放调试字段，例如匹配到的原始模型名、跳过原因或价格版本。

日志解析必须向前兼容：

- 未知 `schema_version` 默认跳过聚合，不报错。
- 缺少 `savings_estimate`、`savings_quota` 或字段类型不合法时跳过该条日志。
- `Other` 为空、非 JSON 或解析失败时跳过该条日志，并只影响覆盖率。
- 新版本可以增加字段，但不能改变 `official_quota`、`actual_quota`、`savings_quota` 的含义。

### 6.4 模型名匹配

官方定价快照匹配必须使用稳定、可追溯的顺序：

1. 优先使用 `relayInfo.OriginModelName`。
2. 若请求发生模型映射，记录并尝试匹配映射前模型名和映射后模型名。
3. 对 compact、thinking budget 等项目已有模型名规则，复用 `ratio_setting.FormatMatchingModelName` 的归一化结果。
4. 最后才允许使用已有通配符规则，例如 compact wildcard 或明确配置的模型通配符。
5. 匹配失败时跳过节省估算，不使用相似名称、供应商名称或前缀猜测。

写入日志时必须保存 `matched_model`，用于后续解释历史估算为什么使用某个官方定价。

### 6.5 计算入口

文本类请求在 `service/text_quota.go` 中完成实际扣费后，写日志前注入 `savings_estimate`。

推荐流程：

```text
calculateTextQuotaSummary
  -> 得到 actual quota
  -> TryTieredSettle 如适用
  -> build other
  -> AttachSavingsEstimate(ctx, relayInfo, usage, actualQuota, other)
  -> attachQuotaSaturation
  -> RecordConsumeLog
```

MVP 只在文本类成功消费日志写入前注入。任务类和固定按次类走对应日志写入前的同名注入函数，但必须在第二阶段完成退款/重算闭环后再开启，保持“只影响日志，不影响扣费”。

### 6.6 计算规则

#### 普通 token 模型

按现有实际计费公式的结构计算官方定价估算，但使用官方定价快照字段：

```text
official_quota =
  (
    prompt_tokens
    + completion_tokens * official_completion_ratio
    + cache_tokens * official_cache_ratio
    + cache_create_tokens * official_create_cache_ratio
    + image_tokens * official_image_ratio
    + audio_tokens * official_audio_ratio
  )
  * official_model_ratio
```

再通过 `common.QuotaFromDecimalChecked` 转换为 quota，遵守现有溢出保护。

注意事项：

- 必须复用现有 token 归一化语义，避免缓存、图片、音频重复计价。
- Claude 语义与 OpenAI 语义要与实际扣费路径保持一致。
- 没有足够 usage 数据时跳过，不估算。

#### 固定按次模型

```text
official_quota = official_model_price * common.QuotaPerUnit
```

如果实际扣费使用了分组倍率、请求倍率或任务倍率，官方定价默认不叠加站内分组优惠，只代表官方公开基准价。任务时长、分辨率、数量等官方也收费的参数，第二阶段只在已有可靠参数和边界校验时纳入。

#### 动态表达式模型

MVP 默认跳过动态表达式模型。动态表达式需要冻结 request body、headers、表达式版本、request rules 和 token 归一化上下文，第一阶段不承担该复杂度。

后续阶段如果官方定价也是 `tiered_expr`，可以复用 `pkg/billingexpr` 计算：

```text
official_quota = official_expr_result / 1_000_000 * common.QuotaPerUnit
```

若当前模型实际使用动态表达式，但没有官方定价表达式，则跳过该请求的节省估算。不要用简单 input/output 比率猜测复杂表达式。

### 6.7 服务边界

建议新增独立的 service 层逻辑，例如 `service/savings_estimate.go`，只负责三件事：

1. 根据模型名和官方确认状态读取官方定价快照。
2. 根据本次 usage 和实际扣费生成 `savings_estimate`。
3. 解析日志中的 `savings_estimate` 并做用户窗口聚合。

它不应该负责：

- 修改用户余额。
- 改变实际扣费 quota。
- 处理退款、补扣或订阅权益。
- 同步第三方价格源。
- 渲染前端金额和货币。

推荐内部返回结构：

```go
type SavingsEstimateResult struct {
    Estimate  *SavingsEstimate
    SkipReason string
}
```

`Estimate == nil` 表示不写用户可见字段。`SkipReason` 只进入管理员调试或日志，不向普通用户暴露。

### 6.8 跳过原因枚举

为便于调试和测试，跳过原因建议使用稳定枚举字符串：

| 原因 | 说明 |
| ---- | ---- |
| `disabled` | 功能关闭 |
| `missing_official_price` | 没有官方定价快照 |
| `unconfirmed_official_price` | 价格源未确认来自官方 |
| `missing_usage` | 缺少 usage，无法估算 |
| `unsupported_billing_mode` | MVP 不支持该计费模式 |
| `unsupported_async_task` | MVP 不支持异步任务路径 |
| `unknown_extra_ratio` | 命中未知附加倍率 |
| `quota_saturated` | 官方定价估算触发 quota 饱和 |
| `invalid_snapshot` | 官方定价快照字段非法 |

这些枚举可用于后端测试、管理员日志和运营覆盖率分析，但不应出现在普通用户界面。

## 7. 聚合接口设计

### 7.1 用户接口

新增：

```http
GET /api/user/savings/summary?start_timestamp=...&end_timestamp=...
```

返回：

```json
{
  "success": true,
  "data": {
    "enabled": true,
    "savings_quota": 123456,
    "official_quota": 345678,
    "actual_quota": 222222,
    "request_count": 128,
    "estimated_request_count": 112,
    "coverage_ratio": 0.875,
    "source": "official_snapshot",
    "official_confirmed": true,
    "source_updated_at": 1764230400,
    "official_price_stale": false,
    "is_partial": false,
    "window_days": 30
  }
}
```

说明：

- `enabled=false` 表示功能关闭，前端应隐藏节省入口和金额。
- `request_count` 是范围内总消费请求数。
- `estimated_request_count` 是成功写入 `savings_estimate` 的请求数。
- `coverage_ratio` 用于提示估算覆盖率。
- 只查询当前登录用户。
- MVP 查询窗口建议限制在 31 天以内，只承诺本月和近 24 小时等短窗口。
- 不提供 lifetime/cumulative 字段，避免日志清理或归档后累计值失真。
- `official_price_stale` 表示本次汇总中存在超过过期阈值的官方定价快照。
- `is_partial` 表示日志扫描超过保护阈值，前端应弱化或隐藏金额并提示缩小范围。
- 时间范围使用 `[start_timestamp, end_timestamp)` 左闭右开区间，避免相邻窗口重复统计。
- `end_timestamp` 必须大于 `start_timestamp`，且不能超过当前时间太多；未来时间可截断到当前时间或返回 400，建议返回 400 保持输入严格。

### 7.2 管理员接口

可后续增加：

```http
GET /api/savings/summary?username=...&start_timestamp=...&end_timestamp=...
```

用于运营分析，不作为 MVP 必需项。

### 7.3 查询实现

MVP 为了兼容 SQLite、MySQL、PostgreSQL 和 ClickHouse，不依赖数据库 JSON 查询函数。推荐两阶段：

1. 时间范围较短的用户侧汇总，按 `user_id`、`type=consume`、时间范围查询日志后在 Go 中解析 `Other`。
2. 后续如果需要长期累计高性能统计，再把 `savings_quota` 汇总进 `quota_data` 或新增聚合表。

不建议第一阶段使用 MySQL JSON_EXTRACT 或 PostgreSQL JSONB 操作符，因为会增加跨数据库分支。

MVP 查询实现约束：

- 只查询必要字段，例如 `id`、`created_at`、`quota`、`other`，不要加载完整日志内容。
- 查询前先按相同条件 `COUNT`，超过 `max_summary_log_rows` 时返回 `is_partial=true`，并建议前端提示缩小时间范围。
- 后端不要为部分结果补推测值；部分结果只用于保守展示或隐藏金额。
- 查询条件必须包含 `user_id` 和时间范围，不能允许无边界扫描。
- 时间范围参数无效时返回 400，不使用“默认全部时间”。

### 7.4 失败行为与错误码

用户汇总接口建议采用稳定的失败口径：

| 场景 | 建议响应 |
| ---- | ---- |
| 功能关闭 | `200`，返回 `enabled=false` 和空汇总，前端隐藏入口 |
| 时间范围缺失 | `400`，提示必须传入开始和结束时间 |
| 时间范围非法 | `400`，提示时间范围无效 |
| 超过 `max_summary_days` | `400`，提示缩小时间范围 |
| 超过 `max_summary_log_rows` | `200`，返回 `is_partial=true`，不返回推测金额 |
| 无可估算日志 | `200`，返回 `savings_quota=0`、`estimated_request_count=0`，前端隐藏金额 |
| 官方定价全部过期 | `200`，返回 `official_price_stale=true`，前端展示更新时间 |

这里不建议用 `404` 表示功能关闭或无数据，因为这不是资源不存在，而是产品展示条件不足。

### 7.5 前端类型建议

前端 API 类型应保持和后端响应一致，避免在组件里拼装业务语义：

```ts
type SavingsSummary = {
  enabled: boolean
  savings_quota: number
  official_quota: number
  actual_quota: number
  request_count: number
  estimated_request_count: number
  coverage_ratio: number
  source: 'official_snapshot'
  official_confirmed: boolean
  source_updated_at: number
  official_price_stale: boolean
  is_partial: boolean
  window_days: number
}
```

组件只根据 `enabled`、`is_partial`、`savings_quota` 和 `coverage_ratio` 决定展示状态；金额格式化继续复用现有 quota/currency 工具。

## 8. 前端设计

### 8.1 用户概览

在用户概览余额摘要区域增加一个轻量指标：

```text
RAPI 已帮你节省约 ¥32.18
按官方定价估算，本月覆盖 87.5% 请求
```

位置建议：

- 放在 `SummaryCards` 右侧余额区域的次级信息位。
- 不新增大面积营销卡片。
- 当没有估算数据时隐藏，不保留空状态卡片。
- 当 `is_partial=true` 时不展示金额，只展示“数据量较大，请缩小时间范围查看估算节省”。
- 当 `official_price_stale=true` 时仍可展示金额，但必须同时展示官方定价更新时间。
- 当 `savings_quota=0` 时隐藏节省金额，避免出现没有价值感的“节省 0”。
- 当功能关闭、覆盖率为 0 或日志窗口不完整时，整个节省指标隐藏或展示保守提示，不把空数据渲染成“已节省 ¥0”。

### 8.2 钱包页

钱包页展示后置到聚合表阶段。只有当长期累计值可靠后，才在充值主流程附近展示累计节省：

```text
累计估算节省：¥1,284.90
```

用途是增强用户充值前的价值感知，但不能遮挡充值金额、到账金额和支付方式。MVP 不在钱包页展示节省金额，避免用户把额度差额理解为真实现金返还或付款差额。

### 8.3 用量日志

日志详情弹窗展示单次请求：

```text
官方定价估算：¥0.0120
实际扣费：¥0.0080
估算节省：¥0.0040
来源：官方定价快照，更新时间：2026-07-27
```

列表列不建议默认新增，避免请求日志过宽。可在列设置中作为可选列。

### 8.4 模型广场

模型广场可以展示“站内价 vs 官方定价”的弱提示：

```text
约省 24%
```

但这应作为后续阶段。MVP 优先完成基于真实请求日志的用户节省金额，因为它更贴近实际价值。

### 8.5 国际化

新增所有可见文本必须进入 `web/src/i18n/locales/{lang}.json`：

- en
- zh
- zh-TW
- fr
- ru
- ja
- vi

组件中使用 `useTranslation()` 和 `t('English key')`。长语言下金额、百分比和说明允许换行，不固定高度。

## 9. 边界与跳过策略

以下情况不计算节省金额：

- 没有官方定价。
- 价格源未确认来自官方定价。
- 上游没有返回 usage，实际扣费为 0。
- 任务类、固定按次类或异步请求尚未接入退款/重算闭环。
- 模型使用复杂动态表达式，但缺少官方定价表达式。
- 请求命中未知附加倍率，无法安全映射到官方价。
- 官方定价估算触发 quota 饱和。

跳过时不写用户可见 `savings_estimate`。管理员调试可选写入：

```json
{
  "admin_info": {
    "savings_skip_reason": "missing_reference_price"
  }
}
```

实际扣费大于或等于官方定价估算时，不属于估算失败。后端可以写入 `savings_quota=0` 的 `savings_estimate` 以保留覆盖率和解释性，但前端不展示“节省 0”，也不展示负节省。

## 10. 安全与合规

- 节省金额仅用于展示，不参与扣费、退款、发票、充值到账或订阅权益。
- 不向前端暴露内部渠道成本、供应商密钥、渠道余额或管理员采购价。
- 不向普通用户暴露 `ConfirmedBy`、内部审计备注、导入任务 ID 或管理员账号。
- 用户只能查看自己的节省汇总。
- 管理员聚合接口必须沿用现有管理权限中间件。
- 官方定价确认动作建议写入审计事件 `savings.official_price_confirm`，取消确认写入 `savings.official_price_unconfirm`，批量更新写入 `savings.official_price_update`。
- 所有 JSON 编解码继续使用 `common.Marshal`、`common.Unmarshal`、`common.DecodeJson` 等包装函数。
- 所有 quota 转换使用 `common.QuotaFromDecimalChecked` 等现有安全函数，禁止裸 `int(...)` 转换。
- 跨数据库实现避免数据库专属 JSON 查询语法，除非为每个受支持数据库提供分支与回退。
- 普通用户可见的 `source_url` 必须经过脱敏或只展示域名，避免把带 token 的导入地址写进日志后长期暴露。

### 10.1 可观测性

建议记录以下轻量指标或结构化日志，便于灰度期判断功能质量：

- `savings_estimate_attached_total`：成功写入估算的请求数。
- `savings_estimate_skipped_total{reason}`：按跳过原因统计。
- `savings_estimate_zero_savings_total`：官方估算价不高于实际扣费的请求数。
- `savings_estimate_stale_price_total`：使用过期官方快照的请求数。
- `savings_summary_partial_total`：汇总触发 `is_partial=true` 的次数。
- `savings_official_price_confirm_total`：官方定价确认次数。

这些指标只用于内部观测，不向普通用户展示。灰度期重点关注覆盖率、跳过原因分布和用户侧误解反馈，不以总节省金额作为唯一成功指标。

## 11. 实施阶段

### 11.1 阶段一：日志快照 MVP

后端：

1. 新增 savings estimate 配置。
2. 构建官方定价快照读取函数。
3. 增加官方定价确认与审计入口，或先以受控配置方式导入已确认快照。
4. 在文本类消费日志写入前注入 `other.savings_estimate`。
5. 新增用户节省汇总接口，按短时间范围解析日志聚合。
6. 增加后端单元测试，覆盖有官方定价、无官方定价、未确认官方来源、负节省、模型名匹配、动态表达式跳过和饱和跳过。

前端：

1. 新增 savings summary API 与类型。
2. 在用户概览展示本月估算节省。
3. 在日志详情展示单次估算节省。
4. 补齐七语言。

### 11.2 阶段二：任务类与固定按次

- 完成失败退款、超时退款、实际用量重算和差额结算对节省估算的修正策略。
- 接入 Midjourney、Sora、Veo、图片生成等固定按次或任务类路径。
- 对时长、分辨率、数量等附加倍率建立官方价映射。
- 在任务日志详情中展示估算节省。

### 11.3 阶段三：运营分析与模型广场对比

- 管理员按用户、分组、模型查看总节省。
- 模型广场展示官方定价与站内价差异。
- 可选增加价格源更新时间、来源说明和覆盖率报表。

### 11.4 阶段四：聚合表优化

当日志量较大时，增加聚合持久化：

- 在 `quota_data` 中增加 `savings_quota`、`official_quota`，或新增 `savings_data` 表。
- 写入时按天、用户、模型、分组汇总。
- 基于聚合数据再开放累计节省和钱包页累计展示。
- 保持 SQLite、MySQL、PostgreSQL 迁移兼容。

### 11.5 灰度与回滚

上线建议按以下顺序：

1. 发布后端配置、官方定价快照和日志注入能力，但保持 `enabled=false`。
2. 管理员导入并确认少量主流文本模型官方定价。
3. 在测试环境或内部账号开启，检查日志详情中的单次估算。
4. 开启用户汇总接口，但前端入口保持隐藏。
5. 对小范围用户展示用户概览指标，观察跳过率、覆盖率和反馈。
6. 全量展示用户概览，日志详情保持可解释。

回滚策略：

- 关闭 `enabled` 后，停止写入新的 `savings_estimate`，前端隐藏汇总入口。
- 已写入日志无需清理；它们只是历史展示快照，不影响账务。
- 如果发现官方定价源错误，应取消对应模型官方确认并刷新缓存；旧日志不自动回写，必要时只在管理员侧标记该价格版本异常。
- 如果前端文案引发误解，可只关闭 `show_on_dashboard`，保留日志详情供管理员和用户解释。

## 12. 测试要求

### 12.1 后端测试

建议测试点：

- token 模型按官方定价计算 `official_quota` 和 `savings_quota`。
- 阶段二接入后，固定按次模型计算正确。
- 无官方定价时不写 `savings_estimate`。
- 价格源未确认官方来源时不写 `savings_estimate`。
- 实际扣费高于官方定价估算时 `savings_quota=0`，前端不展示节省金额。
- 动态表达式缺少官方定价表达式时跳过。
- 任务类和固定按次类在 MVP 中跳过。
- 模型映射、归一化和通配符匹配会写入正确的 `matched_model`。
- 写入 `schema_version=1` 和 `calculator=text_token_v1`。
- `Other` 中已有字段不被覆盖。
- `Other` 为空、非 JSON、字段缺失或未知 `schema_version` 时聚合跳过且不报错。
- 非管理员日志格式化不剥离 `savings_estimate`，但继续剥离 `admin_info`。
- 汇总接口只返回当前用户的数据。
- 汇总接口使用 `[start_timestamp, end_timestamp)`，相邻窗口不重复统计。
- 查询窗口超过 `max_summary_days` 时返回 400。
- 超过 `max_summary_log_rows` 时返回 `is_partial=true`，且不补推测金额。
- 功能关闭时返回空汇总并由前端隐藏入口。
- 时间范围缺失、非法或超过上限时返回 400。
- 官方来源 URL 只接受 `http`/`https`，敏感 query 参数被剔除或拒绝。
- 官方定价确认、取消确认、批量更新会写入审计动作。
- 官方定价缓存刷新失败时不写入新的用户可见节省估算。
- 官方定价超过过期阈值时返回 `official_price_stale=true`。
- 跳过原因枚举稳定，可被测试断言和管理员调试使用。
- 大数、NaN、Inf 和饱和路径不产生负节省。

新增或大幅重写 Go 测试使用 `require` 做前置和致命断言，使用 `assert` 做值断言。

### 12.2 前端测试

建议测试点：

- 有节省数据时概览展示金额和估算说明。
- 无节省数据时不渲染空占位。
- 覆盖率低于 100% 时展示覆盖率说明。
- `is_partial=true` 时不展示金额并提示缩小时间范围。
- `official_price_stale=true` 时展示官方定价更新时间。
- `savings_quota=0` 时隐藏节省金额。
- 功能关闭、覆盖率为 0 或 `is_partial=true` 时不把金额展示成“节省 0”。
- 日志详情正确展示官方定价估算、实际扣费、节省和来源。
- 长翻译不导致按钮或卡片文本溢出。
- 货币展示跟随现有 quota/currency 配置。

## 13. 验收标准

- 关闭配置后，用户界面完全不出现节省金额。
- 开启配置后，文本类请求能在日志详情看到单次估算节省。
- 用户概览能展示本月估算节省与覆盖率。
- MVP 不展示累计节省，不在钱包页展示节省金额。
- 官方定价变更后，旧日志中的节省金额保持不变。
- 无官方定价或不可安全估算的请求不会产生误导展示。
- 未确认官方来源的价格不会参与节省估算。
- 官方定价确认动作可审计，包含操作者、来源和模型范围。
- 官方来源 URL 不向普通用户泄露敏感 query 或内部地址。
- 官方定价缓存更新后只影响新日志，不回写旧日志。
- 关闭 `enabled` 后停止写入新的节省估算，前端隐藏入口，历史日志不影响账务。
- 超过日志扫描阈值时前端不展示不完整金额。
- 实际扣费、用户余额、订阅扣费、充值到账和退款逻辑无变化。
- SQLite、MySQL、PostgreSQL 下后端测试通过。
- 前端 i18n、类型检查、相关测试和构建通过。

## 14. 设计原则应用

- KISS：第一阶段复用 `logs.other` 和现有价格结构，不新建复杂价格服务。
- YAGNI：先覆盖文本类和用户概览，不提前实现全量任务模型与长期聚合表。
- DRY：官方定价字段与模型广场定价字段对齐，避免维护两套价格 DTO。
- SOLID：节省估算作为独立服务注入日志，不侵入实际计费和扣费路径。

## 15. 推荐结论

建议实现该功能，但按“估算节省”定位上线。MVP 只做日志快照、用户概览和日志详情，先证明用户价值和口径可解释性；等数据量和产品反馈稳定后，再扩展到任务类、管理员分析和模型广场价差展示。

## 16. 遗漏与过当检查

当前方案建议保留的必要项：

- 官方定价确认、来源、更新时间和审计记录，解决“钱从哪里来”的可信度问题。
- 日志写入时固化快照，解决历史价格漂移问题。
- 用户侧短窗口聚合，解决 MVP 性能和日志保留不确定性问题。
- 未确认、无 usage、动态表达式、异步退款链路先跳过，避免误导用户。
- 前端按估算展示并在不完整数据时隐藏金额，降低财务误解风险。

当前方案刻意不做的项：

- 不做自动官网抓价。官方价格页面格式不稳定，维护成本高，MVP 没必要。
- 不做累计节省。没有聚合表前，累计值会受日志保留影响。
- 不做钱包页累计营销。容易被理解成现金返还或付款差额。
- 不把第三方同步源默认视为官方价。否则“官方定价”声明站不住。
- 不把负节省展示给用户。该功能目标是价值感知，不是价格争议提示。

总体判断：该设计没有明显遗漏核心闭环；主要风险已经收敛在官方价格确认、日志快照、查询窗口和展示文案四个点上。若第一阶段再加入任务类、动态表达式或累计金额，就属于过当。
