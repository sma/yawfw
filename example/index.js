var fw = require('yawfw');

var Post = fw.model("Post", { title: 'string', content: 'text', created: 'date', published: 'boolean' });

var app = fw.app("mongodb://localhost/blog", {title: "Blog"});

app.get("/", fw.find(Post.where("published", true).limit(3).desc('created')), fw.render('blog'));
app.use(fw.resource("/posts", Post));

app.listen(process.env.PORT || 3000);