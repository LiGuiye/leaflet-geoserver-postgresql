var express = require('express');
var router = express.Router();
var pgclient = require('./db');
pgclient.getConnection();

var cors = require('cors');
	router.use(cors());

//默认首页为index.ejs,标题为HOME，如果登录了test里显示已经登录，否则显示登录按钮
router.get('/', function(req, res) {
	if(req.cookies.islogin) {
		req.session.islogin = req.cookies.islogin;
	}
	if(req.session.islogin) {
		res.locals.islogin = req.session.islogin;
	}
	res.render('index', {
		title: 'HOME',
		test: res.locals.islogin
	});
});

//查询数据库
router.get('/select', function(req, res) {

	pgclient.select('c584_poem', {
		'poemname': req.query.id
	}, '', function(data) {
		if(data[0] === undefined) {
			res.send('返回空值');
		} else {
			res.status(200)
				.json({
					data: data
				});

			console.log("查询：" + req.query.id);
			console.log("返回结果：" + data[0].poemname)
			//res.send(data[0].password);
		}
	});

});

//跳转登录页面
router.route('/login')
	.get(function(req, res) {
		if(req.session.islogin) {
			res.locals.islogin = req.session.islogin;
		}

		if(req.cookies.islogin) {
			req.session.islogin = req.cookies.islogin;
		}
		res.render('login', {
			title: '用户登录',
			test: res.locals.islogin
		});
	})
	.post(function(req, res) {

		result = null;
		//pg.selectFun(client,req.body.username, function (result) {
		pgclient.select('userinfo', {
			'username': req.body.username
		}, '', function(result) {
			if(result[0] === undefined) {
				res.send('没有该用户');
			} else {
				if(result[0].password === req.body.password) {
					req.session.islogin = req.body.username;
					res.locals.islogin = req.session.islogin;
					res.cookie('islogin', res.locals.islogin, {
						maxAge: 60000
					});
					res.redirect('/');
				} else {
					res.redirect('/login');
				}
			}
		});
	});
//退出时清除Cookie并跳转回主页
router.get('/logout', function(req, res) {
	res.clearCookie('islogin');
	req.session.destroy();
	res.redirect('/');
});
//跳转注册页面，密码明文存储，需要改进
router.route('/reg')
	.get(function(req, res) {
		res.render('reg', {
			title: '用户注册'
		});
	})
	.post(function(req, res) {

		pgclient.save('userinfo', {
				'username': req.body.username,
				'password': req.body.password2
			},
			function(err) {
				pgclient.select('userinfo', {
					'username': req.body.username
				}, '', function(result) {
					if(result[0] === undefined) {
						res.send('注册没有成功请，重新注册');
					} else {
						//优化===注册后自动登录
						req.session.islogin = req.body.username;
						res.locals.islogin = req.session.islogin;
						res.cookie('islogin', res.locals.islogin, {
							maxAge: 60000
						});
						res.redirect('/');
					}
				});
			});
	});

module.exports = router;