The Google Adsense plugin for Gitbook
==============

Config plugin in `book.json`.
```
{
  "plugins": ["google-adsense"]
}
```

Install via **npm**

```
$ npm install gitbook-plugin-google-adsense
```

### Usage

Need to config an array of ad's properties:

Add an array of `ads` with following properties:

* **client**(**require**): your Adsense Client ID.
* **slot**(**require**): your Adsense Slot ID.
* **location**(**require**): the DOM selector to element you want to inject ad into.
* **format**(**optional**): your ad format.
* **style**(**optional**): add some inline styles for the ad.

For example,

```
{
    "plugins": ["adsense"],
    "pluginsConfig": {
        "ads": [
            {
            "client": "ca-pub-XXXXXXXXXXXXXXXX",
            "slot": "XXXXXXXXXX",
            "format": "auto",
            "location": ".page-inner section",
            "style": "width: 100px;"
            }
        ]
    }
}
```
