---
layout: post
title: "Använda HTML attribut data-* och dess DOM dataset.property"
date: 2024-12-03
category: "HTML-Code,JavaScript-Code,Programmering"
---

Info om hur man kan använda HTML attributen ```data-*``` och dess DOM property ```dataset.property```.

https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset

Dessa två artiklar förklarar saker som:

# Artikel 1, hur man når attributen
https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

## HTML syntax
The syntax is simple. Any attribute on any element whose attribute name starts with data- is a data attribute. Say you have an article and you want to store some extra information that doesn't have any visual representation. Just use data attributes for that:

```html
<article
  id="electric-cars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  …
</article>
```


## JavaScript access
To get a data attribute through the dataset object, get the property by the part of the attribute name after data- (note that dashes are converted to camel case).

```js
const article = document.querySelector("#electric-cars");
// The following would also work:
// const article = document.getElementById("electric-cars")

article.dataset.columns; // "3"
article.dataset.indexNumber; // "12314"
article.dataset.parent; // "cars"
```



# Artikel 2, dataset samt hur man sätter värdena för data-*
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset

Viktigast i denna är nog att javascript api:t för dataset är read-only, men att data-attribut i HTML är både read/write. 

Denna artikeln tar också upp hur man konverterar mellan dessa två olika.


## In HTML
The attribute name begins with data-. It can contain only letters, numbers, dashes (-), periods (.), colons (:), and underscores (_). Any ASCII capital letters (A to Z) are converted to lowercase.

## In JavaScript
The property name of a custom data attribute is the same as the HTML attribute without the data- prefix, and removes single dashes (-) for when to capitalize the property's "camel-cased" name.


## Name conversion
### dash-style to camelCase conversion
A custom data attribute name is transformed to a key for the DOMStringMap entry by the following:

1. Lowercase all ASCII capital letters (A to Z);
2. Remove the prefix data- (including the dash);
3. For any dash (U+002D) followed by an ASCII lowercase letter a to z, remove the dash and uppercase the letter;
4. Other characters (including other dashes) are left unchanged.

### camelCase to dash-style conversion
The opposite transformation, which maps a key to an attribute name, uses the following:

1. Restriction: Before transformation, a dash must not be immediately followed by an ASCII lowercase letter a to z;
2. Add the data- prefix;
3. Add a dash before any ASCII uppercase letter A to Z, then lowercase the letter;
4. Other characters are left unchanged.

For example, a data-abc-def attribute corresponds to dataset.abcDef.


## Setting values
When the attribute is set, its value is always converted to a string. For example: element.dataset.example = null is converted into data-example="null".
To remove an attribute, you can use the delete operator: delete element.dataset.keyname.

## Exempel koder
### HTML
```html
<div id="user" data-id="1234567890" data-user="carinaanand" data-date-of-birth>
  Carina Anand
</div>
```


### JavaScript
```js
const el = document.querySelector("#user");

// el.id === 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'carinaanand'
// el.dataset.dateOfBirth === ''

// set a data attribute
el.dataset.dateOfBirth = "1960-10-03";
// Result on JS: el.dataset.dateOfBirth === '1960-10-03'
// Result on HTML: <div id="user" data-id="1234567890" data-user="carinaanand" data-date-of-birth="1960-10-03">Carina Anand</div>

delete el.dataset.dateOfBirth;
// Result on JS: el.dataset.dateOfBirth === undefined
// Result on HTML: <div id="user" data-id="1234567890" data-user="carinaanand">Carina Anand</div>

if (el.dataset.someDataAttr === undefined) {
  el.dataset.someDataAttr = "mydata";
  // Result on JS: 'someDataAttr' in el.dataset === true
  // Result on HTML: <div id="user" data-id="1234567890" data-user="carinaanand" data-some-data-attr="mydata">Carina Anand</div>
}
```


Hoppas dessa artiklarna i sin helhet kan hjälpa till att förstå dataset och data-* attribut som jag nu började förstå dessa bättre själv. 


