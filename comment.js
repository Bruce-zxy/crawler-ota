const puppeteer = require('puppeteer');
const target_list = require('./TargetList.json');

const toCrawlCtripWebPage = async (url, browser) => {
	// 评论对象数组
	const comment_array = [];
	// 汇总评论的函数
	const onSumHandler = async () => {
		let comment_main = await page.$$('.comment_main');
		let comment_count = comment_main.length;
		try{
			for (let i = 0; i < comment_count; i++) {
				let data = {};
				data.comment      = await page.evaluate(res => res.innerHTML, await comment_main[i].$('div.J_commentDetail'));
				data.comment_time = await page.evaluate(res => res.innerHTML.slice(3), await comment_main[i].$('span.time'));
				data.checkin_time = await page.evaluate(res => res.innerHTML.slice(0, -2), await comment_main[i].$('span.date'));
				await comment_main[i].dispose();
				comment_array.push(data);
			}
		} catch(err) {
			console.log(`【ERROR】>>>>> ${err.message}`);
		}
	}
	let page = await browser.newPage();
	await page.goto(url);
	console.log(url);
	// 等待评论区头像框渲染完成
	await page.waitFor('.J_ctrip_pop');
	// 按时间排序
	await page.select('select.select_sort', '1');
	await page.waitFor(3000);


	// 获取评论总页数
	let paginations    = await page.$('.c_page_list a:last-child span');
	let	page_num_count = await page.evaluate(a => a.innerHTML, paginations);
	await paginations.dispose();

	// 按页处理函数
	for (let i = page_num_count; i > 0; i--) {
		// 获取到页码所在的A标签
		let dom = await page.$(`.c_page_list a[value="${i}"]`);
		// 点击A标签
		await dom.tap();
		// 停止渲染A标签
		await dom.dispose();
		await page.waitFor(`.c_page_list a[value="${(i % page_num_count)+1}"]`);
		// await page.waitFor(1000);
		console.log(`正在爬取第${i}页的数据...`);
		await onSumHandler();
	}



	page.close();


	console.log(comment_array.length);
	console.log(comment_array);
	return comment_array;
}


const toCrawlCtripZYWebPage   = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlCtripDLWebPage   = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlMeituanZYWebPage = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlMeituanDLWebPage = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlAlitripWebPage   = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlYaochufaWebPage  = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}
	
const toCrawlLvmamaWebPage    = async (url, browser) => {
	let page = await browser.newPage();
	await page.goto(url);
	await page.close();
}

const crawl_method = {
	["携程直营"]: toCrawlCtripZYWebPage, 
	["携程代理"]: toCrawlCtripDLWebPage, 
	["美团直营"]: toCrawlMeituanZYWebPage, 
	["美团代理"]: toCrawlMeituanDLWebPage, 
	["飞猪直营"]: toCrawlAlitripWebPage, 
	["要出发EB"]: toCrawlYaochufaWebPage, 
	["上海驴妈妈"]: toCrawlLvmamaWebPage
}

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

	// 设置定时标识符
	let interval_flag = 0;
	// 设置定时器，时间间隔5秒
	let interval_id   = setInterval(async (web_browser) => {
		// 获取标签页数量
		let tabs = await web_browser.pages();
		console.log(tabs.length);
		if (interval_flag === 1) {
			if (tabs.length === 1) {
				// 关闭浏览器
				await web_browser.close();
				// 清除定时器
				clearInterval(interval_id);
			} else {
				// 定时标识符置0
				interval_flag = 0;
			}
		} else if (tabs.length === 1) {
			// 定时标识符加1
			interval_flag += 1;
		}
	}, 5000, browser)


	// // 遍历配置文件中的产品信息
	// for (var i = 0; i < target_list.length; i++) {
	// 	// 获取产品名称、产品类型、OTA列表
	// 	let { TargetName, TargetType, OTAList } = target_list[i];
	// 	// 遍历某个产品下所有OTA展示该产品的链接
	// 	for (let ota_name in OTAList) {
	// 		if (OTAList.hasOwnProperty(ota_name)) {
	// 			console.log(`正在【打开】${ota_name}的${TargetName}产品页面...`);
	// 			try{
	// 				// 开始遍历
	// 				await crawl_method[ota_name](OTAList[ota_name], browser);
	// 			} catch(err) {
	// 				console.log(`【ERROR】>>>>> ${err.message}`);
	// 			}
	// 			console.log(`正在【关闭】${ota_name}的${TargetName}产品页面...`);
	// 		}
	// 	}
	// }


};


startWork();