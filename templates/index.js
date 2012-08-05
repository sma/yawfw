var fw = require('yawfw');

var app = fw.app("mongodb://localhost/{{name}}", {title: "{{name}}"});

app.get("/", fw.render('index'));

app.listen(process.env.PORT || 3000);