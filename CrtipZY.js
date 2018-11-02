const puppeteer = require('puppeteer');

const deepClone = (data) => {
    var type = Object.prototype.toString.call(data).slice(8,-1);
    var obj = null;
    if (type === 'Array') {
        obj = [];
        data.forEach((item) => obj.push(deepClone(item)));
    } else if (type === 'Object') {
        obj = {};
        Object.keys(data).forEach((item) => obj[item] = deepClone(data[item]));
    } else {
        return data;
    }
    return obj;
}

const toExposeFunction = async (page) => {
    await page.exposeFunction('deepClone', deepClone);
    return page;
}

const toFillInInput = async function (contents, fragment) {
	await fragment.waitFor(500);
	for (let i = 0; i < contents.length; i++) {
		let selector_dom =  await fragment.$(contents[i].selector);
		await selector_dom.type(contents[i].content);
		await selector_dom.dispose();
	}
}

const startWork = async () => {
	console.log('正在启动浏览器...');
	let browser = await puppeteer.launch({
		// 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
		// executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
		// 设置超时时间
		timeout: 15000,
		// 如果是访问https页面 此属性会忽略https错误
		ignoreHTTPSErrors: true,
		// 打开开发者工具, 当此值为true时, headless总为false
		devtools: false,
		// 关闭headless模式, 不会打开浏览器
		headless: false, 
		// 为每个页面设置一致的视口。默认为800x600视口。null禁用默认视口。
		defaultViewport: null, 
		// 取消显示控制信息的提示栏
		args: ['--disable-infobars']
	});

	// 正在打开标签页
	let page = await browser.newPage();
	// 正在输入网址
	await page.goto(`http://ebooking.ctrip.com/ebkassembly/login.aspx`);
	// 注册全局函数
	page = await toExposeFunction(page);

	await toFillInInput([{
		selector: "#userName", 
		content: "huxian"
	}, {
		selector: "#userPwd", 
		content: "huxian123"
	}], page);

	// 点击登录
	let login_button = await page.$('#loginbtndiv #accSubmit');
	await login_button.click();


	// await page.close();
	// await browser.close();
};


startWork();