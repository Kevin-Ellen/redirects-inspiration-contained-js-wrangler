addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const handleRequest = async(request) => {
  const url = new URL(request.url);
  url.host = 'www.oka.com';

  let response = await fetch(url);
  response = new Response(response.body,response);
  response.headers.set('X-Robots-Tag', 'noindex');



  if(url.search.includes('highlight=true')){
    response = addHighlight().transform(response);
  }

  if(url.search.includes('croud-original=true')){
    return response;
  }

  response = addChanges().transform(response);
  return response;
}

const domains = [
  'https://cdn.dynamicyield.com',
  'https://async-px.dynamicyield.com/',
  'https://stats.g.doubleclick.net',
  'https://connect.facebook.net',
  'https://www.googletagmanager.com',
  'https://fsm1-cdn.attraqt.com',
  'https://storage.googleapis.com',
  'https://snip.bronto.com',
  'https://maw.bronto.com',
  'https://fecdn.user1st.info',
  'https://www.google-analytics.com',
  'https://fsm.attraqt.com'
];

const displayDomains = (domains) => {
  const arr = [];
  domains.forEach((domain) => {
    arr.push(`<link rel="preconnect" href="${domain}" />`);
  });
  return arr;
}

const addChanges = () => new HTMLRewriter()
  .on('img', new LazyLoad())
  // .on('img', new LazyLoad('src'))
  
  //.on('meta', new Preload('name', 'viewport'))
  .on('link',new Preload('href','https://resources1.oka.com/assets/css/core/layoutheader-min-10.css'))
  .on('a',new LinkRewriter('href'))

const addHighlight = () => new HTMLRewriter()
  .on('head', new Highlighter())

class Highlighter{
  element(element){
    element.before(
      `<style>*{border:2px solid red}img{width:100%;}</style>`,{html:true}
    );
  }
}

const images = {
  'https://resources1.oka.com/assets/en/new/site/logo-new3-mob.svg':{
    width:80,
    height:29.516
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/2021/UK/WK9/Mobile/mobile_final_template_UK_free-del_LAUNCH.jpg':{
    width:375,
    height:550
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/2021/UK/WK8/Mobile/CHRONICLE-Homepage-hero-mobile-375x550.jpg':{
    width:375,
    height:550
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/2021/UK/WK7/Mobile/ENTERTAIN-Homepage-hero-mobile-375x550.jpg':{
    width:375,
    height:550
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/2021/UK/WK9/Mobile/mobile_final_template_UK_free-del_LAUNCH.jpg':{
    width:375,
    height:550
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/Homepage%20Banners/ids-banner_748x360_february.jpg':{
    width:748,
    height:360
  },
  'https://oka-preview.croud-testing.workers.dev/Global/home/Homepage%20Banners/StoreClosures-Jan748x360.jpg':{
    width:748,
    height:360
  },
  'https://resources1.oka.com/assets/en/new/site/payment-logos-UK.png':{
    width:410,
    height:38
  },
  '/Global/home/2021/UK/WK9/Mobile/mobile_final_template_UK_free-del_LAUNCH.jpg':{
    width:375,
    height:550
  },
  '/Global/home/Homepage%20Banners/ids-banner_748x360_february.jpg':{
    width:748,
    height:360
  },
  '/Global/home/Homepage%20Banners/StoreClosures-Jan748x360.jpg':{
    width:748,
    height:360
  },
  '/Global/home/2021/UK/WK9/Mobile/mobile_final_template_UK_free-del_LAUNCH.jpg':{
    width:375,
    height:550
  },
  '/Global/home/2021/UK/WK8/Mobile/CHRONICLE-Homepage-hero-mobile-375x550.jpg':{
    width:375,
    height:550
  },
  '/Global/home/2021/UK/WK7/Mobile/ENTERTAIN-Homepage-hero-mobile-375x550.jpg':{
    width:375,
    height:550
  },
  '/Global/home/2021/UK/WK9/Mobile/mobile_final_template_UK_free-del_LAUNCH.jpg':{
    width:375,
    height:550
  },
  '/Global/home/Homepage%20Banners/ids-banner_748x360_february.jpg':{
    width:748,
    height:360
  },
  '/Global/home/Homepage%20Banners/StoreClosures-Jan748x360.jpg':{
    width:748,
    height:360
  },
}

class LazyLoad{
  // constructor(attributeName){
  //   this.attributeName = attributeName;
  // }
  element(element){
    //const attributeSRC = element.getAttribute(this.attributeName);
    const src = element.getAttribute('src');
    const cfSrc = element.getAttribute('data-cfsrc');

    element.setAttribute(
      'loading', 'lazy'
    );

    if(images.hasOwnProperty(cfSrc)){
      element.setAttribute('width', images[cfSrc].width);
      element.setAttribute('height', images[cfSrc].height);
    }else if(images.hasOwnProperty(src)){
      element.setAttribute('width', images[src].width);
      element.setAttribute('height', images[src].height);
    }else{
      element.setAttribute('width', '200');
      element.setAttribute('height', '200');
    }
  }
}

class Preload{
  constructor(attributeName, attributeValue){
    this.attributeName = attributeName;
    this.attributeValue = attributeValue;
  }
  element(element){
    const attribute = element.getAttribute(this.attributeName);
    if(attribute===this.attributeValue){
      element.after(
        displayDomains(domains).join('')
        ,{html:true}
      );
    }
  }
}

class LinkRewriter{
  constructor(attributeName){
    this.attributeName = attributeName;
  }
  element(element){
    const attribute = element.getAttribute(this.attributeName);
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('www.oka.com', 'oka-preview.croud-testing.workers.dev'),
      );
      element.setAttribute(
        this.attributeName,
        attribute.replace('http:', 'https:'),
      );
    }
  }
}