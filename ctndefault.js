var gptifr;
var gptaddiv;
var clickurl_dfp = "%%CLICK_URL_UNESC%%";
var imgurl_dfp = "%%VIEW_URL_UNESC%%";
var columbiaAds = 
{
     imprURL: '',
     _auds: 'all',
     checkmweb:function() {
         try {
             window.parent.addEventListener('scroll', function() {
                 scrollStopper();
             });
             window.parent.onscroll = function() {
                 scrollStopper();
             }
             if (mweb == true) 
			 {
                 if (window.frameElement != null) {
                     gptifr = parent.top.document.getElementById(window.frameElement.getAttribute("id"));
                     if (gptifr.parentNode.parentNode.getAttribute('id').indexOf("div-gpt") != -1) {
                         gptaddiv = gptifr.parentNode.parentNode.getAttribute('id');
                     }
                 }
             }
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error dfp Checkmweb :- ' + e);
             console.log("Error in mweb check");
         }
     },
     loadLoatameAuds: function() {
         //COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'dfp Ad Load :- ');

         $jsonp.send("http://ad.crwdcntrl.net/5/c=2800/pe=y/callback=ccuad", {
             callbackName: 'ccuad',
             onSuccess: function(json) {
                 try {
                     if (json.hasOwnProperty('Profile')) {
                         for (var _i = 0; _i < json.Profile.Audiences.Audience.length; _i++) {
                             if (_i == 200) {
                                 break;
                             }
                             columbiaAds._auds += "," + json.Profile.Audiences.Audience[_i].abbr;
                         }
                     }
                 } catch (e) {

                 }
                 columbiaAds.loadData();
             },
             onTimeout: function() {
                 columbiaAds.loadData();
             },
             timeout: 2
         });

     },
     loadData: function() {
         try {
             columbiaAds.checkmweb();
             var iDiv = document.createElement('div');
             iDiv.id = 'colombiaAdDiv';
             document.getElementsByTagName('body')[0].appendChild(iDiv);
             var adunit = dimensionid + "~1~0";
             var windowref = (window.location != window.parent.location) ? document.referrer : document.location;
             var url = 'http://ade.clmbtech.com/cde/data/v4.htm?adUnitId=' + adunit + '&_v=0&auds=' + columbiaAds._auds + '&_u=' + escape(windowref) + '&_t=3&_c=colombiaadCallback&exc=null&cb=' + columbiaAds.getCB();

             $jsonp.send(url, {
                 callbackName: 'colombiaadCallback',
                 onSuccess: function(json) {
                     columbiaAds.jsonCallback(json);
                 },
                 onTimeout: function() {
                     parent.top.document.getElementById(gptaddiv).style.display = 'none';
                     COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'dfp timeout :- ');
                     console.log('timeout');
                 },
                 timeout: 15
             });
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error dfp loadData :- ' + e);
         }
     },
     jsonCallback: function(response) {
         try {
             var adResponse;

             if (typeof JSON == 'undefined') {
                 adResponse = eval(response);
             } else {
                 adResponse = JSON.parse(response);
             }

             for (var i = 0; i < adResponse.length; i++) {
                 var id = adResponse[i].adSlot + '-' + adResponse[i].position;

                 var success = adResponse[i].success;
                 if (success == 1) {
                     columbiaAds.imprURL = adResponse[i].imprUrl;
                     columbiaAds.createAd(id, adResponse[i], 'colombiaAdDiv');
                 } else {
                     parent.top.document.getElementById(gptaddiv).style.display = 'none';
                     COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'DFP Blank Response : ');
                 }
             }
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error Dfp jsonCallback :- ' + e);
         }
     },
     replaceAdValue: function(adStr, response) {
         var repstr = COLOMBIAUTIL.strReplace(adStr, '{{href}}', response.url);
         repstr = COLOMBIAUTIL.strReplace(repstr, '{{imgsrc}}', response.sImg[0]);
         repstr = COLOMBIAUTIL.strReplace(repstr, '{{title}}', response.name);
         repstr = COLOMBIAUTIL.strReplace(repstr, '{{desc}}', response.desc);
         repstr = COLOMBIAUTIL.strReplace(repstr, '{{brand}}', response.brand);
         return repstr;
     },
     createAd: function(id, response, adcontainer) {
         var snippet;
         var adstr = "";
         var adsnippet = "";

         try {
             if (!response.hasOwnProperty('snippet')) {
                 return;
             }
             snippet = response.snippet;

             if (response.items[0].hasOwnProperty('dataType') && response.items[0].dataType == 1) {
                 columbiaAds.renderExternalHTMLTag(response, adcontainer);
                 return;
             }

             var adBox = document.getElementById(adcontainer);
             adBox.style.display = 'none';
             snippet = snippet.replace("%jdata%", "");
             snippet = snippet.replace("\\", "");
             snippet = COLOMBIAUTIL.strReplace(snippet, "\\\"", "\"");
             snippet = COLOMBIAUTIL.strReplace(snippet, "\\\"", "\"");
             snippet = COLOMBIAUTIL.strReplace(snippet, "<\\a>", "</a>");
             snippet = COLOMBIAUTIL.strReplace(snippet, 'id="adsdivLyr">', 'id="adsdivLyr">{{adpaidbody}}');
             snippet = COLOMBIAUTIL.strReplace(snippet, 'id="adsOrgdivLyr">', 'id="adsOrgdivLyr">{{adogbody}}');
             if (response.hasOwnProperty('items') || response.hasOwnProperty('oItems')) {
                 if (snippet.indexOf("{{width}}") > -1) {
                     var frmwidth1 = snippet.split("{{width}}");
                     frmwidth = frmwidth1.length == 3 ? frmwidth1[1] : "";
                     adBox.style.width = frmwidth;
                 }

                 if (snippet.indexOf("{{height}}") > -1) {
                     var frmheight1 = snippet.split("{{height}}");
                     frmheight = frmheight1.length == 3 ? frmheight1[1] : "";
                     adBox.style.height = frmheight;
                 }
             }
             /*  Code for Paid items             */
             if (response.hasOwnProperty('items')) {
                 var paidItem = "";

                 for (var i = 0; i < response.items.length; i++) {

                     if (i == 0) {
                         if (snippet.indexOf("#pd#") > -1) {
                             var tmp1 = snippet.split("#pd#");
                             paidItem = tmp1.length == 3 ? tmp1[1] : "";
                         }
                     }
                     if (paidItem != "") {
                         adstr += columbiaAds.replaceAdValue(paidItem, response.items[i]);
                     }
                 }
                 adsnippet = COLOMBIAUTIL.strReplace(snippet, '{{adpaidbody}}', adstr);
             }

             /*  Code for organic items   */
             if (response.hasOwnProperty('oItems')) {
                 var organicItem = "";
                 adstr = '';
                 for (var j = 0; j < response.oItems.length; j++) {
                     if (j == 0) {
                         if (snippet.indexOf("#og#") > -1) {
                             var tmp1 = snippet.split("#og#");
                             organicItem = tmp1.length == 3 ? tmp1[1] : "";
                         }
                     }
                     if (organicItem != "") {
                         adstr += this.replaceAdValue(organicItem, response.oItems[j]);
                     }
                 }
                 adsnippet = COLOMBIAUTIL.strReplace(adsnippet, '{{adogbody}}', adstr);
             }

             /* End of Og Items       */
             adBox.innerHTML = "";
             columbiaAds.drawAdFrame(id, adcontainer, adsnippet);
             //COLOMBIAUTIL.debugTrack('http://LB-T-,1393831672.ap-southeast-1.elb.amazonaws.com/image_e.jpeg', 'ad rendered with widget');
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error Dfp createAd :- ' + e);
         }
     },
     drawAdFrame: function(id, adcontainer, adResponse) {
         try {
             var iframe = document.createElement('iframe');
             iframe.style.width = '100%';
             iframe.style.height = '100%';
             iframe.style.border = '0';
             iframe.setAttribute("scrolling", "no");
             iframe.setAttribute("frameBorder", '0');
             iframe.style.overflow = "hidden";
             iframe.id = 'ifr_' + id;
             document.getElementById(adcontainer).appendChild(iframe);
             var snippet = adResponse;
             document.getElementById(iframe.id).onload = function() {
                 try {
                     var iFrameBody = '';
                     /*var id = this.id.split('_')[1];
                           if (this.contentDocument) 
                           { 
                               iFrameBody = this.contentDocument.getElementsByTagName('body')[0];
                           }
                           else if ( this.contentWindow ) 
                           { 
                               iFrameBody = this.contentWindow.document.getElementsByTagName('body')[0];
                           }
                           var frameHTML = iFrameBody.innerHTML;
                           var iframeContent = (this.contentWindow || this.contentDocument);
                      */
                 } catch (e) {
                     COLOMBIAUTIL.onConsole('Iframe onload :' + e);
                 }
             }
             iframe.contentWindow.document.write(snippet);
             iframe.contentWindow.document.close();
             document.getElementById(adcontainer).style.display = 'block';
             colombiaViewportAd.onScroll();
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error Dfp DrwaIfram :- ' + e);
         }
     },
     getCB: function() {
         var rnd = '0';
         try {
             var text = "";
             var hdntxt = "";
             var captchatext = "";
             var possible = "ABCDEFGHIkLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
             for (var i = 0; i < 3; i++) {
                 text += possible.charAt(Math.floor(Math.random() * possible.length)) + Math.floor((Math.random() * 999) + 1);
             }
             rnd = text;
         } catch (e) {
             //console.log('Error in getcb', e);
         }
         return rnd;
     },
     renderExternalHTMLTag: function(response, adcontainer) {
         try {
             var snippet = response.items[0].script;
             var iframe = document.createElement('iframe');
             iframe.style.width = '100%';
             iframe.style.height = '100%';
             iframe.style.border = '0';
             iframe.setAttribute("scrolling", "no");
             iframe.setAttribute("frameBorder", '0');
             iframe.style.overflow = "hidden";
             iframe.style.float = "left";
             iframe.id = 'ifr_' + adcontainer;
             document.getElementById(adcontainer).appendChild(iframe);

             document.getElementById(iframe.id).onload = function() {
                 this.contentWindow.document.body.style.margin = 0;
                 this.contentWindow.document.body.style.padding = 0;
             }
             iframe.contentWindow.document.write(snippet);
             iframe.contentWindow.document.close();
             colombiaViewportAd.onScroll();
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error Dfp renderExternalHTMLTag :- ' + e);
         }
     }
 }
 var colombiaViewportAd = {
     tracked: false,
     adcallthrottle: function(fn, threshhold, scope) {
         try {
             threshhold || (threshhold = 250);
             var last, deferTimer;
             return function() {
                 var context = scope || this;
                 var now = +new Date,
                     args = arguments;
                 if (last && now < last + threshhold) {
                     clearTimeout(deferTimer);
                     deferTimer = setTimeout(function() {
                         last = now;
                         fn.apply(context, args);
                     }, threshhold);
                 } else {
                     last = now;
                     fn.apply(context, args);
                 }
             };
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error dfp adcallthottle :- ' + e);
         }
     },
     isElementPartiallyInViewport: function(el) {
         try {
             if (el.getBoundingClientRect) {
                 var rect = el.getBoundingClientRect();
                 var windowHeight = (window.parent.innerHeight || parent.top.document.documentElement.clientHeight);
                 var windowWidth = (window.parent.innerWidth || parent.top.document.documentElement.clientWidth);
                 var w = rect.right - rect.left;
                 var h = rect.bottom - rect.top;
                 var vertInView = (rect.top <= windowHeight) && ((rect.top + h) >= 0);
                 var horInView = (rect.left <= windowWidth) && ((rect.left + w) >= 0);
                 return (vertInView && horInView);
             } else {
                 return false;
             }
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error dfp isElementPartiallyInViewport :- ' + e);
             return false;
         }
     },
     onScroll: function() {
         try 
		 {
             if (window.frameElement != null && !colombiaViewportAd.tracked) {
                 var item = parent.top.document.getElementById(gptaddiv);
                 if (colombiaViewportAd.isElementPartiallyInViewport(item) && !colombiaViewportAd.tracked && columbiaAds.imprURL != '') {
                     colombiaViewportAd.tracked = true;
                     var img = document.createElement('img');
                     img.src = columbiaAds.imprURL + "&cb=" + columbiaAds.getCB();
                     img.style.display = 'none';
                     document.body.appendChild(img);
                 }
             }
         } catch (e) {
             COLOMBIAUTIL.debugTrack('http://LB-T-1393831672.ap-southeast-1.elb.amazonaws.com/image.jpeg', 'error dfp onscroll :- ' + e);
         }
     }
 };



 var $jsonp = (function() {
     var that = {};

     that.send = function(src, options) {
         var callback_name = options.callbackName || 'callback';
         var on_success = options.onSuccess || function() {};
         var on_timeout = options.onTimeout || function() {};
         timeout = options.timeout || 10; // sec

         var timeout_trigger = window.setTimeout(function() {
             window[callback_name] = function() {};
             on_timeout();
         }, timeout * 1000);

         window[callback_name] = function(data) {
             window.clearTimeout(timeout_trigger);
             on_success(data);
         }

         var script = document.createElement('script');
         script.type = 'text/javascript';
         script.async = true;
         script.src = src;
         document.getElementsByTagName('head')[0].appendChild(script);
     }

     return that;
 })();

 var COLOMBIAUTIL = {
     strReplace: function($str, $search, $replace) {
         return $str.split($search).join($replace);
     },
     strExactReplace: function($str, $search, $replace) {
         return $str.split(new RegExp("\\b" + $search + "\\b", "gi")).join($replace);
     },
     debugTrack: function(pixelurl, msg) {
        // var img = document.createElement('img');
         //img.src = pixelurl + "?cb=" + columbiaAds.getCB() + "&msg=" + msg;
         //img.style.display = 'none';
         //document.body.appendChild(img);

     },
     dfpTrack: function(pixelurl) {
         var img = document.createElement('img');
         img.src = pixelurl + columbiaAds.getCB();
         img.style.display = 'none';
         document.body.appendChild(img);

     },
     onConsole: function(msg) {
         var myParam = location.search.indexOf('colombiatrack=');
         if (myParam > 0) {
             //console.log(msg);
         }
     }
 }

 columbiaAds.loadLoatameAuds();
 var scrollStopper = colombiaViewportAd.adcallthrottle(colombiaViewportAd.onScroll, 500);