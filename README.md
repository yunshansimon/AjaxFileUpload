#AjaxFileUpload
## Introduction
Rewrite the most famouse ajax uplad api: jQuery.AjaxFileUpload in [vanilla-js](http://vanilla-js.com)(pure js). You can use this api as a function and without need jQuery.js any more.

## Main File
ajax_file_upload.js

## Usage
```javascript
AjaxFileUpload(clickEl,{
        action: url,
        onChange: function(filename) {},
        onSubmit: function(filename) {
            return true;  //false to stop the submit
        },
        onComplete: function(filename, response) {} //response is a planed json object
    });
```
## Excemple for uploading pictures.
`/excemple`

##License
MIT

