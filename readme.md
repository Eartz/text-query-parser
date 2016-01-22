# text-query-parser

Given a string such as `"javascript articles +va -Fg"`, returns an object with substrings and flags.  

```
npm install --save text-query-parser
```

```js
var parser = require('text-query-parser');
parser("javascript articles +va -Fg");
{
    "substrings": ["javascript", "articles"],
    "flags": {
        "positives": ["v", "a"],
        "negatives": ["F", "g"]
    }
}
```

You can use spaces in substrings between double quotes:
```js
parser('"This is a single substring" multiple substrings');
{
    "substrings": ["This is a single substring", "multiple", "substrings"],
    "flags": {
        "positives": [],
        "negatives": []
    }
}
```
Escaped double quotes will be ignored.

You can use funny unicode characters in both substrings and flags:
```js
parser("Let it ❆ -☃");
{
    "substrings": ["Let", "it", "❆"],
    "flags": {
        "positives": [],
        "negatives": ["☃"]
    }
}
```

License : ISC

Author : 
camille dot hodoul at gmail dot com
@Eartz_HC