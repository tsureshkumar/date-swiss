# date-swiss

This is a chrome add-on to help quickly insert or copy current date and time
into text fields or any other editable fields.

In some sites, especially blogging or any note taking sites, I want to quickly
start a document with current date.  To fill this, I either need to lookup the
calendar to know current date and time and format it in the format I want.  If I
have an utility that does this automatically without ever looking up, this tool
can be used.

![demo](https://user-images.githubusercontent.com/108256/126776349-860956ce-53b3-47c4-a54a-ce18329875ae.gif)


# install

```
$ npm  install
$ npm run chrome:build
```

You will have your plugin ready in dist folder.  You can then go to Chrome ->
Extensions, enable developer mode. Then, you can click on "Load unpacked" button
and select the dist folder. An icon will appear next to the address bar with
name `date-swiss`. You can edit preferred date formates by right-clicking on the
icon and choose "options".

# develop

```
$ npm install
$ npm run watch:plugin
```

This watches for any source changes and builds the plugin in dist folder
