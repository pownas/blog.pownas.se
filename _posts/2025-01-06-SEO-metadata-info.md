---
layout: post
title: "SEO - Search Engine Optimizing - Metadata taggar"
date: 2025-01-06
category: "HTML-Code"
---

Info om vilka meta-data taggar man kan använda på en webbsida.

Informationen nedan kommer från denna blogg-posten: 

https://www.codewithfaraz.com/article/96/the-complete-list-of-meta-tags-in-html-2023




------------

Start of article


# The Complete List of Meta Tags in HTML (2024)
Faraz Logo
By Faraz - March 07, 2024

Discover the comprehensive compilation of essential meta tags in HTML for improved website performance and SEO. Stay ahead with our up-to-date list of meta tags for 2024.

Table of Contents
1. Introduction
2. Basic Meta Tags
3. Meta Tags for Social Media
4. Meta Tags for Mobile
5. Advanced Meta Tags
6. Custom Meta Tags
7. Dublin Core Tags:
8. How to Implement Meta Tags in HTML
9. Best Practices for Meta Tags
10. Common Mistakes to Avoid
11. Impact of Meta Tags on SEO
12. Meta Tags and Website Performance
13. Future of Meta Tags
14. Conclusion
15. Frequently Asked Questions (FAQs)  


# 1. Introduction

Meta tags play a crucial role in the world of web development and search engine optimization (SEO). They are snippets of code that provide valuable information about a webpage to search engines and social media platforms. In this article, we will explore the different types of meta tags used in HTML and their significance in optimizing web pages for improved visibility and user experience.

# 2. Basic Meta Tags
Title Tag:
The title tag is one of the most critical meta tags. It defines the title of a webpage and appears in search engine results as the clickable headline. For example:

```
<title>Best Summer Recipes | Delicious and Refreshing Dishes</title>
```

## Description Tag:

The description tag provides a brief summary of the webpage's content. It influences the search engine's snippet displayed beneath the title. For example:

```html
<meta name="description" content="Explore a collection of the best summer recipes that are both delicious and refreshing. From fruity beverages to icy desserts.">
```

Keywords Tag:
The keywords tag used to be significant in the past, but its impact on SEO has diminished. It contains a list of relevant keywords related to the webpage's content. For example:

```html
<meta name="keywords" content="summer recipes, delicious dishes, refreshing desserts, fruity beverages">
```

Other Basic Meta Tag:
```html
<meta charset='UTF-8'>
<meta name='subject' content='your website's subject'>
<meta name='copyright' content='company name'>
<meta name='language' content='ES'>
<meta name='robots' content='index,follow'>
<meta name='revised' content='Monday, July 24th, 2023, 5:15 pm'>
<meta name='abstract' content=''>
<meta name='topic' content=''>
<meta name='summary' content=''>
<meta name='Classification' content='Business'>
<meta name='author' content='name, email@hotmail.com'>
<meta name='designer' content=''>
<meta name='reply-to' content='email@hotmail.com'>
<meta name='owner' content=''>
<meta name='url' content='http://www.websiteaddrress.com'>
<meta name='identifier-URL' content='http://www.websiteaddress.com'>
<meta name='directory' content='submission'>
<meta name='pagename' content='jQuery Tools, Tutorials and Resources'>
<meta name='category' content=''>
<meta name='coverage' content='Worldwide'>
<meta name='distribution' content='Global'>
<meta name='rating' content='General'>
<meta name='revisit-after' content='7 days'>
<meta name='subtitle' content='This is my subtitle'>
<meta name='target' content='all'>
<meta name='HandheldFriendly' content='True'>
<meta name='MobileOptimized' content='320'>
<meta name='date' content='Sep. 27, 2022'>
<meta name='search_date' content='2022-09-27'>
<meta name='DC.title' content='Unstoppable Robot Ninja'>
<meta name='ResourceLoaderDynamicStyles' content=''>
<meta name='medium' content='blog'>
<meta name='syndication-source' content='https://www.codewithfaraz.com/category'>
<meta name='original-source' content='https://www.codewithfaraz.com/category'>
<meta name='verify-v1' content='dV1r/ZJJdDEI++fKJ6iDEl6o+TMNtSu0kv18ONeqM0I='>
<meta name='y_key' content='1e39c508e0d87750'>
<meta name='pageKey' content='guest-home'>
<meta itemprop='name' content='jQTouch'>
<meta http-equiv='Expires' content='0'>
<meta http-equiv='Pragma' content='no-cache'>
<meta http-equiv='Cache-Control' content='no-cache'>
<meta http-equiv='imagetoolbar' content='no'>
<meta http-equiv='x-dns-prefetch-control' content='off'>
```

# 3. Meta Tags for Social Media

Open Graph Tags:
Open Graph tags enable proper integration of web pages on social media platforms. They control how content appears when shared on platforms like Facebook. For example:

```html
<meta property="og:title" content="Delicious and Refreshing Summer Recipes">
<meta property="og:description" content="Explore a collection of the best summer recipes that are both delicious and refreshing.">
<meta property="og:image" content="https://example.com/summer-recipes.jpg">
<meta name='og:type' content='movie'>
<meta name='og:url' content='http://www.imdb.com/title/tt0117500/'>
<meta name='og:site_name' content='IMDb'>

<meta name='fb:page_id' content='43929265776'>
<meta name='application-name' content='foursquare'>
<meta name='og:email' content='me@example.com'>
<meta name='og:phone_number' content='650-123-4567'>
<meta name='og:fax_number' content='+1-415-123-4567'>

<meta name='og:latitude' content='37.416343'>
<meta name='og:longitude' content='-122.153013'>
<meta name='og:street-address' content='1601 S California Ave'>
<meta name='og:locality' content='Palo Alto'>
<meta name='og:region' content='CA'>
<meta name='og:postal-code' content='94304'>
<meta name='og:country-name' content='USA'>

<meta property='fb:admins' content='987654321'>
<meta property='og:type' content='game.achievement'>
<meta property='og:points' content='POINTS_FOR_ACHIEVEMENT'>

<meta property='og:video' content='http://example.com/awesome.swf'>
<meta property='og:video:height' content='640'>
<meta property='og:video:width' content='385'>
<meta property='og:video:type' content='application/x-shockwave-flash'>
<meta property='og:video' content='http://example.com/html5.mp4'>
<meta property='og:video:type' content='video/mp4'>
<meta property='og:video' content='http://example.com/fallback.vid'>
<meta property='og:video:type' content='text/html'>

<meta property='og:audio' content='http://example.com/amazing.mp3'>
<meta property='og:audio:title' content='Amazing Song'>
<meta property='og:audio:artist' content='Amazing Band'>
<meta property='og:audio:album' content='Amazing Album'>
<meta property='og:audio:type' content='application/mp3'>
```

## Twitter Cards:

Twitter cards serve a similar purpose as Open Graph tags but are specific to Twitter. They enrich the shared tweets with media and additional information. For example:

### Twitter Card Type:
```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:card" content="app" />
<meta name="twitter:card" content="player" />

Twitter Username:
<meta name="twitter:creator" content="@username" /> (individual username)
<meta name="twitter:site" content="@username" /> (website's username)


Twitter Title:
<meta name="twitter:title" content="Your Title Here" />

Twitter Description:
<meta name="twitter:description" content="Your description here." />

Twitter Image:
<meta name="twitter:image" content="URL of the image" />

Twitter Image Alt Text:
<meta name="twitter:image:alt" content="Image alt text" />

Twitter URL:
<meta name="twitter:url" content="URL of the page" />

Twitter Site Name:
<meta name="twitter:site_name" content="Site Name" />

Twitter App ID (iOS/Android):
<meta name="twitter:app:id:iphone" content="AppStoreID" />
<meta name="twitter:app:id:ipad" content="AppStoreID" />
<meta name="twitter:app:id:googleplay" content="GooglePlayID" />

Twitter App Name (iOS/Android):
<meta name="twitter:app:name:iphone" content="AppName" />
<meta name="twitter:app:name:ipad" content="AppName" />
<meta name="twitter:app:name:googleplay" content="AppName" />

Twitter App URL (iOS/Android):
<meta name="twitter:app:url:iphone" content="URL" />
<meta name="twitter:app:url:ipad" content="URL" />
<meta name="twitter:app:url:googleplay" content="URL" />
```


# 4. Meta Tags for Mobile

Viewport Tag:
The viewport tag ensures that web pages are displayed correctly on mobile devices by adjusting the layout and scaling. For example:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Apple iOS Tags:
Apple iOS tags allow developers to specify how web pages should behave when viewed on iOS devices. For example:

```html
<meta name="apple-mobile-web-app-title" content="My App"> <!-- New in iOS6 -->
<meta name='apple-mobile-web-app-capable' content='yes'>
<meta name='apple-touch-fullscreen' content='yes'>
<meta name='apple-mobile-web-app-status-bar-style' content='black'>
<meta name='format-detection' content='telephone=no'>
<meta name='viewport' content='width=device-width; content='width = 320; initial-scale=1.0; maximum-scale=1.0; user-scalable=yes; target-densitydpi=160dpi'>

<link href='/apple-touch-icon.png' rel='apple-touch-icon' type='image/png'>
<link href='touch-icon-ipad.png' rel='apple-touch-icon' sizes='72x72'>
<link href='touch-icon-iphone4.png' rel='apple-touch-icon' sizes='114x114'>
<link href='/startup.png' rel='apple-touch-startup-image'>

<link href='http://github.com/images/touch-icon-iphone4.png' sizes='114x114' rel='apple-touch-icon-precomposed'>
<link href='http://github.com/images/touch-icon-ipad.png' sizes='72x72' rel='apple-touch-icon-precomposed'>
<link href='http://github.com/images/apple-touch-icon-57x57.png' sizes='57x57' rel='apple-touch-icon-precomposed'>
Internet Explorer Meta Tags
<meta http-equiv='Page-Enter' content='RevealTrans(Duration=2.0,Transition=2)'>
<meta http-equiv='Page-Exit' content='RevealTrans(Duration=3.0,Transition=12)'>
<meta name='mssmarttagspreventparsing' content='true'>
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible"/>
<meta name='msapplication-starturl' content='http://blog.reybango.com/about/'>
<meta name='msapplication-window' content='width=800;height=600'>
<meta name='msapplication-navbutton-color' content='red'>
<meta name='application-name' content='Rey Bango Front-end Developer'>
<meta name='msapplication-tooltip' content='Launch Rey Bango's Blog'>
<meta name='msapplication-task' content='name=About;action-uri=/about/;icon-uri=/images/about.ico'>
<meta name='msapplication-task' content='name=The Big List;action-uri=/the-big-list-of-javascript-css-and-html-development-tools-libraries-projects-and-books/;icon-uri=/images/list_links.ico'>
<meta name='msapplication-task' content='name=jQuery Posts;action-uri=/category/jquery/;icon-uri=/images/jquery.ico'>
<meta name='msapplication-task' content='name=Start Developing;action-uri=/category/javascript/;icon-uri=/images/script.ico'>
<meta name='msvalidate.01' content='6E3AD52DC176461A3C81DD6E98003BC9'>
<meta http-equiv='cleartype' content='on'>
```

# 5. Advanced Meta Tags

Canonical Tag:
The canonical tag helps address duplicate content issues by specifying the preferred URL of a webpage. For example:

```html
<link rel="canonical" href="https://example.com/best-summer-recipes">
```

Robots Tag:
The robots tag instructs search engine crawlers on how to handle a webpage. For example:

```html
<meta name="robots" content="index, follow">
```
Author Tag:

The author tag allows you to credit the author of the content on the webpage. For example:

```html
<meta name="author" content="John Doe">
```
Refresh Tag:
The refresh tag redirects a webpage to another URL after a specific time interval. For example:
```html
<meta http-equiv="refresh" content="5;URL=https://example.com/new-page">
```
Viewport Tag:

The viewport tag ensures that web pages are displayed correctly on mobile devices by adjusting the layout and scaling. For example:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
# 6. Custom Meta Tags
## Company/Service Meta Tags:
```html
<meta name='microid' content='mailto+http:sha1:e6058ed7fca4a1921cq91d7f1f3b8736cd3cc1g7'>
<meta name='readability-verification' content='E7aEHvVQpWc8VHDqKvaB2Z58hek2EAv2HuLuegv7'>
<meta name='google-site-verification' content='4SMIedO1X4IkYrYuhEC2VuovdQM36Xxb0btUjElqQyg'>
<meta name='ICBM' content='40.746990, -73.980537'>
<meta name='generator' content='WordPress 3.3.1'>
<meta name='norton-safeweb-site-verification' content='tz8iotmk-pkhui406y41y5bfmfxdwmaa4a-yc0hm6r0fga7s6j0j27qmgqkmc7oovihzghbzhbdjk-uiyrz438nxsjdbj3fggwgl8oq2nf4ko8gi7j4z7t78kegbidl4'>
```
## Geo Tags:

Geo tags provide geographical information about the webpage's content, which is useful for location-based services. For example:
```html
<meta name="geo.region" content="US-NY">
<meta name="geo.placename" content="New York">
```

# 7. Dublin Core Tags:

Dublin Core tags offer a standardized set of metadata elements for resource description. For example:

```html
<meta name="DC.title" content="Delicious and Refreshing Summer Recipes">
<meta name="DC.creator" content="John Doe">
<meta name="DC.subject" content="Cooking, Recipes, Summer">
```

# 8. How to Implement Meta Tags in HTML

Implementing meta tags in HTML is straightforward. Follow these steps:

Identify the relevant meta tags for your webpage's content.
Add the appropriate meta tags within the <head> section of your HTML document.
Ensure each meta tag is correctly formatted with the required attributes and content.

# 9. Best Practices for Meta Tags
To make the most of meta tags, consider the following best practices:
Keyword Optimization: Include relevant keywords that accurately represent your webpage's content.
Conciseness and Relevance: Keep the meta tag descriptions concise and directly related to the page content.
Avoiding Duplicate Tags: Ensure that each page has unique meta tags to avoid confusion for search engines.

# 10. Common Mistakes to Avoid

Overstuffing Keywords: Don't excessively add keywords in meta tags; it can lead to penalization by search engines.
Missing or Incorrect Tags: Ensure all required meta tags are present and correctly formatted to avoid missing out on potential benefits.

# 11. Impact of Meta Tags on SEO
Meta tags influence several aspects of SEO:

Search Engine Rankings: Well-optimized meta tags can improve a webpage's ranking in search engine results.
Click-Through Rates (CTR): Engaging meta tags can entice users to click on your webpage in search results.

# 12. Meta Tags and Website Performance
Apart from SEO, meta tags can also impact website performance:

Speed Optimization: Well-optimized meta tags can lead to faster loading times and better user experience.

# 13. Future of Meta Tags
As technology and search engine algorithms evolve, the significance of certain meta tags may change. Stay updated with the latest developments to maximize their effectiveness.

# 14. Conclusion
In conclusion, meta tags are essential elements of HTML that significantly impact a webpage's SEO and social media integration. By understanding and utilizing various meta tags effectively, website owners can improve their online visibility and enhance user experience.

# 15. Frequently Asked Questions (FAQs)
## Q1. What are meta tags in HTML?
A1. Meta tags are snippets of code in HTML that provide information about a webpage's content to search engines and social media platforms.

## Q2. How many meta tags should I use on a page?
A2. There is no fixed number, but focus on using relevant meta tags that accurately represent your webpage's content.

## Q3. Can meta tags guarantee a higher search engine ranking?
A3. While well-optimized meta tags can positively impact rankings, they are just one of many factors that influence search engine rankings.

## Q4. How often should I update my meta tags?
A4. Regularly review and update meta tags to reflect any changes in your webpage's content or SEO strategy.

## Q5. Are meta tags the only factor that affects SEO?
A5. No, SEO involves various on-page and off-page factors, including meta tags, content quality, backlinks, and site speed, among others.

## Read Also
Create Add to Cart Button HTML, CSS, JavaScript Tutorial.jpg
Create Add to Cart Button: HTML, CSS, JavaScript Tutorial
That’s a wrap!

Thank you for taking the time to read this article! I hope you found it informative and enjoyable. If you did, please consider sharing it with your friends and followers. Your support helps me continue creating content like this.

Stay updated with our latest content by signing up for our email newsletter! Be the first to know about new articles and exciting updates directly in your inbox. Don't miss out—subscribe today!

If you'd like to support my work directly, you can buy me a coffee . Your generosity is greatly appreciated and helps me keep bringing you high-quality articles.


Thanks!
Faraz 😊

End of the article

---------------------------------------------

Hela denna posten ovan är en kopia av blogg-posten: 
https://www.codewithfaraz.com/article/96/the-complete-list-of-meta-tags-in-html-2023

Detta om någon skulle radera den sidan i framtiden, så vill jag ändå kunna läsa informationen. 

/Jonas
