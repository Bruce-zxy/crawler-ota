const puppeteer = require('puppeteer');
const target_list = require('./TargetList.json');

const toCrawlWebPage = async(url, browser) => {

}

const toCrawlCtripWebPage = async (url, browser) => {
	// 评论对象数组
	const comment_array = [];
	// 汇总评论的函数
	const onSumHandler = async () => {
		let comment_main = await page.$$('.comment_main');
		let comment_count = comment_main.length;
		for (let i = 0; i < comment_count; i++) {
			let data = {};
			data.comment      = await page.evaluate(res => res.innerHTML, await comment_main[i].$('div.J_commentDetail'));
			data.comment_time = await page.evaluate(res => res.innerHTML.slice(3), await comment_main[i].$('span.time'));
			data.checkin_time = await page.evaluate(res => res.innerHTML.slice(0, -2), await comment_main[i].$('span.date'));
			await comment_main[i].dispose();
			comment_array.push(data);
		}
	}
	let page = await browser.newPage();
	await page.goto(url);
	// 按时间排序
	await page.select('select.select_sort', '1');
	await page.waitFor(3000);

	// 获取评论总页数
	let paginations    = await page.$('.c_page_list a:last-child span');
	let page_num_count = await page.evaluate(a => a.innerHTML, paginations);
	await paginations.dispose();

	// 处理函数
	await onSumHandler();

	// 按页处理函数
	for (let i = 2; i < 4; i++) {
		// 获取到页码所在的A标签
		let dom = await page.$(`.c_page_list a[value="${i}"]`);
		// 点击A标签
		await dom.tap();
		// 停止渲染A标签
		await dom.dispose();
		await page.waitFor(3000);
		await onSumHandler();
	}





	console.log(comment_array);


	// page.close();
}

const toCrawlLYWebPage = async(url, browser) => {
	// toCrawlWebPage(url, browser);
}

const toCrawlMeituanWebPage = async(url, browser) => {
	// toCrawlWebPage(url, browser);
}

const toCrawlQunarWebPage = async(url, browser) => {
	// toCrawlWebPage(url, browser);
}

const toCrawlAlitripWebPage = async(url, browser) => {
	// toCrawlWebPage(url, browser);
}

const crawl_method = {
	["携程"]: toCrawlCtripWebPage,
	["同程"]: toCrawlLYWebPage,
	["美团"]: toCrawlMeituanWebPage,
	["去哪儿"]: toCrawlQunarWebPage,
	["飞猪"]: toCrawlAlitripWebPage
}

const startWork = async() => {
	let browser = await puppeteer.launch({
		// 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
		executablePath: 'D:\\Program Files\\chrome-win\\chrome.exe',
		//设置超时时间
		timeout: 15000,
		//如果是访问https页面 此属性会忽略https错误
		ignoreHTTPSErrors: true,
		// 打开开发者工具, 当此值为true时, headless总为false
		devtools: false,
		// 关闭headless模式, 不会打开浏览器
		headless: false
	})

	target_list.forEach((target) => {
		let { TargetName, TargetType, OTAList } = target;
		Object.keys(OTAList).forEach((ota_name) => {
			crawl_method[ota_name](OTAList[ota_name], browser)
		});
	})

	// await browser.close();
};

try {
	startWork();
} catch (err) {
	console.log(err.message);
}