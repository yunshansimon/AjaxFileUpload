/**
 * Created by caoyang on 11/25/15.
 */

var AjaxFileUpload = function(el,options) {
    var settings={
        action:     "upload.php",
        bindEl:     null,               //real input element;
        onChange:   function(filename) {},
        onSubmit:   function(filename) {},
        onComplete: function(filename, response) {}
        },
        randomId = (function() {
            var id = 0;
            return function () {
                return "_AjaxFileUpload" + id++;
            };
        })();

        for(var arg in options){
            settings[arg]=options[arg];
        }
        if(el.tagName.toLowerCase() == 'input'){
            settings.bindEl=el;
            settings.bindEl.addEventListener('change',onChange);
        }

    return el;

    function onChange(e) {
        var element = e.target,
            id      = element.getAttribute('id'),
            clone   = AjaxFileUpload(element.cloneNode(true),options),
            filename = element.value.replace(/.*(\/|\\)/, ""),
            iframe = createIframe(),
            form   = createForm(iframe);
        // We append a clone since the original input will be destroyed
        element.parentNode.insertBefore(clone,element);
        settings.onChange.call(clone, filename);
        iframe.addEventListener('load',function(e){
            e.data={element: clone, form: form, filename: filename};
            onComplete(e);
        });
        form.appendChild(element);
        form.addEventListener('submit',function(e){
            e.data={element: clone, iframe: iframe, filename: filename};
            onSubmit(e);
        });
        form.submit();
    }

    function onSubmit(e) {
        var data = settings.onSubmit.call(e.data.element, e.data.filename);

        // If false cancel the submission
        if (data === false) {
            // Remove the temporary form and iframe
            e.target.remove();
            e.data.iframe.remove();
            return false;
        } else {
            // Else, append additional inputs
            for (var variable in data) {
                var inputEl=document.createElement('input');
                inputEl.setAttribute('type','hidden');
                inputEl.setAttribute('name',variable);
                inputEl.value=data[variable];
                e.target.appendChild(inputEl);
            }
        }
    }

    function onComplete (e) {
        var iframe  = e.target,
            doc      = iframe.contentWindow.document,
            response = doc.body.textContent;
        if (response) {
            response = JSON.parse(response);
        } else {
            response = {};
        }

        settings.onComplete.call(e.data.element, e.data.filename, response);
        // Remove the temporary form and iframe
        e.data.form.remove();
        iframe.remove();
    }

    function createIframe() {
        var id = randomId();
        var iframeEl=document.createElement('iframe');
        iframeEl.setAttribute('src','javascript:false;');
        iframeEl.setAttribute('name',id);
        iframeEl.setAttribute('id',id);
        iframeEl.classList.add('hidden');
        document.body.appendChild(iframeEl);
        return iframeEl;
    }

    function createForm(iframe) {
        var formEl=document.createElement('form');
        formEl.setAttribute('method','post');
        formEl.setAttribute('action',settings.action);
        formEl.setAttribute('enctype','multipart/form-data');
        formEl.setAttribute('target',iframe.name);
        formEl.classList.add('hidden');
        iframe.contentDocument.body.appendChild(formEl);
        return formEl;
    }
};