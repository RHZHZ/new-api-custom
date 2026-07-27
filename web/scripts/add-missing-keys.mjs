import fs from 'node:fs/promises'
import path from 'node:path'

const LOCALES_DIR = path.resolve('src/i18n/locales')

function stableStringify(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`
}

const newKeys = {
  en: {
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
    Workspace: 'Workspace',
  },
  zh: {
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
    Workspace: '工作区',
  },
  'zh-TW': {
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
    Workspace: '工作區',
  },
  fr: {
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
    'Too many records to summarize':
      "Trop d'enregistrements à résumer",
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
    Workspace: 'Espace de travail',
  },
  ja: {
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
    Workspace: 'ワークスペース',
  },
  ru: {
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
    'RAPI saved you about {{amount}}':
      'RAPI сэкономил вам около {{amount}}',
    'Request completed': 'Запрос выполнен',
    'Requests are routed across available services to improve call stability.':
      'Запросы распределяются между доступными сервисами для повышения стабильности.',
    'Save savings estimate settings':
      'Сохранить настройки оценки экономии',
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
    'Too many records to summarize':
      'Слишком много записей для сводки',
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
    Workspace: 'Рабочая область',
  },
  vi: {
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
    'No eligible savings records yet':
      'Chưa có bản ghi tiết kiệm đủ điều kiện',
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
