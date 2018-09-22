# gitbook-plugin-ad

GitBook Plugin to add ads or other content on every page.

```js
{
  "plugins": ["ad"],
  "pluginsConfig": {
    "ad": {
      "contentTop": "<div>Ads at the top of the page</div>",
      "contentBottom": "%3Cdiv%3EAds%20at%20the%20bottom%20of%20the%20page%3C/div%3E"
    }
  }
}

// note: contentBottom is escape('<div>Ads at the bottom of the page</div>')
```

In order to resolve `JSON` safety, the best parameters `contentTop` `contentBottom` are encoded using the `escape`.

For example:
https://github.com/zhaoda/webpack-handbook/blob/master/content/book.json

Then run `gitbook install` to download and install the plugin.
