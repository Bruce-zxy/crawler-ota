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

const exposeFunction = async (page) => {
    await page.exposeFunction('deepClone', deepClone);
    return page;
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
		headless: true, 
		// 为每个页面设置一致的视口。默认为800x600视口。null禁用默认视口。
		defaultViewport: null, 
		// 取消显示控制信息的提示栏
		args: ['--disable-infobars']
	});

	// 正在打开标签页
	let page = await browser.newPage();
	// 正在输入网址
	await page.goto(`https://eb.meituan.com/eb/feedback#/mt`);
	// 注册全局函数
	page = await exposeFunction(page);
	// 等待登陆iframe渲染
	await page.waitFor('.login-iframe');

	// 获取主页面
	let main_frame = page.mainFrame();
	// 获取主页面下的第一个iframe
	let login_frame = main_frame.childFrames()[0];

	// 等待用户名输入框渲染
	await login_frame.waitFor('.login__login');
	await login_frame.waitFor(500);

	// 输入用户名
	let username_input = await login_frame.$('.login__login');
	await username_input.type('jxtllxsyxgs');
	await username_input.dispose();
	// 输入密码
	let password_input = await login_frame.$('.login__password');
	await password_input.type('jxtllxsyxgs615');
	await password_input.dispose();
	// 点击登录
	let login_button = await login_frame.$('.login__submit');
	await login_button.click();

	// 等待滑动条方块渲染
	await login_frame.waitFor('#yodaBox');

	// 获取iframe的属性
	let frame_login_dom           = await page.$('.login-iframe');
	let frame_login_dom_property  = await page.evaluate(frame => deepClone(frame.getBoundingClientRect()), frame_login_dom);
	await frame_login_dom.dispose();
	
	// 滑动条 #yodaBoxWrapper    x: 300, y: 190
	let yoda_box_wrapper          = await login_frame.$('#yodaBoxWrapper');
	let yoda_box_wrapper_property = await login_frame.evaluate(frame => deepClone(frame.getBoundingClientRect()), yoda_box_wrapper);
	await yoda_box_wrapper.dispose();
	
	// 滑块 #yodaBox  x: 90, y: 190
	let yoda_box                  = await login_frame.$('#yodaBox');
	let yoda_box_property         = await login_frame.evaluate(frame => deepClone(frame.getBoundingClientRect()), yoda_box);
	// 鼠标聚焦在滑块上
	await yoda_box.tap();
	await yoda_box.dispose();
	
	// 获取滑动起始点
	let x_start                   = frame_login_dom_property.left + yoda_box_property.left + yoda_box_property.width/2
	let x_end                     = x_start + yoda_box_wrapper_property.width - yoda_box_property.width
	let y_start                   = frame_login_dom_property.top + yoda_box_property.top + yoda_box_property.height/2
	let y_end                     = y_start;

	await page.mouse.click(x_start, y_start, { delay: 1000 });
	await page.mouse.down(x_start, y_start);
	await page.waitFor(500);
	await page.mouse.move(x_end, y_end, { steps:30 });
	await page.waitFor(500);
	await page.mouse.up();

	await login_frame.waitFor('._slider__boxError___1Gvi7 ');




	await page.close();
	await browser.close();
};


startWork();