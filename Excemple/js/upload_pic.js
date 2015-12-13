/**
 * Created by caoyang on 11/25/15.
 */
function applyAjaxFileUpload(url,clickEl,maxLoad,mediaArray) {
    var download_panel=clickEl.parentNode;
    var display_style=download_panel.style.display;

    AjaxFileUpload(clickEl,{
        action: url,
        onChange: function(filename) {
            // Create a span element to notify the user of an upload in progress
            var clone=create_img_node();
            this.removeEventListener('click');
            clone.classList.add('on_upload');
            var downloadEl=this.parentNode;
            downloadEl.parentNode.insertBefore(clone,downloadEl);
        },
        onSubmit: function(filename) {
            return true;
        },
        onComplete: function(filename, response) {
            var new_div=this.parentNode.previousElementSibling;
            new_div.classList.remove('on_upload');
            if (response.code != 100) {
                new_div.remove();
                applyAjaxFileUpload(url,this);
                show_tips(response.result,2000,false);
            }else{
                var new_img=new_div.querySelector(".oss");
                new_img.setAttribute('src',response.result);
                mediaArray.push(response.result);
                new_img.addEventListener('load',function(e){
                    fit_img(e.target);
                });
                if(this.parentNode.parentNode.childNodes>maxLoad) {
                    download_panel.style.display='none';
                };
            }
        }
    });

    function create_img_node(){
        var imgDiv='<div class="img_shower"> <div class="img_clip"> <img class="oss" img-src="" src="../../common/img/shape-o@2x.png"/> </div> <a class="img_delete_btn" onclick="del_upload_img(this);"> <img src="../../common/img/chazi@2x.png"/> </a> </div>';
        return parseElFromString(imgDiv);
    }

    function del_upload_img(el){
        var img=el.previousElementSibling.firstElementChild;
        var path=img.getAttribute('img-src');
        mediaArray.splice(mediaArray.indexOf(path),1);
        el.parentNode.remove();
        download_panel.style.display=display_style;
    }

    function fit_img(img){
    var fit_length=img.parentElement.offsetHeight;
    if(img.getAttribute('fitted')!='1'){
        if(img.clientHeight>img.clientWidth){
            img.style.width=fit_length + 'px';
        }else{
            img.style.height=fit_length + 'px';
        }
        img.setAttribute('fitted','1');
    }
}
}

