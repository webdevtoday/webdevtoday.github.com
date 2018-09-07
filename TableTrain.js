function Train(w = 1, h = 1, obj = this){
    this.w = w;
    this.h = h;
    this.obj = obj;
    this.vv;
    this.createButtonStart(this.obj);
}

Train.prototype.create = function(){
    
    var table = document.createElement('table');
    var tr = null;
    var td = null;
    
    table.id = 'train';
    table.style.cssText = "\
        border: 1px solid black;\
        padding: 2px solid black;\
        width: 90%;\
        height: 90%;\
    ";
    
    for(var i = 1; i <= this.h + 1; i++){
        tr = document.createElement('tr');
        for(var j = 1; j <= this.w + 1; j++){
            td = document.createElement('td');
            td.style.cssText = "\
                border: 1px solid green;\
            ";
            td.style.width = '30px';// 90 / (this.w + 1) + '%';
            td.style.height = '30px'; // / (this.h + 1) + '%';
            if(j == this.w + 1 && i != this.h + 1 && i == 1){
                td.style.width = '25px';
                td.style.height = '25px';
                td.setAttribute('rowspan', this.h + 1);
                td.appendChild(this.createButtonAddTD(this.obj, i));
                tr.appendChild(td);
            }
            else if(i == this.h + 1 && j == 1){
                td.style.width = '25px';
                td.style.height = '25px';
                td.setAttribute('colspan', this.w);
                td.appendChild(this.createButtonAddTR(this.obj, j));
                tr.appendChild(td);
            }
            else if(i != this.h + 1 && j != this.w + 1){
                var div = document.createElement('div');
                div.setAttribute('class', 'num');
                td.appendChild(div);
                td.appendChild(this.obj.createButtonEdit());
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }
    
    document.body.appendChild(table);
};

Train.prototype.createButtonEdit = function(){
    var b = document.createElement('button');
    b.innerHTML = '!';
    b.onclick = function(){
        console.log('click');
        if(!$('inp')){
            var inp = document.createElement('input');
            inp.id = 'inp';
            this.before(inp);
            // console.log(this.parentNode);
        }
        else if($('inp')){
            // console.log(this.parentNode);
            // console.log($('inp').value + ' -- input');
            var text = document.createTextNode($('inp').value);
            this.parentNode.getElementsByClassName('num')[0].innerHTML = '';
            this.parentNode.getElementsByClassName('num')[0].appendChild(text);

            // console.log(this.parentNode.parentNode.cellIndex);
            if(this.parentNode.cellIndex >= 1 && this.parentNode.parentNode.rowIndex > 0){

                var nm = this.parentNode.getElementsByClassName('num')[0].innerText;

                if(this.parentNode.cellIndex == 1){
                    // записываем во вторую яч. (-25%);
                    // в третью (-20%);
                    // в остальные (-10%);
                    // console.log(this.parentNode);
                    for(var i = 2; i < this.parentNode.parentNode.children.length; i++){
                        if(i == 2){
                            nm = parseInt(nm) / 100 * 75;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        } else if(i == 3){
                            nm = parseInt(nm) / 100 * 80;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        } else if(i >= 4){
                            nm = parseInt(nm) / 100 * 90;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        }

                    }
                }
                else if(this.parentNode.cellIndex == 2){
                    // в третью (-20%);
                    // в остальные (-10%);
                    for(var i = 3; i < this.parentNode.parentNode.children.length; i++){
                        if(i == 3){
                            nm = parseInt(nm) / 100 * 80;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        } else if(i >= 4){
                            nm = parseInt(nm) / 100 * 90;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        }

                    }
                }
                else if(this.parentNode.cellIndex >= 3){
                    // в остальные (-10%);
                    for(var i = this.parentNode.cellIndex; i < this.parentNode.parentNode.children.length; i++){
                        if(i >= 4){
                            nm = parseInt(nm) / 100 * 90;
                            this
                                .parentNode
                                .parentNode
                                .children[i].getElementsByClassName('num')[0].innerText = nm;
                        }

                    }
                }
                     
            }
            this.parentNode.removeChild($('inp'));
        }
    }
    return b;
}

Train.prototype.createButtonStart = function(obj){
    var button = document.createElement('button');
    button.innerHTML = 'Создать таблицу';
    button.onclick = function(){
        obj.create();
        this.style.cssText = 'display: none';
    };
    document.body.appendChild(button);
};

Train.prototype.createButtonAddTR = function(obj, n){
    var button = document.createElement('button');
    button.innerHTML = n;
    button.onclick = function(){
        obj.addTR(obj);
    };
    return button;
};

Train.prototype.createButtonAddTD = function(obj, n){
    var button = document.createElement('button');
    button.innerHTML = n;
    button.onclick = function(){
        obj.addTD(obj, n);
    };
    return button;
};

Train.prototype.addTR = function(obj, n){
    var tr = document.createElement('tr');
    for(var i = 1; i <= $('train').children[1].children.length; i++){
        var td = document.createElement('td');
        td.style.cssText = "\
            border: 1px solid green;\
            height: 30px\
        ";
        td.style.width = '30px'; //(90 / $('train').children[1].children.length) + '%';
        var div = document.createElement('div');
        div.setAttribute('class', 'num');
        td.appendChild(div);
        td.appendChild(this.obj.createButtonEdit());
        tr.appendChild(td);
    }
    $('train').children[$('train').children.length - 2].after(tr);
    $('train')
        .firstChild
        .lastChild
        .setAttribute('rowspan', parseInt($('train').firstChild.lastChild.getAttribute('rowspan')) + 1);
};

Train.prototype.addTD = function(obj, n){
    var t_len = $('train').children.length;
    var lll_td = $('train').children[0].children.length;
    for(var i = 0; i < t_len - 1; i++){
        var td = document.createElement('td');
        td.style.cssText = "\
            border: 1px solid green;\
        ";
        if(i == t_len - 1){
            td.appendChild(obj.createButtonAddTR(obj, $('train').children[i].children.length));
        }
        var div = document.createElement('div');
        div.setAttribute('class', 'num');
        td.appendChild(div);
        td.appendChild(this.obj.createButtonEdit());
        $('train').children[i].children[lll_td - 2].after(td);
        var col_td = $('train').children[0].children.length;
        for(var j = 0; j < col_td - 1; j++){
            $('train').children[i].children[j].style.width = (90 / col_td) + '%';
        }
    }
    $('train')
        .lastChild
        .firstChild
        .setAttribute('colspan', 1 + parseInt($('train').lastChild.firstChild.getAttribute('colspan')));
};

function $(id){
    return document.getElementById(id);
}