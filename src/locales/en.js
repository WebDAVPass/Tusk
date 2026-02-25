/**
 * 英文语言包
 */

export default {
  // 通用文本
  common: {
    appName: 'KeePass Tusk',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    close: 'Close',
    settings: 'Settings',
    back: 'Back',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    loading: 'Loading',
    unlock: 'Unlock',
    lock: 'Lock',
    copy: 'Copy',
    paste: 'Paste',
    search: 'Search',
    select: 'Select',
    change: 'Change',
    manage: 'Manage',
    enable: 'Enable',
    disable: 'Disable',
    enabled: 'Enabled',
    disabled: 'Disabled',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    cancel: 'Cancel',
    submit: 'Submit',
    reset: 'Reset',
    refresh: 'Refresh',
    scan: 'Scan',
    scanning: 'Scanning',
    remove: 'Remove',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    version: 'Version',
    about: 'About',
    help: 'Help',
    support: 'Support',
    documentation: 'Documentation',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    feedback: 'Feedback',
    language: 'Language',
    theme: 'Theme',
    appearance: 'Appearance',
    general: 'General',
    advanced: 'Advanced',
    security: 'Security',
    notifications: 'Notifications',
    storage: 'Storage',
    database: 'Database',
    keyfile: 'Key File',
    password: 'Password',
    username: 'Username',
    url: 'URL',
    notes: 'Notes',
    tags: 'Tags',
    group: 'Group',
    entry: 'Entry',
    entries: 'Entries',
    folder: 'Folder',
    file: 'File',
    provider: 'Provider',
    cloud: 'Cloud',
    local: 'Local',
    remote: 'Remote',
    sync: 'Sync',
    backup: 'Backup',
    restore: 'Restore',
    import: 'Import',
    export: 'Export',
    generate: 'Generate',
    autofill: 'Autofill',
    clipboard: 'Clipboard',
    expiration: 'Expiration',
    expired: 'Expired',
    never: 'Never',
    always: 'Always',
    automatic: 'Automatic',
    manual: 'Manual',
    default: 'Default',
    custom: 'Custom',
    none: 'None',
    all: 'All',
    some: 'Some',
    other: 'Other',
    more: 'More',
    less: 'Less',
    show: 'Show',
    hide: 'Hide',
    visible: 'Visible',
    hidden: 'Hidden',
    open: 'Open',
    close: 'Close',
    closed: 'Closed',
    active: 'Active',
    inactive: 'Inactive',
    connected: 'Connected',
    disconnected: 'Disconnected',
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
    idle: 'Idle',
    ready: 'Ready',
    done: 'Done',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    aborted: 'Aborted',
    cancelled: 'Cancelled',
    unknown: 'Unknown',
    untitled: 'Untitled',
    empty: 'Empty',
    required: 'Required',
    optional: 'Optional',
    recommended: 'Recommended',
    notRecommended: 'Not Recommended',
    important: 'Important',
    note: 'Note',
    tip: 'Tip',
    info: 'Info',
    warning: 'Warning',
    danger: 'Danger',
    caution: 'Caution',
    attention: 'Attention',
  },

  // 启动页面
  startup: {
    title: 'KeePass Tusk',
    description:
      'Tusk is an extension that uses your existing KeePass database files to autofill passwords on websites. In order to continue, you must add your KeePass database file(s).',
    addDatabase: 'Add a KeePass database file',
    returnHint:
      "You can return here when you've enabled one of the database file providers.",
  },

  // 解锁页面
  unlock: {
    title: 'KeePass Tusk',
    masterPasswordPlaceholder: '🔒 master password',
    noKeyfileSelected: 'No keyfile selected. (click to change)',
    manageKeyfiles: 'Manage Keyfiles',
    rememberPeriod: {
      doNotRemember: 'Do not remember',
      minutes30: 'Remember for 30 min.',
      hours2: 'Remember for 2 hours.',
      hours4: 'Remember for 4 hours.',
      hours8: 'Remember for 8 hours.',
      hours24: 'Remember for 24 hours.',
      untilExit: 'Until browser exits.',
    },
    rememberPeriodHint: '(slide to choose)',
    unlockDatabase: 'Unlock Database',
    lockDatabase: 'Lock Database',
    closeWindow: 'Close Window',
    changeDatabase: 'change...',
    unlocking: 'Unlocking {name}',
    errors: {
      invalidKeyfileOrDatabase: 'Invalid keyfile or KDBX file',
    },
    warnings: {
      newSite:
        'This may be a new site to Tusk. Before filling in a password, double check that this is the correct site.',
      permissionGranted:
        'You have previously granted Tusk permission to fill passwords on {origin}',
    },
  },

  // 条目列表
  entryList: {
    searchPlaceholder: 'search entire database...',
    noMatches: 'No matches found for this site.',
    noCloseMatches: 'No close matches, showing {count} partial matches.',
    noPerfectMatches:
      'No perfect origin matches, showing {count} partial matches.',
  },

  // 条目列表项
  entryListItem: {
    emptyUsername: '<empty>',
  },

  // 条目详情
  entryDetails: {
    backToList: 'back to entry list',
    oneTimePassword: 'One Time Password',
    copyToClipboard: 'Copy to clipboard',
    autofill: 'Autofill',
  },

  // 文件选择器
  filePicker: {
    manageDatabaseFiles: 'Manage Database Files',
  },

  // 选项页面 - 启动
  optionsStartup: {
    title: 'Getting Started with Tusk',
    description:
      'Tusk helps you keep track of all your accounts by storing your passwords in an encrypted file called a Keepass Database. You choose where this file is stored - most people keep them in a cloud storage provider like Dropbox or Google Drive for easy access and syncing between laptops, desktops, and phones. To use Tusk, you should first enable one of the storage providers below.',
    step1: '1. Cloud Storage Setup',
    step2: '2. Keyfile Setup (optional)',
    step2Description:
      'Optionally, you may also import any required keyfiles. A keyfile can be used together with a password to provide even better security, or even used instead of one.',
    step3Description:
      "That's it! Tusk will automatically discover any Keepass databases that your have in your cloud storage, and allow you to switch between databases from the browser popup.",
    newUserDescription:
      'If you are a new Keepass user, you will be prompted to create a new database from the popup window after you enable a cloud storage provider. Most people keep all their passwords in a single database, so you will only need to do this once.',
    supportTitle: 'Support Tusk',
    supportDescription:
      'If you like Tusk, please consider leaving a review on the google web store or firefox addon store. If you find a problem or are dissatisfied, please instead open an issue on the issue tracker so we can make Tusk better.',
    reviewChrome: 'leaving a review on the google web store',
    reviewFirefox: 'firefox addon store',
    issueTracker: 'issue tracker',
  },

  // 导航栏
  navbar: {
    gettingStarted: 'Getting Started',
    manageDatabases: 'Manage Databases',
    manageKeyfiles: 'Manage Keyfiles',
    advanced: 'Advanced',
    reauthorize: 'Reauthorize',
  },

  // 数据库管理
  manageDatabases: {
    description:
      'Tusk requires that you enable at least one of these cloud storage providers to sync your keepass database with. Once the files appear below, they will be available to unlock within the popup window. If you have problems, please read the troubleshooting guide or open an issue.',
    troubleshootingGuide: 'the troubleshooting guide',
    openIssue: 'open an issue',
    helpMeChoose: 'Help me choose',
    newUser: "I don't have a KeePass Database",
    helpText:
      "If you're unsure which to pick, I recommend Dropbox. It is easy to use and widely supported by other Keepass apps, such as Keepass2Android for iOS or KeepassTouch. Simply create a Dropbox account, upload your keepass database, and enable the dropbox provider below.",
    newUserText:
      "If you've never used keepass before, you will need to create a new keepass database before enabling the providers below. You can do this by downloading a desktop keepass application like KeePassXC or generate one quickly in your browser with KeeWeb. Store the keepass database file in a cloud provider like Dropbox or Google Drive and come back here when you're done.",
  },

  // 密钥文件管理
  manageKeyfiles: {
    title: 'Key Files',
    description:
      'Key files are an optional authentication method. More info on key files is available on the KeePass site',
    warning:
      "Tusk can store your key files locally in your browser's storage, and apply them when opening your password database. Websites and other browser extensions do not have access to these files. However, they are stored unencrypted in your local browser profile and someone with access to your device could read them.",
    addKeyFile: 'Add Key File',
  },

  // 高级设置
  advancedSettings: {
    clipboardExpireTime: {
      title: 'Clipboard Expiration Time',
      description:
        'When you copy a value to the clipboard, Tusk will set a timeout to automatically clear it again. You can choose how long this timeout will last.',
      minutes1: '1 minute',
      minutes2: '2 minutes',
      minutes3: '3 minutes',
      minutes5: '5 minutes',
      minutes8: '8 minutes',
    },
    hotkeyNavigation: {
      title: 'Enable Hotkey Navigation',
      description:
        'If enabled, you will be able to use [TAB] and [ENTER] to navigate and autofill your passwords when the tusk UI is open. By default, [CTRL]+[SHIFT]+[SPACE] will open the Tusk popup',
      label: 'Hotkey Navigation',
    },
    allOriginPermission: {
      title: 'Grant Permission on All Websites',
      warning: "Only proceed if you know what you're doing.",
      description:
        "If enabled, the extension prompts once for permission to access and change data on all websites which disables the permissions popup on each new website. This has serious security implications. Only applies to Chrome. Because of a Chrome bug, it is currently impossible to revoke this permission again after it is enabled. If you turn this ON, Tusk must be reinstalled to reset.",
      label: 'Grant All Permissions',
      securityImplications: 'serious security implications',
    },
    notifications: {
      title: 'Notification',
      description: 'Choose which type of notification do you want to receive from Tusk.',
      passwordExpiration: 'Password expiration',
      clipboardEvents: 'Clipboard events',
    },
    strictMatching: {
      title: 'Enable Strict Matching',
      description:
        "If enabled, only entries whose origins match exactly will be suggested for input. Titles and other tab information will not be considered in matching. For example, www.google.com will not match https://google.com",
      label: 'Strict Matching',
    },
    storedData: {
      title: 'Stored Data',
      description:
        'The following objects represent the current data cached in local storage. This data is only available to Tusk, and is never sent over any network connection.',
    },
    language: {
      title: 'Language',
      description: 'Choose your preferred language for the Tusk interface.',
      english: 'English',
      chinese: '中文 (Chinese)',
    },
  },

  // 重新授权
  reauthorize: {
    title: 'Reauthorize {provider}',
    description:
      'The authorization token for {provider} has expired and Tusk was unable to refresh it. Please reauthorize below to continue to use Tusk with your database from {provider}.',
    authorizeButton: 'Authorize {provider}',
    success: {
      title: 'Success',
      message: 'You can close this page and continue to use Tusk by clicking on the popup icon.',
    },
    error: {
      title: 'Error',
      message:
        'It looks like something went wrong during the re-authorization process. Please try again.',
    },
  },

  // 提供者组件
  providers: {
    sharedLink: {
      examples: {
        title: 'Examples:',
        dropbox: 'Dropbox URL Example',
        googleDriveOneDrive: 'Google Drive and OneDrive shared links no longer work',
        otherCloud:
          'Other cloud provider shared links will likely not work, but direct HTTP file links will.',
      },
      form: {
        urlPlaceholder: 'Shared Link URL',
        namePlaceholder: 'Database Name',
        addButton: 'Add URL Source',
      },
      errors: {
        linkOrTitleMissing: 'Link or Title Missing',
        invalidUrl: 'Link URL is not valid.',
        invalidPath:
          'URL must include file path. (eg. http://example.com is invalid, but http://example.com/file.ckp is valid.)',
        invalidGoogleDrive:
          'Invalid Google Drive Shared Link. Expected format: https://drive.google.com/file/d/FILE_ID',
        googleDriveNotSupported:
          'Google Drive Shared Links are no longer supported. Please use the Google Drive provider.',
      },
    },
    localFile: {
      warning:
        "Tusk cannot keep your local database file up to date. If you change it, you'll have to import it into Tusk again.",
      selectFile: 'Select Local File',
      invalidFile: 'is not a valid KeePass v2+ file.',
    },
    webdav: {
      warning: 'Wait! Did you read the best practices guide? Do that first!',
      bestPracticesGuide: 'best practices guide',
      description:
        'The URL below should have the path of a FOLDER, not an individual FILE. The webDAV provider works by recursively scanning all files within the folder you specify. Your keepass databases will be discovered by their file extension (.kdbx).',
      table: {
        user: 'User',
        url: 'URL',
        actions: 'Actions',
      },
      scan: 'scan',
      scanning: 'scanning',
      remove: 'remove',
      addNewServer: 'Add new server',
      form: {
        urlPlaceholder: 'http://server:port/remote.php/webdav/',
        usernamePlaceholder: 'Username',
        passwordPlaceholder: 'Password',
        addButton: 'Add server',
      },
    },
    google: {
      updateNotice:
        'Google Drive support has updated! You can now grant Tusk access to each keepass file.',
      troubleshooting: 'Read the troubleshooting guide.',
      chooseButton: 'Choose database file',
    },
  },

  // 通用提供者UI
  genericProviderUi: {
    enabled: 'Enabled',
    disabled: 'Disabled',
  },

  // 消息提示
  messenger: {
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
  },

  // 返回按钮
  goBack: {
    defaultMessage: 'Back',
  },

  // 错误处理
  errors: {
    generic: 'An error occurred',
    network: 'Network error',
    timeout: 'Request timeout',
    unauthorized: 'Unauthorized',
    forbidden: 'Access forbidden',
    notFound: 'Not found',
    serverError: 'Server error',
    unknown: 'Unknown error',
  },
};
