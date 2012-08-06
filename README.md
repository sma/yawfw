Yet Another Web Framework
=========================

A thin layer above express, jade and mongoose using Twitter bootstrap and marked.

## Installation

    npm install -g yawfw

## Create a new project

    $ yawfw new blog
    $ cd blog
    $ npm install
    $ yawfw scaffold Post title:string content:text created:date published:boolean
    $ yawfw server

## Example script

```js
var fw = require('yawfw');

var Post = fw.model("Post", { title: 'string', content: 'text', created: 'date', published: 'boolean' });

var app = fw.app("mongodb://localhost/blog", {title: "Blog"});

app.get("/", fw.find(Post.where("published", true).limit(3).desc('created')), fw.render('blog'));
app.use(fw.resource("/posts", Post));

app.listen(process.env.PORT || 3000);
```

## API

### `fw.app(uri, locals)`

Create a new express app, initialized for using jade templates from the current directory's `views` folder and static files from the current directory's `static` folder. The `uri` argument is used to initialize mongoose. The optional `locals` object contains constants and helper functions which can be used in jade templates. By default, these locals are defined:

* `title` - a meaningless title used in the `base.jade`
* `markdown(s)` - a function to convert a given string to markdown format (using marked)
* `date(d, f)` - a function to convert a given date object to the given format string (using moment) 

### `fw.model(name, options)`

Create a mongoose model based on the following types:

* `string` - a single line string
* `text` - a multiline string
* `number` - a number
* `boolean` - a Boolean
* `date` - a datetime

All other parameters are passed to mongoose.

### `fw.find(model)`

Express middleware function to populate the request's `objects` property with all persistent instances of that model. You can also use mongoose query objects here, like for example `Customer.where({age: {$gt: 18}}).limit(10).asc('age')`. The `objects` property is passed to the jade template in `fw.render()`.

### `fw.findOne(model)`

Express middleware function to populate the request's `object` property with the persistent instance of that model which matches the request's `id` parameter. The `object` property is passed to the jade template in `fw.render()`.

### `fw.render(name)`

Express middleware function to render the given jade template, populating the template's context with `objects` and `object` as well as all locals defined via `fw.app()`.

### `fw.redirect(path)`

Express middleware function to redirect to the given URL.

## License

Copyright (c) 2012 Stefan Matthias Aust

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of this project nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.