# gitbook-plugin-meta

[![npm](https://img.shields.io/npm/v/gitbook-plugin-meta.svg?maxAge=2592000)](https://www.npmjs.com/package/gitbook-plugin-meta)
[![npm](https://img.shields.io/npm/dt/gitbook-plugin-meta.svg?maxAge=2592000)](https://www.npmjs.com/package/gitbook-plugin-meta)
[![npm](https://img.shields.io/npm/l/gitbook-plugin-meta.svg?maxAge=2592000)](https://www.npmjs.com/package/gitbook-plugin-meta)

Add meta data to `<head>` for your [gitbooks](https://www.gitbook.com/).

## Config

In your gitbook.json, add this plugin:

```javascript
{
    "plugins": [
        "meta"
    ]
}
```

And add/edit the config:

```javascript
{
    "plugins": [
        "meta"
    ],
    "pluginsConfig": {
        "meta": {
            "name": "apple-mobile-web-app-capable",
            "content": "yes"
        }
    }
}
```

Then you will see `<meta name="apple-mobile-web-app-capable" content="yes">` in the `<head>` section of your book.

If you have multiple metadata to add, then you can:

```javascript
{
    "plugins": [
        "meta"
    ],
    "pluginsConfig": {
        "meta": {
            "data": [
                {
                    "name": "name1",
                    "content": "content1",
                    "extra": "Any information"
                },
                {
                    "name": "name2",
                    "content": "content2"
                },
            ]
        }
    }
}
```

`data` is an array of objects, in which each object has the keys 'name' and 'content'.

See [gitbook.json](https://github.com/CyberZHG/CLRS/blob/master/book.json) for a real example.
