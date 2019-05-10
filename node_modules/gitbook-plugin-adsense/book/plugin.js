/* eslint-env browser */

require(['gitbook'], function (gitbook) {
  var adInsertPoint = '.page-inner section'
    , adPosition = 'bottom'
    , ad;
  function insert(){
      var h = document.getElementsByTagName('head')[0];
      var s1 = document.createElement('script');
      s1.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      s1.setAttribute('async', true);
      h.appendChild(s1);
      var s2 = document.createElement('script'); 
      s2.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "ca-pub-123456789",enable_page_level_ads: true});'
      h.appendChild(s2);
      
  }
  gitbook.events.bind('start', function (e, cnf) {
     insert();
  });

  // I insert ad again when switching pages
  gitbook.events.bind('page.change', function () {
  });
});
