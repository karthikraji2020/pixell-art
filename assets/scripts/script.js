function Board(el, rows, cols){
    this.el = document.querySelector(el);
    this.colorPalette = document.querySelector('.color-palette');
    this.sidenav = document.querySelector('.sidenav');
    this.features = document.querySelector('.features');
    this.themePalette = document.querySelector('.theme-palette');
    this.themePaletteRow = document.querySelector('.theme-paletteRow');
    this.themePaletteColors = ["#262626","#2f1eb0","#a06607","#1e7e34","#980a89"]
    this.rows = rows;
    this.cols = cols;
    this.activeColor = 'black';
    this.activeTheme = '#262626';
    document.querySelector('.active-color').style.backgroundColor=this.activeColor;
    this.draw = false;
    this.isClearEnabled = false;
    this.isChangeTheme = false;
    this.clearBoard();
    this.generateBoard();
    this.addColorPicker();
    this.bindEvents();

}


Board.prototype.clearBoard = function() {
  
    while (this.sidenav.hasChildNodes() ) {
        this.sidenav.removeChild(this.sidenav.firstChild);
      }
    
    while (this.el.hasChildNodes()) {
        this.el.removeChild(this.el.firstChild);
      }
   
    while (this.colorPalette.hasChildNodes()) {
        this.colorPalette.removeChild(this.colorPalette.firstChild);
      }  

    while (this.themePaletteRow.hasChildNodes()) {
        this.themePaletteRow.removeChild(this.themePaletteRow.firstChild);
      }

}
Board.prototype.generateBoard = function() {
   
    const sidenavFragment = document.createDocumentFragment();
    //el,className,textContent,faclass
    let crEle =createElement('button','toggle-grid','grid','fa-th');
    this.toggleGrid =crEle;
    sidenavFragment.appendChild(crEle);
    
    let shapeEle =createElement('button','toggle-shape','shape','fa-circle-o');
    this.toggleShape =shapeEle;
    sidenavFragment.appendChild(shapeEle);

    // let resetEle =createElement('button','resetBoard','resetBoard','fa-sync');
    let resetEle =createElement('button','resetBoard','resetBoard','fa-refresh');
    this.resetBoard =resetEle;
    sidenavFragment.appendChild(resetEle);

    let clearEle =createElement('button','clearBoard','clearBoard','fa-eraser');
    this.clearBoard =clearEle;
    sidenavFragment.appendChild(clearEle);
    
    let pickerEle =createElement('button','colorPicker','colorPicker','fa-eyedropper');
    this.togglePicker =pickerEle;
    sidenavFragment.appendChild(pickerEle);

    let downloadAsImageEle =createElement('button','DownloadAsImage','Download As Image','fa-download');
    this.downloadAsImage =downloadAsImageEle;
    sidenavFragment.appendChild(downloadAsImageEle);

    let saveEle =createElement('button','saveEle','save','fa-save');
    this.saveGrid =saveEle;
    sidenavFragment.appendChild(saveEle);

    this.sidenav.appendChild(sidenavFragment);

    const fragment = document.createDocumentFragment();
    for(var i=0; i< this.rows; i++){
        const row = document.createElement('div');
        row.classList.add('rows');
        for(var j=0; j< this.cols; j++){
            const col = document.createElement('div');
            col.classList.add('columns');
            col.dataset["cell"] = i+":"+j;
            row.appendChild(col);
        }
        fragment.appendChild(row);
    }
    this.el.appendChild(fragment);
}

Board.prototype.addColorPicker = function(){
    let paletteRowlen= (this.rows /this.cols)+1;
    const fragment = document.createDocumentFragment();
    for(var i=0; i< paletteRowlen; i++){
    const row = document.createElement('div');
    row.classList.add('colorTileRow');
        for(var j=0; j< 5; j++){
            const color = getRandomColor()
            const col = document.createElement('div');
            col.classList.add('colorTile');
            col.dataset["color"] = color;
            col.style.background = color;
            row.appendChild(col);
        }
        fragment.appendChild(row);
    }
    this.colorPalette.appendChild(fragment);
    this.addThemePalette();
}


Board.prototype.addThemePalette = function(){
    const fragment = document.createDocumentFragment();
    for (const color of this.themePaletteColors) {
        const col = document.createElement('div');
        col.classList.add('themeTile');
        col.style.background = color;
        fragment.appendChild(col);
    }
    this.themePaletteRow.appendChild(fragment);

   
}
Board.prototype.bindEvents = function(){
    this.el.addEventListener('mousedown', e => {
        this.draw = true;
        this.fill(e);
        this.isClearEnabled && this.clearBoardBtn(e);
    });

    this.el.addEventListener('mouseup', e => {
        this.draw = false;
    });

    this.el.addEventListener('mouseover', e => {
        document.querySelector('.position_row').innerText = e.target.dataset['cell'].split(':')[0];
        document.querySelector('.position_col').innerText = e.target.dataset['cell'].split(':')[1];
        this.draw && this.fill(e);
    });

    this.colorPalette.addEventListener('mousedown', e => {
        this.draw = true;
        this.fill(e);
        this.isClearEnabled && this.clearBoardBtn(e);
    });
  
    this.colorPalette.addEventListener('mouseup', e => {
        this.draw = false;
    });

    this.themePalette.addEventListener('mousedown', e => {
        this.changeTheme(e);
    });

    this.toggleGrid.addEventListener('click', e => {
       this.toggleGridBtn(e);
    });

    this.togglePicker.addEventListener('click', e => {
       this.togglePickerBtn(e);
    });

    this.toggleShape.addEventListener('click', e => {
        this.toggleShapeBtn(e);
    });

    this.downloadAsImage.addEventListener('click', e => {
        downloadImage();
    });

    this.saveGrid.addEventListener('click', e => {
        // downloadImage();
    });
    
  

    this.resetBoard.addEventListener('click', e => {
        this.resetBoardBtn(e);
    });

    this.clearBoard.addEventListener('click', e => {
        this.isClearEnabled = !this.isClearEnabled;
    });
}
Board.prototype.changeTheme = function(e) {
        this.activeTheme = e.target.style.backgroundColor;
        this.sidenav.style.backgroundColor = this.activeTheme;
        this.features.style.backgroundColor = this.activeTheme;
}

Board.prototype.toggleGridBtn = function(e){
    if(this.el.className.includes('border-none')){
        this.el.classList.remove("border-none");
    }else{
        this.el.classList.add("border-none");
    }
}
Board.prototype.togglePickerBtn = function(e){
    if(this.el.className.includes('picker')){
        this.el.classList.remove("picker");
    }else{
        this.el.classList.add("picker");
    }
}

Board.prototype.toggleShapeBtn = function(e){
    if(this.el.className.includes('shape-circle')){
        this.el.classList.remove("shape-circle");
    }else{
        this.el.classList.add("shape-circle");
    }
}

Board.prototype.resetBoardBtn = function(e){
        for(var i=0; i< this.rows; i++){
            for(var j=0; j< this.cols; j++){
                document.querySelector(`.columns[data-cell='${i}:${j}']`).style.background="";              
            }
        }
}

Board.prototype.clearBoardBtn = function(e){
    let bg= e.target.style.backgroundColor ;
    if(bg && this.isClearEnabled){
        e.target.style.backgroundColor="#fff";
    }
}

Board.prototype.fill = function(e){
    // const cell = e.target.dataset['cell'];
    const color = e.target.dataset['color'];
    color && (this.activeColor = color);
    
    // cell && (e.target.style.background = this.activeColor);
// if(cell){
    e.target.style.background = this.activeColor;
    document.querySelector('.active-color').style.backgroundColor=this.activeColor;
// }
   

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

downloadImage = function() {
    html2canvas(document.querySelector(".board-wrapper")).then(function(canvas) {
       let dataURL= canvas.toDataURL('image/jpg', 1.0);
        var a = document.createElement("a"); //Create <a>
        a.href = dataURL; //Image Base64 Goes here
        let timeInMiliSec = Date.now();
        a.download = `pixelArt_${timeInMiliSec}.jpg`; //File name Here
        a.click(); //Downloaded file
    });
  }
  

  function createElement (el,className,textContent,faClass) {
    let iele;
    const element = document.createElement(el);
    if(faClass.includes('fa-')) {
     iele = document.createElement('i');
    }
    if (el==='button') {
        element.classList.add('btn');
        element.classList.add('text-white');
        if(faClass.includes('fa-')) {
             iele.classList.add('fa');
             iele.classList.add(faClass);
             element.appendChild(iele);
        }else {
            element.textContent= textContent;
        }
    }
    element.setAttribute("title",textContent);
    element.classList.add(className);
    return element;
   
}