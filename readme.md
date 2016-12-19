查看在线demo：[https://demo.sailengsi.com/sls-jquery-checked/src/release/](https://demo.sailengsi.com/sls-jquery-checked/src/release/ "在线演示")

查看在线文档：[https://demo.sailengsi.com/sls-jquery-checked/doc/](https://demo.sailengsi.com/sls-jquery-checked/doc/ "查看在线文档")

项目采用fis编写，fis官网地址：[http://fis.baidu.com/](http://fis.baidu.com/ "fis文档")   
所以你需要按照以下步骤才能运行此项目


	//克隆项目
	git clone https://github.com/sailengsi/sls-jquery-checked.git
	
	//进入项目中的dev目录
	cd sls-jquery-checked/dev
	
	//安装依赖
	npm install
	
	//编译
	npm run build
	
	//启动Server
	npm start

注意：npm run build时，会在项目根目录(sls-jquery-checked)中创建release目录，此目录是把dev目录编译之后而生成，而npm start启动的服务，实际上是访问的release目录。
