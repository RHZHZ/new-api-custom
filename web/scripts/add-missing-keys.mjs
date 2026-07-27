import fs from 'node:fs/promises'
import path from 'node:path'

const LOCALES_DIR = path.resolve('src/i18n/locales')

function stableStringify(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`
}

const newKeys = {
  en: {
    'About historical savings estimates': 'About historical savings estimates',
    'Estimated savings': 'Estimated savings',
    'Official price estimate': 'Official price estimate',
    'Cost comparison': 'Cost comparison',
    Coverage: 'Coverage',
    'Covered request actual cost': 'Covered request actual cost',
    'Covered requests': 'Covered requests',
    'Current account cost comparison': 'Current account cost comparison',
    'Current account only': 'Current account only',
    'Converted at 1 USD = {{rate}} CNY': 'Converted at 1 USD = {{rate}} CNY',
    'Historical rebuilds': 'Historical rebuilds',
    'Historical usage is recalculated using current official prices':
      'Historical usage is recalculated using current official prices',
    'No usage records in the selected range':
      'No usage records in the selected range',
    'Savings rate': 'Savings rate',
    'Unable to load savings trend': 'Unable to load savings trend',
    'View savings trend': 'View savings trend',
    Account: 'Account',
    'Account & Security': 'Account & Security',
    'Actual Cost': 'Actual Cost',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.',
    'Choose a supported model and send your first request.':
      'Choose a supported model and send your first request.',
    'Clear usage and balance': 'Clear usage and balance',
    'Configure official pricing snapshots for user savings estimates.':
      'Configure official pricing snapshots for user savings estimates.',
    'Calculate estimated savings using official model prices.':
      'Calculate estimated savings using official model prices.',
    'Confirm marketplace pricing as official':
      'Confirm marketplace pricing as official',
    'Enable savings estimates': 'Enable savings estimates',
    'Estimate historical logs without a saved official price snapshot.':
      'Estimate historical logs without a saved official price snapshot.',
    'Exclude prices that have not been confirmed as official.':
      'Exclude prices that have not been confirmed as official.',
    'Historical estimates': 'Historical estimates',
    'Limit the date range of each savings summary query.':
      'Limit the date range of each savings summary query.',
    'Limit the number of usage logs scanned per summary.':
      'Limit the number of usage logs scanned per summary.',
    'Manage in JSON': 'Manage in JSON',
    'Maximum scanned log rows': 'Maximum scanned log rows',
    'Maximum summary range (days)': 'Maximum summary range (days)',
    'Official price validity (days)': 'Official price validity (days)',
    'Official pricing': 'Official pricing',
    'Price overrides': 'Price overrides',
    'Prices older than this are excluded from savings estimates.':
      'Prices older than this are excluded from savings estimates.',
    'Recalculate legacy usage logs': 'Recalculate legacy usage logs',
    'Require official price confirmation':
      'Require official price confirmation',
    'Show in usage logs': 'Show in usage logs',
    'Show on dashboard': 'Show on dashboard',
    'Show request-level savings estimates in usage logs.':
      'Show request-level savings estimates in usage logs.',
    'Show the savings summary and trend on the user dashboard.':
      'Show the savings summary and trend on the user dashboard.',
    'Treat local model marketplace prices as official reference prices.':
      'Treat local model marketplace prices as official reference prices.',
    '{{count}} model price overrides': '{{count}} model price overrides',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.',
    'Create separate keys for your projects and keep credentials under your control.':
      'Create separate keys for your projects and keep credentials under your control.',
    'Estimated from official pricing': 'Estimated from official pricing',
    'Estimated Savings': 'Estimated Savings',
    'Everything you need to start calling models':
      'Everything you need to start calling models',
    'Hide password': 'Hide password',
    'Matched Model': 'Matched Model',
    'One endpoint, one key, and a clear view of every request.':
      'One endpoint, one key, and a clear view of every request.',
    'Official Price Estimate': 'Official Price Estimate',
    'Official Price Updated': 'Official Price Updated',
    'Official price updated {{time}}': 'Official price updated {{time}}',
    'Official pricing estimate': 'Official pricing estimate',
    'No eligible savings records yet': 'No eligible savings records yet',
    'RAPI saved you about {{amount}}': 'RAPI saved you about {{amount}}',
    'Request completed': 'Request completed',
    'Requests are routed across available services to improve call stability.':
      'Requests are routed across available services to improve call stability.',
    'Save savings estimate settings': 'Save savings estimate settings',
    'Savings estimate': 'Savings estimate',
    'Savings estimate is not enabled': 'Savings estimate is not enabled',
    'Stable model calls': 'Stable model calls',
    'Show password': 'Show password',
    'Signing in...': 'Signing in...',
    'Start calling supported models with RAPI':
      'Start calling supported models with RAPI',
    'Start with the familiar OpenAI-compatible workflow.':
      'Start with the familiar OpenAI-compatible workflow.',
    'Three steps to your first model request':
      'Three steps to your first model request',
    'Too many records to summarize': 'Too many records to summarize',
    'Updated savings official price setting':
      'Updated savings official price setting',
    'Unified model API service': 'Unified model API service',
    'Usage Analysis': 'Usage Analysis',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      'Use one compatible endpoint to access supported models without changing SDKs.',
    'available service channels': 'available service channels',
    'reliability controls': 'reliability controls',
    'supported billing models': 'supported billing models',
    '{{coverage}} coverage': '{{coverage}} coverage',
    '{{count}} historical requests recalculated at current official prices':
      '{{count}} historical requests recalculated at current official prices',
    Workspace: 'Workspace',
  },
  zh: {
    'About historical savings estimates': '关于历史节省估算',
    'Estimated savings': '预计节省',
    'Official price estimate': '官方价格估算',
    'Cost comparison': '成本对比',
    Coverage: '覆盖率',
    'Covered request actual cost': '已覆盖请求的实际成本',
    'Covered requests': '已覆盖请求',
    'Current account cost comparison': '当前账户成本对比',
    'Current account only': '仅当前账户',
    'Converted at 1 USD = {{rate}} CNY': '按 1 美元 = {{rate}} 元人民币换算',
    'Historical rebuilds': '历史回算',
    'Historical usage is recalculated using current official prices':
      '历史用量按当前官方价格重新计算',
    'No usage records in the selected range': '所选时间范围内暂无用量记录',
    'Savings rate': '节省比例',
    'Unable to load savings trend': '无法加载节省趋势',
    'View savings trend': '查看节省趋势',
    Account: '账户',
    'Account & Security': '账户与安全',
    'Actual Cost': '实际花费',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      '通过一个兼容接口接入多种模型服务，使用统一密钥，并在开发到生产的全过程清晰掌握用量、余额与请求。',
    'Choose a supported model and send your first request.':
      '选择支持的模型并发送第一个请求。',
    'Clear usage and balance': '用量与余额清晰可见',
    'Configure official pricing snapshots for user savings estimates.':
      '配置用于用户节省估算的官方定价快照。',
    'Calculate estimated savings using official model prices.':
      '根据模型官方定价计算预计节省金额。',
    'Confirm marketplace pricing as official': '确认模型广场定价为官方价格',
    'Enable savings estimates': '启用节省估算',
    'Estimate historical logs without a saved official price snapshot.':
      '估算未保存官方价格快照的历史日志。',
    'Exclude prices that have not been confirmed as official.':
      '排除尚未确认为官方价格的定价。',
    'Historical estimates': '历史估算',
    'Limit the date range of each savings summary query.':
      '限制单次节省汇总查询的日期范围。',
    'Limit the number of usage logs scanned per summary.':
      '限制单次汇总扫描的使用日志数量。',
    'Manage in JSON': '在 JSON 中管理',
    'Maximum scanned log rows': '最大扫描日志数',
    'Maximum summary range (days)': '最大汇总范围（天）',
    'Official price validity (days)': '官方价格有效期（天）',
    'Official pricing': '官方定价',
    'Price overrides': '价格覆盖',
    'Prices older than this are excluded from savings estimates.':
      '超过该天数的价格不参与节省估算。',
    'Recalculate legacy usage logs': '回算历史使用日志',
    'Require official price confirmation': '要求确认官方价格',
    'Show in usage logs': '在使用日志中显示',
    'Show on dashboard': '在仪表盘显示',
    'Show request-level savings estimates in usage logs.':
      '在使用日志中显示每次请求的节省估算。',
    'Show the savings summary and trend on the user dashboard.':
      '在用户仪表盘中显示节省汇总和趋势。',
    'Treat local model marketplace prices as official reference prices.':
      '将本地模型广场价格视为官方参考价格。',
    '{{count}} model price overrides': '{{count}} 个模型价格覆盖',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      '默认使用模型广场中的本地官方定价；official_prices 仅用于覆盖例外模型。',
    'Create separate keys for your projects and keep credentials under your control.':
      '为不同项目创建独立密钥，凭据始终由你掌控。',
    'Estimated from official pricing': '基于官方定价估算',
    'Estimated Savings': '预计节省',
    'Everything you need to start calling models': '调用模型所需的一切',
    'Hide password': '隐藏密码',
    'Matched Model': '匹配模型',
    'One endpoint, one key, and a clear view of every request.':
      '一个接口、一枚密钥，每次请求都清晰可见。',
    'Official Price Estimate': '官方价格估算',
    'Official Price Updated': '官方价格更新时间',
    'Official price updated {{time}}': '官方价格更新于 {{time}}',
    'Official pricing estimate': '官方定价估算',
    'No eligible savings records yet': '暂无可估算的节省记录',
    'RAPI saved you about {{amount}}': 'RAPI 已帮你节省约 {{amount}}',
    'Request completed': '请求已完成',
    'Requests are routed across available services to improve call stability.':
      '请求会在可用服务间自动路由，提升调用稳定性。',
    'Save savings estimate settings': '保存节省估算设置',
    'Savings estimate': '节省估算',
    'Savings estimate is not enabled': '节省估算未开启',
    'Stable model calls': '模型调用更稳定',
    'Show password': '显示密码',
    'Signing in...': '登录中...',
    'Start calling supported models with RAPI': '使用 RAPI 调用支持的模型',
    'Start with the familiar OpenAI-compatible workflow.':
      '沿用熟悉的 OpenAI 兼容方式快速开始。',
    'Three steps to your first model request': '三步完成首次模型请求',
    'Too many records to summarize': '记录过多，暂无法汇总',
    'Updated savings official price setting': '已更新节省估算官方价格设置',
    'Unified model API service': '统一模型接口服务',
    'Usage Analysis': '用量分析',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      '通过一个兼容接口访问支持的模型，无需更换现有 SDK。',
    'available service channels': '可用服务渠道',
    'reliability controls': '稳定性保障能力',
    'supported billing models': '支持的计费模型',
    '{{coverage}} coverage': '覆盖率 {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      '含 {{count}} 条按当前官方价回算的历史请求',
    Workspace: '工作区',
  },
  'zh-TW': {
    'About historical savings estimates': '關於歷史節省估算',
    'Estimated savings': '預估節省',
    'Official price estimate': '官方價格估算',
    'Cost comparison': '成本比較',
    Coverage: '覆蓋率',
    'Covered request actual cost': '已覆蓋請求的實際成本',
    'Covered requests': '已覆蓋請求',
    'Current account cost comparison': '目前帳戶成本比較',
    'Current account only': '僅目前帳戶',
    'Converted at 1 USD = {{rate}} CNY': '按 1 美元 = {{rate}} 元人民幣換算',
    'Historical rebuilds': '歷史回算',
    'Historical usage is recalculated using current official prices':
      '歷史用量按目前官方價格重新計算',
    'No usage records in the selected range': '所選時間範圍內暫無用量記錄',
    'Savings rate': '節省比例',
    'Unable to load savings trend': '無法載入節省趨勢',
    'View savings trend': '查看節省趨勢',
    Account: '帳戶',
    'Account & Security': '帳戶與安全',
    'Actual Cost': '實際花費',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      '透過一個相容介面接入多種模型服務，使用統一金鑰，並在開發到正式環境的全程清楚掌握用量、餘額與請求。',
    'Choose a supported model and send your first request.':
      '選擇支援的模型並送出第一個請求。',
    'Clear usage and balance': '用量與餘額清楚可見',
    'Configure official pricing snapshots for user savings estimates.':
      '設定用於使用者節省估算的官方定價快照。',
    'Calculate estimated savings using official model prices.':
      '根據模型官方定價計算預估節省金額。',
    'Confirm marketplace pricing as official': '確認模型廣場定價為官方價格',
    'Enable savings estimates': '啟用節省估算',
    'Estimate historical logs without a saved official price snapshot.':
      '估算未儲存官方價格快照的歷史日誌。',
    'Exclude prices that have not been confirmed as official.':
      '排除尚未確認為官方價格的定價。',
    'Historical estimates': '歷史估算',
    'Limit the date range of each savings summary query.':
      '限制單次節省彙總查詢的日期範圍。',
    'Limit the number of usage logs scanned per summary.':
      '限制單次彙總掃描的使用日誌數量。',
    'Manage in JSON': '在 JSON 中管理',
    'Maximum scanned log rows': '最大掃描日誌數',
    'Maximum summary range (days)': '最大彙總範圍（天）',
    'Official price validity (days)': '官方價格有效期（天）',
    'Official pricing': '官方定價',
    'Price overrides': '價格覆寫',
    'Prices older than this are excluded from savings estimates.':
      '超過該天數的價格不參與節省估算。',
    'Recalculate legacy usage logs': '回算歷史使用日誌',
    'Require official price confirmation': '要求確認官方價格',
    'Show in usage logs': '在使用日誌中顯示',
    'Show on dashboard': '在儀表板顯示',
    'Show request-level savings estimates in usage logs.':
      '在使用日誌中顯示每次請求的節省估算。',
    'Show the savings summary and trend on the user dashboard.':
      '在使用者儀表板中顯示節省彙總和趨勢。',
    'Treat local model marketplace prices as official reference prices.':
      '將本機模型廣場價格視為官方參考價格。',
    '{{count}} model price overrides': '{{count}} 個模型價格覆寫',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      '預設使用模型廣場中的本機官方定價；official_prices 僅用於覆寫例外模型。',
    'Create separate keys for your projects and keep credentials under your control.':
      '為不同專案建立獨立金鑰，憑證始終由你掌控。',
    'Estimated from official pricing': '基於官方定價估算',
    'Estimated Savings': '預估節省',
    'Everything you need to start calling models': '呼叫模型所需的一切',
    'Hide password': '隱藏密碼',
    'Matched Model': '匹配模型',
    'One endpoint, one key, and a clear view of every request.':
      '一個介面、一枚金鑰，每次請求都清楚可見。',
    'Official Price Estimate': '官方價格估算',
    'Official Price Updated': '官方價格更新時間',
    'Official price updated {{time}}': '官方價格更新於 {{time}}',
    'Official pricing estimate': '官方定價估算',
    'No eligible savings records yet': '暫無可估算的節省記錄',
    'RAPI saved you about {{amount}}': 'RAPI 已幫你節省約 {{amount}}',
    'Request completed': '請求已完成',
    'Requests are routed across available services to improve call stability.':
      '請求會在可用服務間自動路由，提升呼叫穩定性。',
    'Save savings estimate settings': '儲存節省估算設定',
    'Savings estimate': '節省估算',
    'Savings estimate is not enabled': '節省估算未啟用',
    'Stable model calls': '模型呼叫更穩定',
    'Show password': '顯示密碼',
    'Signing in...': '登入中...',
    'Start calling supported models with RAPI': '使用 RAPI 呼叫支援的模型',
    'Start with the familiar OpenAI-compatible workflow.':
      '沿用熟悉的 OpenAI 相容方式快速開始。',
    'Three steps to your first model request': '三步完成首次模型請求',
    'Too many records to summarize': '記錄過多，暫時無法彙總',
    'Updated savings official price setting': '已更新節省估算官方價格設定',
    'Unified model API service': '統一模型介面服務',
    'Usage Analysis': '用量分析',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      '透過一個相容介面存取支援的模型，無需更換現有 SDK。',
    'available service channels': '可用服務渠道',
    'reliability controls': '穩定性保障能力',
    'supported billing models': '支援的計費模型',
    '{{coverage}} coverage': '覆蓋率 {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      '已按目前官方定價回算 {{count}} 筆歷史請求',
    Workspace: '工作區',
  },
  fr: {
    'About historical savings estimates':
      "À propos de l'estimation des économies historiques",
    'Estimated savings': 'Économies estimées',
    'Official price estimate': 'Estimation au tarif officiel',
    'Cost comparison': 'Comparaison des coûts',
    Coverage: 'Couverture',
    'Covered request actual cost': 'Coût réel des requêtes couvertes',
    'Covered requests': 'Requêtes couvertes',
    'Current account cost comparison': 'Coûts du compte actuel',
    'Current account only': 'Compte actuel uniquement',
    'Converted at 1 USD = {{rate}} CNY': 'Conversion : 1 USD = {{rate}} CNY',
    'Historical rebuilds': 'Recalculs historiques',
    'Historical usage is recalculated using current official prices':
      "L'usage historique est recalculé selon les tarifs officiels actuels",
    'No usage records in the selected range':
      "Aucune donnée d'usage sur la période sélectionnée",
    'Savings rate': "Taux d'économie",
    'Unable to load savings trend':
      'Impossible de charger la tendance des économies',
    'View savings trend': 'Voir la tendance des économies',
    Account: 'Compte',
    'Account & Security': 'Compte et sécurité',
    'Actual Cost': 'Coût réel',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      "Accédez à plusieurs services de modèles via une API compatible. Utilisez une clé unique et suivez clairement l'usage, le solde et les requêtes, du développement à la production.",
    'Choose a supported model and send your first request.':
      'Choisissez un modèle pris en charge et envoyez votre première requête.',
    'Clear usage and balance': 'Usage et solde transparents',
    'Configure official pricing snapshots for user savings estimates.':
      "Configurez les instantanés de tarifs officiels pour l'estimation des économies utilisateur.",
    'Calculate estimated savings using official model prices.':
      'Calculez les économies estimées à partir des tarifs officiels des modèles.',
    'Confirm marketplace pricing as official':
      'Confirmer les tarifs de la place de marché comme officiels',
    'Enable savings estimates': "Activer l'estimation des économies",
    'Estimate historical logs without a saved official price snapshot.':
      'Estimez les journaux historiques sans instantané de tarif officiel enregistré.',
    'Exclude prices that have not been confirmed as official.':
      "Excluez les tarifs qui n'ont pas été confirmés comme officiels.",
    'Historical estimates': 'Estimations historiques',
    'Limit the date range of each savings summary query.':
      'Limitez la période de chaque requête de synthèse des économies.',
    'Limit the number of usage logs scanned per summary.':
      "Limitez le nombre de journaux d'usage analysés par synthèse.",
    'Manage in JSON': 'Gérer en JSON',
    'Maximum scanned log rows': 'Nombre maximal de journaux analysés',
    'Maximum summary range (days)': 'Période maximale de synthèse (jours)',
    'Official price validity (days)': 'Validité du tarif officiel (jours)',
    'Official pricing': 'Tarification officielle',
    'Price overrides': 'Remplacements de tarifs',
    'Prices older than this are excluded from savings estimates.':
      "Les tarifs plus anciens sont exclus de l'estimation des économies.",
    'Recalculate legacy usage logs': "Recalculer les anciens journaux d'usage",
    'Require official price confirmation':
      'Exiger la confirmation du tarif officiel',
    'Show in usage logs': "Afficher dans les journaux d'usage",
    'Show on dashboard': 'Afficher sur le tableau de bord',
    'Show request-level savings estimates in usage logs.':
      "Affichez l'estimation des économies par requête dans les journaux d'usage.",
    'Show the savings summary and trend on the user dashboard.':
      'Affichez la synthèse et la tendance des économies sur le tableau de bord utilisateur.',
    'Treat local model marketplace prices as official reference prices.':
      'Considérez les tarifs locaux de la place de marché comme tarifs officiels de référence.',
    '{{count}} model price overrides':
      '{{count}} remplacements de tarifs de modèle',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      'Utilise par défaut les tarifs officiels locaux de la place de marché des modèles ; official_prices sert uniquement aux exceptions.',
    'Create separate keys for your projects and keep credentials under your control.':
      'Créez une clé par projet et gardez le contrôle de vos identifiants.',
    'Estimated from official pricing': 'Estimé à partir des tarifs officiels',
    'Estimated Savings': 'Économies estimées',
    'Everything you need to start calling models':
      'Tout pour commencer à appeler des modèles',
    'Hide password': 'Masquer le mot de passe',
    'Matched Model': 'Modèle correspondant',
    'One endpoint, one key, and a clear view of every request.':
      'Un endpoint, une clé et une vue claire de chaque requête.',
    'Official Price Estimate': 'Estimation au tarif officiel',
    'Official Price Updated': 'Tarif officiel mis à jour',
    'Official price updated {{time}}': 'Tarif officiel mis à jour le {{time}}',
    'Official pricing estimate': 'Estimation des tarifs officiels',
    'No eligible savings records yet':
      "Aucun enregistrement d'économies éligible pour le moment",
    'RAPI saved you about {{amount}}':
      'RAPI vous a fait économiser environ {{amount}}',
    'Request completed': 'Requête terminée',
    'Requests are routed across available services to improve call stability.':
      'Les requêtes sont acheminées entre les services disponibles pour améliorer la stabilité.',
    'Save savings estimate settings':
      "Enregistrer les paramètres d'économies estimées",
    'Savings estimate': 'Économies estimées',
    'Savings estimate is not enabled':
      "L'estimation des économies n'est pas activée",
    'Stable model calls': 'Appels de modèles stables',
    'Show password': 'Afficher le mot de passe',
    'Signing in...': 'Connexion...',
    'Start calling supported models with RAPI':
      'Appelez les modèles pris en charge avec RAPI',
    'Start with the familiar OpenAI-compatible workflow.':
      'Démarrez avec le flux familier compatible OpenAI.',
    'Three steps to your first model request':
      'Trois étapes vers votre première requête de modèle',
    'Too many records to summarize': "Trop d'enregistrements à résumer",
    'Updated savings official price setting':
      "Configuration des tarifs officiels d'économies mise à jour",
    'Unified model API service': "Service d'API de modèles unifié",
    'Usage Analysis': 'Analyse d’utilisation',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      'Accédez aux modèles pris en charge via un endpoint compatible, sans changer de SDK.',
    'available service channels': 'canaux de service disponibles',
    'reliability controls': 'mécanismes de fiabilité',
    'supported billing models': 'modèles de facturation pris en charge',
    '{{coverage}} coverage': 'Couverture {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      '{{count}} requêtes historiques recalculées aux tarifs officiels actuels',
    Workspace: 'Espace de travail',
  },
  ja: {
    'About historical savings estimates': '過去の節約見積もりについて',
    'Estimated savings': '推定節約額',
    'Official price estimate': '公式価格の見積もり',
    'Cost comparison': 'コスト比較',
    Coverage: 'カバー率',
    'Covered request actual cost': '対象リクエストの実コスト',
    'Covered requests': '対象リクエスト',
    'Current account cost comparison': '現在のアカウントのコスト比較',
    'Current account only': '現在のアカウントのみ',
    'Converted at 1 USD = {{rate}} CNY': '1 USD = {{rate}} CNY で換算',
    'Historical rebuilds': '過去データの再計算',
    'Historical usage is recalculated using current official prices':
      '過去の使用量は現在の公式価格で再計算されます',
    'No usage records in the selected range':
      '選択した期間に使用記録はありません',
    'Savings rate': '節約率',
    'Unable to load savings trend': '節約推移を読み込めません',
    'View savings trend': '節約推移を表示',
    Account: 'アカウント',
    'Account & Security': 'アカウントとセキュリティ',
    'Actual Cost': '実際のコスト',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      '1つの互換APIから複数のモデルサービスに接続。共通キーで、開発から本番まで利用量・残高・リクエストを明確に把握できます。',
    'Choose a supported model and send your first request.':
      '対応モデルを選び、最初のリクエストを送信します。',
    'Clear usage and balance': '利用量と残高を明確に把握',
    'Configure official pricing snapshots for user savings estimates.':
      'ユーザーの節約見積もりに使う公式価格スナップショットを設定します。',
    'Calculate estimated savings using official model prices.':
      'モデルの公式価格を使用して推定節約額を計算します。',
    'Confirm marketplace pricing as official':
      'モデル広場の価格を公式として確認',
    'Enable savings estimates': '節約見積もりを有効化',
    'Estimate historical logs without a saved official price snapshot.':
      '保存済みの公式価格スナップショットがない過去ログを見積もります。',
    'Exclude prices that have not been confirmed as official.':
      '公式として確認されていない価格を除外します。',
    'Historical estimates': '過去データの見積もり',
    'Limit the date range of each savings summary query.':
      '節約サマリーの各クエリの日付範囲を制限します。',
    'Limit the number of usage logs scanned per summary.':
      'サマリーごとに走査する使用ログ数を制限します。',
    'Manage in JSON': 'JSON で管理',
    'Maximum scanned log rows': '走査するログの最大行数',
    'Maximum summary range (days)': 'サマリーの最大期間（日）',
    'Official price validity (days)': '公式価格の有効期間（日）',
    'Official pricing': '公式価格',
    'Price overrides': '価格の上書き',
    'Prices older than this are excluded from savings estimates.':
      'この日数より古い価格は節約見積もりから除外されます。',
    'Recalculate legacy usage logs': '過去の使用ログを再計算',
    'Require official price confirmation': '公式価格の確認を必須にする',
    'Show in usage logs': '使用ログに表示',
    'Show on dashboard': 'ダッシュボードに表示',
    'Show request-level savings estimates in usage logs.':
      '使用ログにリクエスト単位の節約見積もりを表示します。',
    'Show the savings summary and trend on the user dashboard.':
      'ユーザーダッシュボードに節約のサマリーと推移を表示します。',
    'Treat local model marketplace prices as official reference prices.':
      'ローカルのモデル広場の価格を公式の参照価格として扱います。',
    '{{count}} model price overrides': 'モデル価格の上書き {{count}} 件',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      'モデル広場のローカル公式価格をデフォルトで使用します。official_prices は例外の上書きにのみ必要です。',
    'Create separate keys for your projects and keep credentials under your control.':
      'プロジェクトごとにキーを作成し、認証情報を自分で管理できます。',
    'Estimated from official pricing': '公式価格から推定',
    'Estimated Savings': '推定節約額',
    'Everything you need to start calling models':
      'モデル利用を始めるために必要なすべて',
    'Hide password': 'パスワードを非表示',
    'Matched Model': '一致モデル',
    'One endpoint, one key, and a clear view of every request.':
      '1つのエンドポイント、1つのキーで、すべてのリクエストを明確に確認。',
    'Official Price Estimate': '公式価格の見積もり',
    'Official Price Updated': '公式価格の更新日時',
    'Official price updated {{time}}': '公式価格更新: {{time}}',
    'Official pricing estimate': '公式価格見積もり',
    'No eligible savings records yet': '対象となる節約記録はまだありません',
    'RAPI saved you about {{amount}}': 'RAPI が約 {{amount}} 節約しました',
    'Request completed': 'リクエスト完了',
    'Requests are routed across available services to improve call stability.':
      '利用可能なサービスへ自動ルーティングし、呼び出しの安定性を高めます。',
    'Save savings estimate settings': '節約見積もり設定を保存',
    'Savings estimate': '節約見積もり',
    'Savings estimate is not enabled': '節約見積もりは有効化されていません',
    'Stable model calls': '安定したモデル呼び出し',
    'Show password': 'パスワードを表示',
    'Signing in...': 'ログイン中...',
    'Start calling supported models with RAPI': 'RAPIで対応モデルを呼び出す',
    'Start with the familiar OpenAI-compatible workflow.':
      '使い慣れたOpenAI互換の手順ですぐに開始できます。',
    'Three steps to your first model request':
      '最初のモデルリクエストまで3ステップ',
    'Too many records to summarize': '記録が多すぎるため集計できません',
    'Updated savings official price setting':
      '節約用の公式価格設定を更新しました',
    'Unified model API service': '統合モデルAPIサービス',
    'Usage Analysis': '使用状況分析',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      '既存SDKを変えずに、1つの互換エンドポイントから対応モデルへアクセスできます。',
    'available service channels': '利用可能なサービスチャネル',
    'reliability controls': '安定性制御',
    'supported billing models': '対応する課金モデル',
    '{{coverage}} coverage': 'カバー率 {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      '過去の {{count}} 件のリクエストを現在の公式価格で再計算',
    Workspace: 'ワークスペース',
  },
  ru: {
    'About historical savings estimates':
      'Об оценке экономии за прошлые периоды',
    'Estimated savings': 'Расчётная экономия',
    'Official price estimate': 'Оценка по официальной цене',
    'Cost comparison': 'Сравнение затрат',
    Coverage: 'Покрытие',
    'Covered request actual cost': 'Фактическая стоимость учтённых запросов',
    'Covered requests': 'Учтённые запросы',
    'Current account cost comparison': 'Сравнение затрат текущего аккаунта',
    'Current account only': 'Только текущий аккаунт',
    'Converted at 1 USD = {{rate}} CNY':
      'Пересчёт по курсу 1 USD = {{rate}} CNY',
    'Historical rebuilds': 'Пересчёты истории',
    'Historical usage is recalculated using current official prices':
      'Прошлое использование пересчитано по текущим официальным ценам',
    'No usage records in the selected range':
      'За выбранный период нет данных об использовании',
    'Savings rate': 'Доля экономии',
    'Unable to load savings trend': 'Не удалось загрузить динамику экономии',
    'View savings trend': 'Показать динамику экономии',
    Account: 'Учётная запись',
    'Account & Security': 'Учётная запись и безопасность',
    'Actual Cost': 'Фактическая стоимость',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      'Подключайтесь к разным модельным сервисам через один совместимый API. Используйте единый ключ и контролируйте расход, баланс и запросы от разработки до продакшена.',
    'Choose a supported model and send your first request.':
      'Выберите поддерживаемую модель и отправьте первый запрос.',
    'Clear usage and balance': 'Прозрачные расход и баланс',
    'Configure official pricing snapshots for user savings estimates.':
      'Настройте официальные ценовые снимки для оценки экономии пользователей.',
    'Calculate estimated savings using official model prices.':
      'Рассчитывать экономию по официальным ценам моделей.',
    'Confirm marketplace pricing as official':
      'Подтвердить цены каталога как официальные',
    'Enable savings estimates': 'Включить оценку экономии',
    'Estimate historical logs without a saved official price snapshot.':
      'Оценивать исторические журналы без сохранённого снимка официальных цен.',
    'Exclude prices that have not been confirmed as official.':
      'Исключать цены, которые не были подтверждены как официальные.',
    'Historical estimates': 'Исторические оценки',
    'Limit the date range of each savings summary query.':
      'Ограничить диапазон дат каждого запроса сводки экономии.',
    'Limit the number of usage logs scanned per summary.':
      'Ограничить число журналов использования, проверяемых для одной сводки.',
    'Manage in JSON': 'Управлять в JSON',
    'Maximum scanned log rows': 'Максимум проверяемых строк журнала',
    'Maximum summary range (days)': 'Максимальный период сводки (дни)',
    'Official price validity (days)': 'Срок действия официальной цены (дни)',
    'Official pricing': 'Официальные цены',
    'Price overrides': 'Переопределения цен',
    'Prices older than this are excluded from savings estimates.':
      'Более старые цены исключаются из расчёта экономии.',
    'Recalculate legacy usage logs':
      'Пересчитывать старые журналы использования',
    'Require official price confirmation':
      'Требовать подтверждения официальной цены',
    'Show in usage logs': 'Показывать в журналах использования',
    'Show on dashboard': 'Показывать на панели',
    'Show request-level savings estimates in usage logs.':
      'Показывать оценку экономии для каждого запроса в журналах использования.',
    'Show the savings summary and trend on the user dashboard.':
      'Показывать сводку и динамику экономии на панели пользователя.',
    'Treat local model marketplace prices as official reference prices.':
      'Считать локальные цены каталога моделей официальными справочными ценами.',
    '{{count}} model price overrides': 'Переопределений цен моделей: {{count}}',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      'По умолчанию используются локальные официальные цены из каталога моделей; official_prices нужен только для исключений.',
    'Create separate keys for your projects and keep credentials under your control.':
      'Создавайте отдельные ключи для проектов и сохраняйте контроль над учетными данными.',
    'Estimated from official pricing': 'Оценено по официальным тарифам',
    'Estimated Savings': 'Расчетная экономия',
    'Everything you need to start calling models':
      'Все необходимое для начала работы с моделями',
    'Hide password': 'Скрыть пароль',
    'Matched Model': 'Сопоставленная модель',
    'One endpoint, one key, and a clear view of every request.':
      'Один endpoint, один ключ и полная видимость каждого запроса.',
    'Official Price Estimate': 'Оценка по официальной цене',
    'Official Price Updated': 'Официальная цена обновлена',
    'Official price updated {{time}}': 'Официальная цена обновлена {{time}}',
    'Official pricing estimate': 'Оценка по официальным тарифам',
    'No eligible savings records yet':
      'Пока нет подходящих записей об экономии',
    'RAPI saved you about {{amount}}': 'RAPI сэкономил вам около {{amount}}',
    'Request completed': 'Запрос выполнен',
    'Requests are routed across available services to improve call stability.':
      'Запросы распределяются между доступными сервисами для повышения стабильности.',
    'Save savings estimate settings': 'Сохранить настройки оценки экономии',
    'Savings estimate': 'Оценка экономии',
    'Savings estimate is not enabled': 'Оценка экономии не включена',
    'Stable model calls': 'Стабильные вызовы моделей',
    'Show password': 'Показать пароль',
    'Signing in...': 'Выполняется вход...',
    'Start calling supported models with RAPI':
      'Начните вызывать поддерживаемые модели через RAPI',
    'Start with the familiar OpenAI-compatible workflow.':
      'Начните со знакомого OpenAI-совместимого процесса.',
    'Three steps to your first model request':
      'Три шага до первого запроса к модели',
    'Too many records to summarize': 'Слишком много записей для сводки',
    'Updated savings official price setting':
      'Настройка официальных цен для экономии обновлена',
    'Unified model API service': 'Единый сервис API моделей',
    'Usage Analysis': 'Анализ использования',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      'Получайте доступ к поддерживаемым моделям через один совместимый endpoint без замены SDK.',
    'available service channels': 'доступных каналов сервиса',
    'reliability controls': 'механизмов надежности',
    'supported billing models': 'поддерживаемых моделей оплаты',
    '{{coverage}} coverage': 'Покрытие {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      '{{count}} исторических запросов пересчитано по текущим официальным ценам',
    Workspace: 'Рабочая область',
  },
  vi: {
    'About historical savings estimates': 'Về ước tính tiết kiệm trong quá khứ',
    'Estimated savings': 'Khoản tiết kiệm ước tính',
    'Official price estimate': 'Ước tính theo giá chính thức',
    'Cost comparison': 'So sánh chi phí',
    Coverage: 'Mức bao phủ',
    'Covered request actual cost': 'Chi phí thực tế của yêu cầu được tính',
    'Covered requests': 'Yêu cầu được tính',
    'Current account cost comparison': 'So sánh chi phí tài khoản hiện tại',
    'Current account only': 'Chỉ tài khoản hiện tại',
    'Converted at 1 USD = {{rate}} CNY': 'Quy đổi theo 1 USD = {{rate}} CNY',
    'Historical rebuilds': 'Lần tính lại dữ liệu cũ',
    'Historical usage is recalculated using current official prices':
      'Mức sử dụng trước đây được tính lại theo giá chính thức hiện tại',
    'No usage records in the selected range':
      'Không có dữ liệu sử dụng trong khoảng đã chọn',
    'Savings rate': 'Tỷ lệ tiết kiệm',
    'Unable to load savings trend': 'Không thể tải xu hướng tiết kiệm',
    'View savings trend': 'Xem xu hướng tiết kiệm',
    Account: 'Tài khoản',
    'Account & Security': 'Tài khoản và bảo mật',
    'Actual Cost': 'Chi phí thực tế',
    'Access multiple model services through one compatible API. Use a single key and keep usage, balance, and requests clear from development to production.':
      'Truy cập nhiều dịch vụ mô hình qua một API tương thích. Dùng một khóa duy nhất và theo dõi rõ mức sử dụng, số dư cùng yêu cầu từ phát triển đến vận hành.',
    'Choose a supported model and send your first request.':
      'Chọn một mô hình được hỗ trợ và gửi yêu cầu đầu tiên.',
    'Clear usage and balance': 'Mức sử dụng và số dư minh bạch',
    'Configure official pricing snapshots for user savings estimates.':
      'Cấu hình bản chụp giá chính thức dùng cho ước tính tiết kiệm của người dùng.',
    'Calculate estimated savings using official model prices.':
      'Tính khoản tiết kiệm ước tính theo giá chính thức của mô hình.',
    'Confirm marketplace pricing as official':
      'Xác nhận giá trong kho mô hình là giá chính thức',
    'Enable savings estimates': 'Bật ước tính tiết kiệm',
    'Estimate historical logs without a saved official price snapshot.':
      'Ước tính nhật ký cũ chưa lưu bản chụp giá chính thức.',
    'Exclude prices that have not been confirmed as official.':
      'Loại trừ giá chưa được xác nhận là chính thức.',
    'Historical estimates': 'Ước tính dữ liệu cũ',
    'Limit the date range of each savings summary query.':
      'Giới hạn khoảng ngày cho mỗi truy vấn tổng hợp tiết kiệm.',
    'Limit the number of usage logs scanned per summary.':
      'Giới hạn số nhật ký sử dụng được quét cho mỗi bản tổng hợp.',
    'Manage in JSON': 'Quản lý bằng JSON',
    'Maximum scanned log rows': 'Số dòng nhật ký quét tối đa',
    'Maximum summary range (days)': 'Khoảng tổng hợp tối đa (ngày)',
    'Official price validity (days)': 'Thời hạn giá chính thức (ngày)',
    'Official pricing': 'Giá chính thức',
    'Price overrides': 'Giá ghi đè',
    'Prices older than this are excluded from savings estimates.':
      'Giá cũ hơn thời hạn này sẽ bị loại khỏi ước tính tiết kiệm.',
    'Recalculate legacy usage logs': 'Tính lại nhật ký sử dụng cũ',
    'Require official price confirmation': 'Yêu cầu xác nhận giá chính thức',
    'Show in usage logs': 'Hiển thị trong nhật ký sử dụng',
    'Show on dashboard': 'Hiển thị trên bảng điều khiển',
    'Show request-level savings estimates in usage logs.':
      'Hiển thị ước tính tiết kiệm theo từng yêu cầu trong nhật ký sử dụng.',
    'Show the savings summary and trend on the user dashboard.':
      'Hiển thị tổng hợp và xu hướng tiết kiệm trên bảng điều khiển người dùng.',
    'Treat local model marketplace prices as official reference prices.':
      'Xem giá cục bộ trong kho mô hình là giá tham chiếu chính thức.',
    '{{count}} model price overrides': '{{count}} giá mô hình ghi đè',
    'Uses local official pricing from the model marketplace by default; official_prices is only needed for overrides.':
      'Mặc định dùng giá chính thức cục bộ từ kho mô hình; official_prices chỉ cần để ghi đè ngoại lệ.',
    'Create separate keys for your projects and keep credentials under your control.':
      'Tạo khóa riêng cho từng dự án và luôn kiểm soát thông tin xác thực.',
    'Estimated from official pricing': 'Ước tính theo giá chính thức',
    'Estimated Savings': 'Khoản tiết kiệm ước tính',
    'Everything you need to start calling models':
      'Mọi thứ cần thiết để bắt đầu gọi mô hình',
    'Hide password': 'Ẩn mật khẩu',
    'Matched Model': 'Mô hình khớp',
    'One endpoint, one key, and a clear view of every request.':
      'Một endpoint, một khóa và toàn bộ yêu cầu đều rõ ràng.',
    'Official Price Estimate': 'Ước tính theo giá chính thức',
    'Official Price Updated': 'Cập nhật giá chính thức',
    'Official price updated {{time}}': 'Giá chính thức cập nhật {{time}}',
    'Official pricing estimate': 'Ước tính giá chính thức',
    'No eligible savings records yet': 'Chưa có bản ghi tiết kiệm đủ điều kiện',
    'RAPI saved you about {{amount}}':
      'RAPI đã giúp bạn tiết kiệm khoảng {{amount}}',
    'Request completed': 'Yêu cầu đã hoàn tất',
    'Requests are routed across available services to improve call stability.':
      'Yêu cầu được định tuyến qua các dịch vụ khả dụng để tăng độ ổn định.',
    'Save savings estimate settings': 'Lưu cấu hình ước tính tiết kiệm',
    'Savings estimate': 'Ước tính tiết kiệm',
    'Savings estimate is not enabled': 'Ước tính tiết kiệm chưa được bật',
    'Stable model calls': 'Lệnh gọi mô hình ổn định',
    'Show password': 'Hiện mật khẩu',
    'Signing in...': 'Đang đăng nhập...',
    'Start calling supported models with RAPI':
      'Bắt đầu gọi các mô hình được hỗ trợ bằng RAPI',
    'Start with the familiar OpenAI-compatible workflow.':
      'Bắt đầu với quy trình tương thích OpenAI quen thuộc.',
    'Three steps to your first model request':
      'Ba bước tới yêu cầu mô hình đầu tiên',
    'Too many records to summarize': 'Quá nhiều bản ghi để tổng hợp',
    'Updated savings official price setting':
      'Đã cập nhật cấu hình giá chính thức cho ước tính tiết kiệm',
    'Unified model API service': 'Dịch vụ API mô hình hợp nhất',
    'Usage Analysis': 'Phân tích mức sử dụng',
    'Use one compatible endpoint to access supported models without changing SDKs.':
      'Truy cập các mô hình được hỗ trợ qua một endpoint tương thích mà không cần đổi SDK.',
    'available service channels': 'kênh dịch vụ khả dụng',
    'reliability controls': 'cơ chế đảm bảo ổn định',
    'supported billing models': 'mô hình tính phí được hỗ trợ',
    '{{coverage}} coverage': 'Mức bao phủ {{coverage}}',
    '{{count}} historical requests recalculated at current official prices':
      'Đã tính lại {{count}} yêu cầu cũ theo giá chính thức hiện tại',
    Workspace: 'Không gian làm việc',
  },
}

async function main() {
  let totalAdded = 0

  for (const [locale, trans] of Object.entries(newKeys)) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`)
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'))

    let count = 0
    for (const [key, value] of Object.entries(trans)) {
      if (!Object.hasOwn(json.translation, key)) {
        json.translation[key] = value
        count++
      } else if (json.translation[key] !== value) {
        json.translation[key] = value
        count++
      }
    }

    const sortedTranslation = Object.fromEntries(
      Object.entries(json.translation).sort(([a], [b]) => a.localeCompare(b))
    )
    const orderChanged =
      Object.keys(json.translation).join('\n') !==
      Object.keys(sortedTranslation).join('\n')

    if (count > 0 || orderChanged) {
      json.translation = sortedTranslation
      await fs.writeFile(filePath, stableStringify(json), 'utf8')
    }

    console.log(`${locale}: ${count} translations applied`)
    totalAdded += count
  }

  console.log(`\nTotal: ${totalAdded} translations applied`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
