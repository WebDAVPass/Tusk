/**
 * 中文语言包
 */

export default {
  // 通用文本
  common: {
    appName: 'KeePass Tusk',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    add: '添加',
    remove: '移除',
    close: '关闭',
    settings: '设置',
    back: '返回',
    error: '错误',
    success: '成功',
    warning: '警告',
    loading: '加载中',
    unlock: '解锁',
    lock: '锁定',
    copy: '复制',
    paste: '粘贴',
    search: '搜索',
    select: '选择',
    change: '更改',
    manage: '管理',
    enable: '启用',
    disable: '禁用',
    enabled: '已启用',
    disabled: '已禁用',
    yes: '是',
    no: '否',
    ok: '确定',
    cancel: '取消',
    submit: '提交',
    reset: '重置',
    refresh: '刷新',
    scan: '扫描',
    scanning: '扫描中',
    remove: '移除',
    edit: '编辑',
    create: '创建',
    update: '更新',
    version: '版本',
    about: '关于',
    help: '帮助',
    support: '支持',
    documentation: '文档',
    privacy: '隐私',
    terms: '条款',
    contact: '联系',
    feedback: '反馈',
    language: '语言',
    theme: '主题',
    appearance: '外观',
    general: '常规',
    advanced: '高级',
    security: '安全',
    notifications: '通知',
    storage: '存储',
    database: '数据库',
    keyfile: '密钥文件',
    password: '密码',
    username: '用户名',
    url: '网址',
    notes: '备注',
    tags: '标签',
    group: '组',
    entry: '条目',
    entries: '条目',
    folder: '文件夹',
    file: '文件',
    provider: '提供者',
    cloud: '云存储',
    local: '本地',
    remote: '远程',
    sync: '同步',
    backup: '备份',
    restore: '恢复',
    import: '导入',
    export: '导出',
    generate: '生成',
    autofill: '自动填充',
    clipboard: '剪贴板',
    expiration: '过期',
    expired: '已过期',
    never: '从不',
    always: '总是',
    automatic: '自动',
    manual: '手动',
    default: '默认',
    custom: '自定义',
    none: '无',
    all: '全部',
    some: '部分',
    other: '其他',
    more: '更多',
    less: '更少',
    show: '显示',
    hide: '隐藏',
    visible: '可见',
    hidden: '隐藏',
    open: '打开',
    close: '关闭',
    closed: '已关闭',
    active: '活跃',
    inactive: '非活跃',
    connected: '已连接',
    disconnected: '已断开',
    online: '在线',
    offline: '离线',
    busy: '忙碌',
    idle: '空闲',
    ready: '就绪',
    done: '完成',
    pending: '待定',
    processing: '处理中',
    completed: '已完成',
    failed: '失败',
    aborted: '中止',
    cancelled: '取消',
    unknown: '未知',
    untitled: '无标题',
    empty: '空',
    required: '必填',
    optional: '可选',
    recommended: '推荐',
    notRecommended: '不推荐',
    important: '重要',
    note: '注意',
    tip: '提示',
    info: '信息',
    warning: '警告',
    danger: '危险',
    caution: '谨慎',
    attention: '注意',
  },

  // 启动页面
  startup: {
    title: 'KeePass Tusk',
    description:
      'Tusk 是一个使用您现有的 KeePass 数据库文件来自动填充网站密码的扩展程序。要继续使用，您必须添加您的 KeePass 数据库文件。',
    addDatabase: '添加 KeePass 数据库文件',
    returnHint: '当您启用了其中一个数据库文件提供者后，可以返回这里。',
  },

  // 解锁页面
  unlock: {
    title: 'KeePass Tusk',
    masterPasswordPlaceholder: '🔒 主密码',
    noKeyfileSelected: '未选择密钥文件。（点击更改）',
    manageKeyfiles: '管理密钥文件',
    rememberPeriod: {
      doNotRemember: '不记住',
      minutes30: '记住 30 分钟',
      hours2: '记住 2 小时',
      hours4: '记住 4 小时',
      hours8: '记住 8 小时',
      hours24: '记住 24 小时',
      untilExit: '直到浏览器退出',
    },
    rememberPeriodHint: '（滑动选择）',
    unlockDatabase: '解锁数据库',
    lockDatabase: '锁定数据库',
    closeWindow: '关闭窗口',
    changeDatabase: '更改...',
    unlocking: '正在解锁 {name}',
    errors: {
      invalidKeyfileOrDatabase: '无效的密钥文件或 KDBX 文件',
    },
    warnings: {
      newSite:
        '这可能是 Tusk 遇到的新网站。在填充密码之前，请仔细检查这是否是正确的网站。',
      permissionGranted: '您之前已授予 Tusk 在 {origin} 上填充密码的权限',
    },
  },

  // 条目列表
  entryList: {
    searchPlaceholder: '搜索整个数据库...',
    noMatches: '未找到与此网站匹配的条目。',
    noCloseMatches: '没有接近的匹配项，显示 {count} 个部分匹配。',
    noPerfectMatches: '没有完全匹配的源，显示 {count} 个部分匹配。',
  },

  // 条目列表项
  entryListItem: {
    emptyUsername: '<空>',
  },

  // 条目详情
  entryDetails: {
    backToList: '返回条目列表',
    oneTimePassword: '一次性密码',
    copyToClipboard: '复制到剪贴板',
    autofill: '自动填充',
  },

  // 文件选择器
  filePicker: {
    manageDatabaseFiles: '管理数据库文件',
  },

  // 选项页面 - 启动
  optionsStartup: {
    title: 'Tusk 入门指南',
    description:
      'Tusk 通过将您的密码存储在一个名为 KeePass 数据库的加密文件中来帮助您管理所有账户。您可以选择将此文件存储在哪里 - 大多数人将其存储在云存储提供者（如 Dropbox 或 Google Drive）中，以便在笔记本电脑、台式机和手机之间轻松访问和同步。要使用 Tusk，您应该首先启用以下存储提供者之一。',
    step1: '1. 云存储设置',
    step2: '2. 密钥文件设置（可选）',
    step2Description:
      '可选地，您还可以导入任何所需的密钥文件。密钥文件可以与密码一起使用以提供更好的安全性，甚至可以代替密码使用。',
    step3Description:
      '就是这样！Tusk 将自动发现您在云存储中的任何 KeePass 数据库，并允许您从浏览器弹出窗口切换数据库。',
    newUserDescription:
      '如果您是 KeePass 新用户，在启用云存储提供者后，系统会提示您从弹出窗口创建新数据库。大多数人将所有密码保存在一个数据库中，因此您只需执行一次。',
    supportTitle: '支持 Tusk',
    supportDescription:
      '如果您喜欢 Tusk，请考虑在 Google 网上应用店或 Firefox 附加组件商店留下评论。如果您发现问题或不满意，请在问题跟踪器上提交问题，以便我们改进 Tusk。',
    reviewChrome: '在 Google 网上应用店留下评论',
    reviewFirefox: 'Firefox 附加组件商店',
    issueTracker: '问题跟踪器',
  },

  // 导航栏
  navbar: {
    gettingStarted: '入门指南',
    manageDatabases: '管理数据库',
    manageKeyfiles: '管理密钥文件',
    advanced: '高级设置',
    reauthorize: '重新授权',
  },

  // 数据库管理
  manageDatabases: {
    description:
      'Tusk 要求您至少启用以下云存储提供者之一来同步您的 KeePass 数据库。文件出现在下方后，它们将在弹出窗口中可用。如果有问题，请阅读故障排除指南或提交问题。',
    troubleshootingGuide: '故障排除指南',
    openIssue: '提交问题',
    helpMeChoose: '帮我选择',
    newUser: '我没有 KeePass 数据库',
    helpText:
      '如果您不确定选择哪个，我推荐 Dropbox。它易于使用，并被其他 KeePass 应用程序广泛支持，例如适用于 iOS 的 Keepass2Android 或 KeepassTouch。只需创建 Dropbox 账户，上传您的 KeePass 数据库，然后在下方启用 Dropbox 提供者。',
    newUserText:
      '如果您以前从未使用过 KeePass，您需要在启用以下提供者之前创建一个新的 KeePass 数据库。您可以通过下载桌面 KeePass 应用程序（如 KeePassXC）或在浏览器中使用 KeeWeb 快速生成一个。将 KeePass 数据库文件存储在云提供者（如 Dropbox 或 Google Drive）中，完成后返回这里。',
  },

  // 密钥文件管理
  manageKeyfiles: {
    title: '密钥文件',
    description:
      '密钥文件是一种可选的身份验证方法。有关密钥文件的更多信息，请访问 KeePass 网站',
    warning:
      'Tusk 可以将您的密钥文件存储在浏览器的本地存储中，并在打开密码数据库时应用它们。网站和其他浏览器扩展无法访问这些文件。但是，它们以未加密形式存储在您的本地浏览器配置文件中，有权访问您设备的人可能会读取它们。',
    addKeyFile: '添加密钥文件',
  },

  // 高级设置
  advancedSettings: {
    clipboardExpireTime: {
      title: '剪贴板过期时间',
      description:
        '当您将值复制到剪贴板时，Tusk 将设置一个超时来自动清除它。您可以选择此超时的持续时间。',
      minutes1: '1 分钟',
      minutes2: '2 分钟',
      minutes3: '3 分钟',
      minutes5: '5 分钟',
      minutes8: '8 分钟',
    },
    hotkeyNavigation: {
      title: '启用热键导航',
      description:
        '如果启用，您将能够在 Tusk 界面打开时使用 [TAB] 和 [ENTER] 导航和自动填充密码。默认情况下，[CTRL]+[SHIFT]+[SPACE] 将打开 Tusk 弹出窗口',
      label: '热键导航',
    },
    allOriginPermission: {
      title: '授予所有网站权限',
      warning: '仅在您知道自己在做什么时才继续。',
      description:
        '如果启用，扩展程序将一次性提示授予访问和更改所有网站上数据的权限，这将禁用每个新网站上的权限弹出窗口。这有严重的安全影响。仅适用于 Chrome。由于 Chrome 的错误，启用后目前无法撤销此权限。如果您打开此选项，必须重新安装 Tusk 才能重置。',
      label: '授予所有权限',
      securityImplications: '严重的安全影响',
    },
    notifications: {
      title: '通知',
      description: '选择您希望从 Tusk 接收哪种类型的通知。',
      passwordExpiration: '密码过期',
      clipboardEvents: '剪贴板事件',
    },
    strictMatching: {
      title: '启用严格匹配',
      description:
        '如果启用，只有源完全匹配的条目才会被建议用于输入。标题和其他标签信息将不被考虑用于匹配。例如，www.google.com 将不匹配 https://google.com',
      label: '严格匹配',
    },
    storedData: {
      title: '存储的数据',
      description:
        '以下对象表示当前缓存在本地存储中的数据。此数据仅对 Tusk 可用，绝不会通过任何网络连接发送。',
    },
    language: {
      title: '语言',
      description: '选择您偏好的 Tusk 界面语言。',
      english: 'English',
      chinese: '中文 (Chinese)',
    },
  },

  // 重新授权
  reauthorize: {
    title: '重新授权 {provider}',
    description:
      '{provider} 的授权令牌已过期，Tusk 无法刷新它。请在下方重新授权以继续使用来自 {provider} 的数据库。',
    authorizeButton: '授权 {provider}',
    success: {
      title: '成功',
      message: '您可以关闭此页面，通过点击弹出图标继续使用 Tusk。',
    },
    error: {
      title: '错误',
      message: '重新授权过程中似乎出现了问题。请重试。',
    },
  },

  // 提供者组件
  providers: {
    sampleDatabase: {
      title: '示例数据库',
      description: '您可以使用示例数据库来试用功能。主密码是 123。',
    },
    dropbox: {
      title: 'Dropbox',
      description: '访问存储在 Dropbox 上的密码文件。每次使用时都会从 Dropbox 检索文件。',
    },
    googleDrive: {
      title: 'Google Drive',
      description: '访问存储在 Google Drive 上的密码文件。每次使用时都会从 Google Drive 获取文件。',
    },
    oneDrive: {
      title: 'OneDrive',
      description: '访问存储在 OneDrive 上的密码文件。每次使用时都会从 OneDrive 检索文件。',
    },
    sharedLink: {
      title: '共享链接',
      description: '无需授予对云存储提供者的完全访问权限，获取共享链接并粘贴进来。任何直接 HTTP 链接都可以，支持 Dropbox 和 Google Drive。',
      examples: {
        title: '示例：',
        dropbox: 'Dropbox URL 示例',
        googleDriveOneDrive: 'Google Drive 和 OneDrive 共享链接不再有效',
        otherCloud:
          '其他云提供者共享链接可能无法工作，但直接 HTTP 文件链接可以。',
      },
      form: {
        urlPlaceholder: '共享链接 URL',
        namePlaceholder: '数据库名称',
        addButton: '添加 URL 源',
      },
      errors: {
        linkOrTitleMissing: '链接或标题缺失',
        invalidUrl: '链接 URL 无效。',
        invalidPath:
          'URL 必须包含文件路径。（例如 http://example.com 无效，但 http://example.com/file.ckp 有效。）',
        invalidGoogleDrive:
          '无效的 Google Drive 共享链接。预期格式：https://drive.google.com/file/d/FILE_ID',
        googleDriveNotSupported:
          'Google Drive 共享链接不再受支持。请使用 Google Drive 提供者。',
      },
    },
    localFile: {
      title: '文件系统（不推荐）',
      description: '从您的本地或远程文件系统上传文件。文件的副本将保存在浏览器的本地存储中。如果您在本地系统上更新了数据库，则需要重新导入才能看到更改。',
      warning:
        'Tusk 无法保持您的本地数据库文件为最新。如果您更改了它，您需要重新将其导入 Tusk。',
      selectFile: '选择本地文件',
      invalidFile: '不是有效的 KeePass v2+ 文件。',
    },
    webdav: {
      title: 'WebDAV（测试版）',
      description: '从任何 WebDAV 文件服务器选择数据库。Tusk 将始终使您的数据库与服务器保持同步，并自动拉取新版本。警告：如果您需要用户名/密码来使用 webdav，Tusk 会将它们以未加密形式存储在磁盘上。',
      warning: '等等！您阅读了最佳实践指南吗？先去做！',
      bestPracticesGuide: '最佳实践指南',
      descriptionDetail:
        '下面的 URL 应该是文件夹的路径，而不是单个文件。WebDAV 提供者通过递归扫描您指定的文件夹中的所有文件来工作。您的 KeePass 数据库将通过其文件扩展名（.kdbx）被发现。', 
      table: {
        user: '用户',
        url: 'URL',
        actions: '操作',
      },
      scan: '扫描',
      scanning: '扫描中',
      remove: '移除',
      addNewServer: '添加新服务器',
      form: {
        urlPlaceholder: 'http://server:port/remote.php/webdav/',
        usernamePlaceholder: '用户名',
        passwordPlaceholder: '密码',
        addButton: '添加服务器',
      },
    },
    google: {
      updateNotice:
        'Google Drive 支持已更新！您现在可以授予 Tusk 访问每个 KeePass 文件的权限。',
      troubleshooting: '阅读故障排除指南。',
      chooseButton: '选择数据库文件',
    },
  },

  // 通用提供者UI
  genericProviderUi: {
    enabled: '已启用',
    disabled: '已禁用',
  },

  // 消息提示
  messenger: {
    error: '错误',
    success: '成功',
    warning: '警告',
  },

  // 返回按钮
  goBack: {
    defaultMessage: '返回',
  },

  // 错误处理
  errors: {
    generic: '发生错误',
    network: '网络错误',
    timeout: '请求超时',
    unauthorized: '未授权',
    forbidden: '访问被禁止',
    notFound: '未找到',
    serverError: '服务器错误',
    unknown: '未知错误',
  },
};
