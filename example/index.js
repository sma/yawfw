var fw = require('yawfw');

var Post = fw.model("Post", { title: fw.String, content: fw.Text, created: fw.Date });

var app = fw.app("mongodb://localhost/blog", {title: "Blog"});

app.get("/", fw.find(Post.where().limit(3).desc('created')), fw.render('blog'));
app.use(fw.resource("/posts", Post));

app.listen(process.env.PORT || 3000);