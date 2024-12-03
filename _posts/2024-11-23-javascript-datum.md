---
layout: post
title: "JavaScript formatering av datum med toLocaleDateString()"
date: 2024-11-23
category: "JavaScript-Code"
---

Info om datum och tid, formatering i JavaScript (för t.ex. Api användning):
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

Hur man skulle kunna formatera datum i JavaScript format:


```js
const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

console.log(event.toLocaleDateString('de-DE', options));
// Expected output (varies according to local timezone): Donnerstag, 20. Dezember 2012

console.log(event.toLocaleDateString('sv-SE', options));
// Expected output (varies according to local timezone): torsdag 20 december 2012

console.log(event.toLocaleDateString(undefined, options));
// Expected output (varies according to local timezone and default locale): Thursday, December 20, 2012

```
 