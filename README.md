#AjaxFileUpload
## Introduction
Rewrite the most famouse ajax uplad api: jQuery.AjaxFileUpload in [vanilla-js](http://vanilla-js.com)(pure js). You can use this api as a function and without need jQuery.js any more.

## Main File
ajax_file_upload.js

ajax_cros_file_upload_es6.js   //support webpack and used to cross-domian-upload

## Usage
```javascript
AjaxFileUpload(clickEl,{
        action: url,
        onChange: function(filename) {},
        onSubmit: function(filename) {
            return true;  //false to stop the submit
        },
        onComplete: function(filename, response) {} //response is a planed json object 'this' is the input element
    });
```
***IMPORT the input element must have a name property***
## Usage for cross-domain-upload
Client:
```javascript
  import {AjaxFileUpload} from './ajax_cros_file_upload_es6'
  //init input element as same as common
```
Server Side:
Your have to support "OPTIONS" method and Return Headers include 'Access-Control-Allow-Origin','Access-Control-Allow-Headers','Access-Control-Allow-Methods'
```php
  $method = $_SERVER['REQUEST_METHOD'];
  if($method == "OPTIONS") {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    die();
  }
```
And then when end the upload function , response a page with script:
```javascript
  window.parent.postMessage('{$msg}',"*");  //$msg is your feedback data, it is a string.
```

## Excemple for uploading pictures.
`/excemple`

##License
MIT
