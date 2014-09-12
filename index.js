var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/ygztech_db');

var DetailSchema = new mongoose.Schema({
  title:  String,
  author: String
});

mongoose.model('Detail', DetailSchema);

var app = express();
var port = process.env.PORT || 5000;

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(function (req, res, next) {
	console.log(req.url);
	next();
});

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
	var _obj = [];
	for (var i = 0; i <= 100; i++) {
		_obj.push('这个是一个段落 ' + i);
	}

	res.render('index', {
		obj: _obj
	});
});

app.get('/list', function (req, res, next) {
	mongoose.model('Detail').find(function (err, details) {
		if (err) {
			return next();
		}
		res.render('list', {
			list: details
		});
	});
});

app.get('/detail/:id', function (req, res) {
	mongoose.model('Detail').findById(req.params.id, function (err, detail) {
		if (err) {
			return next();
		}
		res.render('detail', {
			detail: detail
		});
	});
});

app.get('/list/:title/:author', function (req, res, next) {
	var Detail = mongoose.model('Detail');
	var d = new Detail({
	  title:  req.params.title,
	  author: req.params.author
	});

	d.save(function (err, detail) {
		if (err) {
			return next();
		}
		res.send('新增数据成功');
	});
});

app.use(function (req, res) {
	res.status(404).send('404 错误');
});

app.listen(port);
console.log('服务启动成功', port);