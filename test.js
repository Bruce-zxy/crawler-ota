const puppeteer = require('puppeteer');

const startWork = async () => {
	console.log('正在启动浏览器...');
	let browser = await puppeteer.launch({
		// 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
		// executablePath: 'D:\\Program Files\\chrome-win\\chrome.exe',
		// 设置超时时间
		timeout: 15000,
		// 如果是访问https页面 此属性会忽略https错误
		ignoreHTTPSErrors: true,
		// 打开开发者工具, 当此值为true时, headless总为false
		devtools: false,
		// 关闭headless模式, 不会打开浏览器
		headless: false, 
		// 为每个页面设置一致的视口。默认为800x600视口。null禁用默认视口。
		defaultViewport: null
	});

	// 正在打开标签页
	let page = await browser.newPage();
	// 正在输入网址
	await page.goto('https://eb.meituan.com/eb/feedback#/mt');

	await page.waitFor(3000);

	let login_input = await page.$('.login__login');
	login_input.type('jxtllxsyxgs');
	let password_input = await page.$('.login__password');
	password_input.type('jxtllxsyxgs615');

	let login_button = page.$('.login__submit');
	login_button.click();





	// await page.close();
	// await browser.close();
};


startWork();