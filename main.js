const { app, BrowserWindow, Menu } = require('electron');
const ElectronPreferences = require('electron-preferences');

var path = require('path');

let win;
let isMac = true;

const preferences = new ElectronPreferences({
    // 'dataStore': path.resolve(__dirname, 'preferences.json'),
	'dataStore': path.resolve(app.getPath('userData'), 'preferences.json'),
    'defaults': {
        'proxy': {
            'use': 'false',
			'url': '',
			'port': '',
			'one': 'true'
        },
		'session': {
			'cache': 'false',
			'storage': 'false'
		}
    },
    /**
     * If the `onLoad` method is specified, this function will be called immediately after
     * preferences are loaded for the first time. The return value of this method will be stored as the
     * preferences object.
     */
    'onLoad': (preferences) => {
        // ...
        return preferences;
    },
    'sections': [
        {
            'id': 'proxy',
            'label': 'Proxy',
            'icon': 'spaceship',
            'form': {
                'groups': [
                    {
                        'label': 'Proxy Settings',
                        'fields': [
                            {
                                'label': 'Startup Information',
                                'key': 'info',
                                'type': 'text',
                                'help': 'During this session\'s startup.'
                            },
                            {
                                'label': 'Activate Proxy',
                                'key': 'use',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Yes', 'value': 'true'},
                                    {'label': 'No', 'value': 'false'},
                                ],
                                'help': 'You need to restart the application for settings to take effect.'
                            },
							{
                                'label': 'Use One Proxy For All Requests',
                                'key': 'one',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Yes', 'value': 'true'},
                                    {'label': 'No', 'value': 'false'},
                                ],
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'One For All Proxy URL',
                                'key': 'url',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'One For All Proxy Port',
                                'key': 'port',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'HTTP Proxy URL',
                                'key': 'httpurl',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'HTTP Proxy Port',
                                'key': 'httpport',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'HTTPS Proxy URL',
                                'key': 'httpsurl',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'HTTPS Proxy Port',
                                'key': 'htppsport',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'FTP Proxy URL',
                                'key': 'ftpurl',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'FTP Proxy Port',
                                'key': 'ftpport',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'SOCK5 Proxy URL',
                                'key': 'socks5url',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                            {
                                'label': 'SOCK5 Proxy Port',
                                'key': 'socks5port',
                                'type': 'text',
                                'help': 'You need to restart the application for settings to take effect.'
                            }
                        ]
                    }
                ]
            }
        },
        {
            'id': 'session',
            'label': 'Session',
            'icon': 'folder-15',
            'form': {
                'groups': [
                    {
                        'label': 'Next Session',
                        'fields': [
							{
                                'label': 'Cache Startup Information',
                                'key': 'cacheinfo',
                                'type': 'text',
                                'help': 'During this session\'s startup.'
                            },
                            {
                                'label': 'Clear Cache',
                                'key': 'cache',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Yes', 'value': 'true'},
                                    {'label': 'No', 'value': 'false'},
                                ],
                                'help': 'You need to restart the application for settings to take effect.'
                            },
							{
                                'label': 'Storage Startup Information',
                                'key': 'storageinfo',
                                'type': 'text',
                                'help': 'During this session\'s startup.'
                            },
                            {
                                'label': 'Clear Storage',
                                'key': 'storage',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Yes', 'value': 'true'},
                                    {'label': 'No', 'value': 'false'},
                                ],
                                'help': 'You need to restart the application for settings to take effect.'
                            },
                        ]
                    }
                ]
            }
        },
	]
});

const template = [
  // { role: 'appMenu' }
  ...(process.platform === 'darwin' ? [{
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
	  {
        label: 'Web Application',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://penguinmessenger.tech')
        }
      },
	  isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Settings',
        click: async () => {
		  preferences.show();
    }
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
	webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

   const sessionCache = preferences.value('session.cache');
   const sessionStorage = preferences.value('session.storage');
	
  if (sessionCache === 'true') {
	win.webContents.session.clearCache(function(){
		preferences.value('session.cache', 'false');
		preferences.value('session.cacheinfo', 'Cache WAS cleared during startup.');
	});
  } else {
	preferences.value('session.cacheinfo', 'Cache WAS NOT cleared during startup.');
  }
  
  if (sessionCache === 'true') {
	win.webContents.session.clearStorageData(function(){
		preferences.value('session.storage', 'false');
		preferences.value('session.storageinfo', 'Storage WAS cleared during startup.');
	});
  } else {
	preferences.value('session.storageinfo', 'Storage WAS NOT cleared during startup.');
  }
	
const proxyUse = preferences.value('proxy.use');	
if (proxyUse === 'true') {
  try {
	  const proxyOne = preferences.value('proxy.one');
	  if (proxyOne === 'true') {
		const proxyURL = preferences.value('proxy.url');
		const proxyPORT = preferences.value('proxy.port');
		preferences.value('proxy.info', 'The proxy WAS used on startup.');
		win.webContents.session.setProxy({
			proxyRules:'https='+ proxyURL + ':' + proxyPORT + ';http='+ proxyURL + ':' + proxyPORT + ';ftp=' + proxyURL + ':' + proxyPORT  + ';socks5://' + proxyURL + ':' + proxyPORT
		}, function () {
			win.loadURL('https://penguinmessenger.tech');
		});
	  } else {
		const proxyHttpUrl = preferences.value('proxy.httpurl');
		const proxyHttpPort = preferences.value('proxy.httpport');
		const proxyHttpsUrl = preferences.value('proxy.httpsurl');
		const proxyHttpsPort = preferences.value('proxy.httpsport');
		const proxyFtpUrl = preferences.value('proxy.ftpurl');
		const proxyFtpPort = preferences.value('proxy.ftpport');
		const proxySocks5Url = preferences.value('proxy.socks5url');
		const proxySocks5Port = preferences.value('proxy.socks5port');
		preferences.value('proxy.info', 'The proxy WAS used on startup.');
		win.webContents.session.setProxy({
			proxyRules:'https='+ proxyHttpsUrl + ':' + proxyHttpsPort + ';http='+ proxyHttpUrl + ':' + proxyHttpPort + ';ftp=' + proxyFtpUrl + ':' + proxyFtpPort  + ';socks5://' + proxySocks5Url + ':' + proxySocks5Port
		}, function () {
			win.loadURL('https://penguinmessenger.tech');
		});
	  }
	 
  } catch (e) {
	preferences.value('proxy.info', 'The proxy WAS NOT used on startup.');
    win.loadURL('https://penguinmessenger.tech')
    preferences.value('proxy.use', 'false');
    preferences.value('proxy.info', 'Error: ' + e.message);
  }
} else {
  try {
	  preferences.value('proxy.info', 'The proxy WAS NOT used on startup.');
    win.loadURL('https://penguinmessenger.tech')
  } catch (e) {
    preferences.value('proxy.use', 'false');
    preferences.value('proxy.info', 'Error: ' + error.message);
  }
}

  // uncomment below to open the DevTools.
  //win.webContents.openDevTools()
  
   const isWindows = process.platform === 'win32';
  let needsFocusFix = false;
  let triggeringProgrammaticBlur = false;

  win.on('blur', (event) => {
    if(!triggeringProgrammaticBlur) {
      needsFocusFix = true;
    }
  })

  win.on('focus', (event) => {
    if(isWindows && needsFocusFix) {
      needsFocusFix = false;
      triggeringProgrammaticBlur = true;
      setTimeout(function () {
        win.blur();
        win.focus();
        setTimeout(function () {
          triggeringProgrammaticBlur = false;
        }, 100);
      }, 100);
    }
  })

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
});
