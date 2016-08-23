export const AjaxFileUpload = function(el,options) {
    let settings={
        action:     "upload.php",
        bindEl:     null,               //real input element;
        cloneEl:    null,
        fileName:   null,
        onChange:   function(filename) {},
        onSubmit:   function(filename) {},
        onComplete: function(filename, response) {},
        iframe: {}
        },
        randomId = (()=>{
            var id = 0;
            return ()=>{
                return "_AjaxFileUpload" + id++
            }
        })()

        for(let arg in options){
            settings[arg]=options[arg]
        }
        if(el.tagName.toLowerCase() == 'input'){
            settings.bindEl=el
            settings.bindEl.addEventListener('change',onChange)
        }

    return el

    function onChange(e) {
        var element = e.target,
            id      = element.getAttribute('id'),
            clone   = AjaxFileUpload(element.cloneNode(true),options),
            filename = element.value.replace(/.*(\/|\\)/, ""),
            iframe = createIframe(),
            form   = createForm(iframe)
        // We append a clone since the original input will be destroyed
        element.parentNode.insertBefore(clone,element)
        settings.onChange.call(clone, filename)
        settings.iframe=iframe
        settings.cloneEl=clone
        settings.fileName=filename
        form.appendChild(settings.bindEl)
        form.addEventListener('submit',function(e){
            onSubmit(e)
        });
        window.addEventListener('message',onComplete,{once:true})
        form.submit()
    }

    function onSubmit(e) {
        var data = settings.onSubmit.call(settings.cloneEl, settings.fileName)

        // If false cancel the submission
        if (data === false) {
            // Remove the temporary form and iframe
            settings.iframe.remove()
            return false
        } else {
            // Else, append additional inputs
            for (let variable in data) {
                let inputEl=document.createElement('input');
                inputEl.setAttribute('type','hidden');
                inputEl.setAttribute('name',variable);
                inputEl.value=data[variable];
                e.target.appendChild(inputEl);
            }
        }
    }

    function onComplete (e) {
        var response=e.data
        if (response && typeof response === 'string') {
          try{
            response = JSON.parse(response)
          }catch(err){
            response=err
          }
        }
        window.removeEventListener('message',onComplete)
        settings.onComplete.call(settings.cloneEl, settings.fileName, response);
        // Remove the temporary form and iframe
        settings.iframe.remove()
    }

    function createIframe() {
        var id = randomId()
        var iframeEl=document.createElement('iframe')
        var metaEl=document.createElement('meta')
        metaEl.setAttribute('http-equiv','Content-Security-Policy')
        metaEl.setAttribute('content',"default-src 'self' file: *;")
        iframeEl.setAttribute('src','javascript:false;')
        iframeEl.setAttribute('name',id)
        iframeEl.setAttribute('id',id)
        iframeEl.classList.add('hidden')
        iframeEl.style.height='0'
        iframeEl.style.width='0'
        document.body.appendChild(iframeEl)
        iframeEl.contentDocument.head.appendChild(metaEl)
        return iframeEl
    }

    function createForm(iframe) {
        var formEl=document.createElement('form')
        formEl.setAttribute('method','post')
        formEl.setAttribute('action',settings.action)
        formEl.setAttribute('enctype','multipart/form-data')
        formEl.setAttribute('target',iframe.name)
        formEl.classList.add('hidden')
        iframe.contentDocument.body.appendChild(formEl)
        return formEl
    }
};
