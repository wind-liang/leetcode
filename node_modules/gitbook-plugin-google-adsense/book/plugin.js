require(["gitbook"], function(gitbook) {
    // plugin config
    var config;

    function createAdElement(adConfig) {
        adElement = document.createElement('ins');
        adElement.style = 'display: block';
        adElement.className = 'adsbygoogle';
        adElement.setAttribute('data-ad-client', adConfig.client);
        adElement.setAttribute('data-ad-slot', adConfig.slot);
        adConfig.format && adElement.setAttribute('data-ad-format', adConfig.format);
        adConfig.style && adElement.setAttribute('style', adConfig.style);

        return adElement;
    }

    function injectAds(configs) {
        if(configs && configs.length > 0) {
            configs.forEach(function(c) {
                document.querySelector(c.location).appendChild(createAdElement(c));
                (adsbygoogle = window.adsbygoogle || []).push({});
            });
        }
    }

    gitbook.events.bind("start", function(e, pluginConfig) {
        config = pluginConfig['google-adsense'].ads;

        // init script
        var adScript = document.createElement('script');
        adScript.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        adScript.setAttribute('async', true);
        document.body.appendChild(adScript);
    });

    gitbook.events.bind("page.change", function() {
        if (config) {
            injectAds(config);
        }
    });
});
