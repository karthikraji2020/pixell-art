function PixllArt(el, rows, cols){
    this.el = document.querySelector(el);
    this.colorPalette = document.querySelector('.color-palette');
    this.sidenav = document.querySelector('.sidenav');
    this.features = document.querySelector('.features');
    this.themePalette = document.querySelector('.theme-palette');
    this.themePaletteRow = document.querySelector('.theme-paletteRow');
    this.navbarToggle = document.querySelector('.navbarToggle');
    this.themePaletteColors = ["#2f1eb0","#262626","#1e7e34","#980a89","#a06607"]
    this.rows = rows;
    this.cols = cols;
    this.activeColor = '#000';
    this.activeTheme = '#2f1eb0';
    this.activeGrid = '';
    this.selectedPixels=[];
    this.savedGrids=[];
    document.querySelector('.active-color').style.backgroundColor=this.activeColor;
    this.gridRowPos =document.querySelector('.grid_row');
    this.gridColPos =document.querySelector('.grid_col');
    this.size_sliderVal =document.querySelector('#size_slider');
    this.count_sliderVal =document.querySelector('#count_slider');
    this.saveGridForm = document.querySelector('#saveGridForm');
    this.savedGridsList=  document.querySelector('#savedGridsList');
    this.draw = false;
    this.isClearEnabled = false;
    this.isChangeTheme = false;
    this.clearBoard();
    this.generateBoard();
    this.addColorPicker();
    this.bindEvents();
    this.renderGrid(this.activeGrid='pixllArt');

    if(localStorage.getItem('Pixll-Art-Theme')) {
        let bg = JSON.parse(localStorage.getItem('Pixll-Art-Theme'));
        var style = getComputedStyle(document.body);
        document.documentElement.style.setProperty('--bg-primary',bg);
    } else {
        var style = getComputedStyle(document.body);
        document.documentElement.style.setProperty('--bg-primary', this.activeTheme);
    }

      this.savedGrids.push({
        "id": 1,
        "gridName": "pixllArt",
        "savedPixels":[]
      })

      localStorage.setItem(this.savedGrids[0].gridName, JSON.stringify(this.savedGrids[0]));
     this.renderSavedGrid();
}

PixllArt.prototype.renderSavedGrid= function () {
  this.resetBoardBtn('');
  this.savedGridsList.innerHTML="";
    for(let grid of this.savedGrids){
        let gridNameEle = document.createElement('div');
        gridNameEle.dataset["savedGrid"]=`${grid.id}`;
        gridNameEle.textContent=`${grid.id} . ${grid.gridName}`;
        this.savedGridsList.appendChild(gridNameEle);
    }
}

PixllArt.prototype.clearBoard = function() {
    this.sidenav.innerHTML="";
    this.el.innerHTML="";
    this.colorPalette.innerHTML="";
    this.themePaletteRow.innerHTML="";
    this.savedGridsList.innerHTML="";

}
PixllArt.prototype.generateBoard = function() {
   
    const sidenavFragment = document.createDocumentFragment();
    //createElement (el,className,textContent,faclass)
    let logoEle =createElement('b','pixll-art-logo','PixllArt','');
    sidenavFragment.appendChild(logoEle);

    let crEle =createElement('button','toggle-grid','Grid','fa-th');
    this.toggleGrid =crEle;
    sidenavFragment.appendChild(crEle);
    
    let shapeEle =createElement('button','toggle-shape','Shape','fa-circle-o');
    this.toggleShape =shapeEle;
    sidenavFragment.appendChild(shapeEle);

    let resetEle =createElement('button','resetBoard','ResetBoard','fa-refresh');
    this.resetBoard =resetEle;
    sidenavFragment.appendChild(resetEle);

    let clearEle =createElement('button','clearBoard','ClearBoard','fa-eraser');
    this.clearBoard =clearEle;
    sidenavFragment.appendChild(clearEle);
    
    let pickerEle =createElement('button','colorPicker','ColorPicker','fa-eyedropper');
    this.togglePicker =pickerEle;
    sidenavFragment.appendChild(pickerEle);

    let downloadAsImageEle =createElement('button','DownloadAsImage','Download','fa-download');
    this.downloadAsImage =downloadAsImageEle;
    sidenavFragment.appendChild(downloadAsImageEle);

    let saveEle =createElement('button','saveEle','Save','fa-save');
    this.saveGrid =saveEle;
    sidenavFragment.appendChild(saveEle);

    let navbarToggleEle =createElement('button','navbarToggle','','fa-angle-double-right');
    this.navbarToggle =navbarToggleEle;
    sidenavFragment.appendChild(navbarToggleEle);

    let socialEle =createSocialElement();
    this.socialEle =socialEle;
    sidenavFragment.appendChild(socialEle);

    this.sidenav.appendChild(sidenavFragment);

    const fragment = document.createDocumentFragment();
    for(let i=0; i< this.rows; i++){
        const row = document.createElement('div');
        row.classList.add('rows');
        for(let j=0; j< this.cols; j++){
            const col = document.createElement('div');
            col.classList.add('columns');
            col.dataset["cell"] = i+":"+j;
            row.appendChild(col);
        }
        fragment.appendChild(row);
    }
    this.el.appendChild(fragment);
}

PixllArt.prototype.addColorPicker = function(){
    let paletteRowlen= (this.rows /this.cols)+1;
    const fragment = document.createDocumentFragment();
    for(let i=0; i< paletteRowlen; i++){
    const row = document.createElement('div');
    row.classList.add('colorTileRow');
        for(let j=0; j< 5; j++){
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

PixllArt.prototype.addThemePalette = function(){
    const fragment = document.createDocumentFragment();
    for (const color of this.themePaletteColors) {
        const col = document.createElement('div');
        col.classList.add('themeTile');
        col.style.background = color;
        fragment.appendChild(col);
    }
    this.themePaletteRow.appendChild(fragment);
}
PixllArt.prototype.bindEvents = function(){
    this.el.addEventListener('mousedown', e => {
        this.draw = true;
            (!this.el.className.includes('picker')) && !this.isClearEnabled &&this.fill(e);
        this.isClearEnabled && this.clearBoardBtn(e);
    });

    this.el.addEventListener('mouseup', e => {
        this.draw = false;
        if(this.el.className.includes('picker')){
            const color = e.target.style.backgroundColor;
            if(color){
                this.activeColor = color;
                document.querySelector('.active-color').style.backgroundColor=this.activeColor;
            }
        }
    });

    this.el.addEventListener('mouseover', e => {
        document.querySelector('.position_row').innerText = e.target.dataset['cell'].split(':')[0];
        document.querySelector('.position_col').innerText = e.target.dataset['cell'].split(':')[1];
        // this.draw && this.fill(e);
        this.draw && (!this.el.className.includes('picker')) && this.fill(e);
    });

    this.colorPalette.addEventListener('mousedown', e => {
        this.draw = true;
        this.fill(e);
        // (!this.el.className.includes('picker')) && this.fill(e);
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

    this.navbarToggle.addEventListener('click', e => {
        debugger;
     this.navbarToggleBtn();    
        // if(e.target.firstChild.className.includes('double-right')){
        //     e.target.firstChild.classList.add('fa-angle-double-left');
        // } else {
        //     e.target.firstChild.classList.add('fa-angle-double-right');
        // }
    });

    this.toggleShape.addEventListener('click', e => {
        this.toggleShapeBtn(e);
    });

    this.downloadAsImage.addEventListener('click', e => {
        downloadImage();
    });

    this.resetBoard.addEventListener('click', e => {
        this.resetBoardBtn(this.activeGrid);
    });

    this.clearBoard.addEventListener('click', e => {
        this.isClearEnabled = !this.isClearEnabled;
    });

    this.size_sliderVal.addEventListener('change', (e) => {
        this.sizeValueChange(e);
    });
    
    this.saveGridForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveAsGrid();
    });
    
    this.count_sliderVal.addEventListener('change',(e)=>{
      let rowValue =e.target.value;
      let colValue =e.target.value;
      this.gridRowPos.innerText = rowValue;
      this.gridColPos.innerText = colValue;
      new PixllArt("#board", rowValue, colValue); 
    });

    this.savedGridsList.addEventListener('click',(e)=>{
      this.resetBoardBtn('');
        let selectedObj;
        let currentNode = e.target.dataset['savedGrid'];
        if(currentNode!== undefined && currentNode !=='' ) {
            selectedObj=  this.savedGrids.filter((x)=> { return x.id == currentNode});
            this.activeGrid =selectedObj[0].gridName;
           this.renderGrid(this.activeGrid);
        }
    });

    document.getElementById("pixell-art-colorPicker").addEventListener("change", e=>{
        this.onChangeColor(e);
    });
    
}

PixllArt.prototype.changeTheme = function(e) {
        this.activeTheme = e.target.style.backgroundColor;
        var style = getComputedStyle(document.body);
        document.documentElement.style.setProperty('--bg-primary', this.activeTheme);
        localStorage.setItem('Pixll-Art-Theme',JSON.stringify(this.activeTheme));
}

PixllArt.prototype.toggleGridBtn = function(e){
    this.el.classList.toggle("border-none");
}
PixllArt.prototype.togglePickerBtn = function(e){
    this.el.classList.toggle("picker");
}
PixllArt.prototype.navbarToggleBtn = function(){
    this.sidenav.classList.toggle("title-label-hide");
}

PixllArt.prototype.toggleShapeBtn = function(e){
    this.el.classList.toggle("shape-circle");
}

PixllArt.prototype.resetBoardBtn = function(gridName){
        for(let i=0; i< this.rows; i++){
            for(let j=0; j< this.cols; j++){
                document.querySelector(`.columns[data-cell='${i}:${j}']`).style.background="";              
            }
        }
        (localStorage.getItem(gridName))&&(localStorage.removeItem(gridName))
}

PixllArt.prototype.clearBoardBtn = function(e){
    let bg= e.target.style.backgroundColor ;
    if(bg && this.isClearEnabled){
        e.target.style.backgroundColor="#fff";
        console.log( this.selectedPixels.length);
        this.selectedPixels.splice(this.selectedPixels.findIndex(item => item.color !== e.target.dataset['cell']), 1)
        console.log( this.selectedPixels.length);
    }
}

PixllArt.prototype.fill = function(e){
    const cell = e.target.dataset['cell'];
    const color = e.target.dataset['color'];
    color && (this.activeColor = color);
    
    // cell && (e.target.style.background = this.activeColor);
// if(cell){
    e.target.style.background = this.activeColor;
    document.getElementById("pixell-art-colorPicker").value=this.activeColor;
    if(cell !== undefined && !this.isClearEnabled) {
        let currentObj= {
            color:e.target.style.background,
            position:cell
        }
        this.selectedPixels.push(currentObj)
    }
    document.querySelector('.active-color').style.backgroundColor=this.activeColor;
// }

   
}
PixllArt.prototype.renderGrid =function (gridName) {

      if(localStorage.getItem(gridName)){
        this.selectedPixels = JSON.parse(localStorage.getItem(gridName)).savedPixels;
        let index=-1;
        let animationIntervalFlag = setInterval(() => {
            ++index;
             let iterator=this.selectedPixels[index];
            if(index >=this.selectedPixels.length ){
                clearInterval(animationIntervalFlag);
             } else {
               if(iterator.position !==undefined) {
                   document.querySelector(`.columns[data-cell='${iterator.position}']`).style.backgroundColor=`${iterator.color}`;
               }
            }
        }, 20);
      }
      this.gridRowPos.innerText = this.rows;
      this.gridColPos.innerText = this.cols;
      document.querySelector('.boardSize').innerText =this.size_sliderVal.value+'%'; 
}

PixllArt.prototype.saveAsGrid =function () {
    let gridName = document.querySelector('#gridName').value;
    if(gridName) {
        let saveFrameObj = {
            id: this.savedGrids.length+1,
            gridName,
            savedPixels:this.selectedPixels
        };
        this.savedGrids.push(saveFrameObj);
        this.renderSavedGrid();
        localStorage.setItem(gridName, JSON.stringify(saveFrameObj));
        document.querySelector('#gridName').value='';
        document.querySelector('.close').click();
    }
}

PixllArt.prototype.onChangeColor = function(e){
    this.activeColor = e.target.value;
    document.querySelector('.active-color').style.backgroundColor=this.activeColor;
  
} 

PixllArt.prototype.sizeValueChange = function(e){
    let value =e.target.value;
    this.el.style.height =value+'%';
    this.el.style.width = value+'%';
    document.querySelector('.boardSize').innerText =value+'%'; 
  }
        function createSocialElement () {
    const element = document.createElement('div');
    element.classList.add('text-white');
    // element.classList.add('sidenav-item');
    let socialIcons =['fa-linkedin','fa-github','fa-codepen']
    for (const iterator of socialIcons) {
      let iele = document.createElement('a');
          iele.classList.add('fa');
          iele.classList.add(iterator);
          iele.classList.add('sidenav-item');
          iele.classList.add('social-media');
          iele.classList.add('mx-1');
          iele.setAttribute('target','_blank');
          if(iterator==='fa-github'){
            iele.setAttribute('href','https://github.com/karthikraji2020');
          }
          if(iterator==='fa-linkedin'){
            iele.setAttribute('href','https://www.linkedin.com/in/karthik-r-a70001194');
          }
          // if(iterator==='fa-instagram'){
          //   iele.setAttribute('href','https://www.instagram.com/karthik__raji');
          // }
          if(iterator==='fa-codepen'){
            iele.setAttribute('href','https://codepen.io/karthikraji2020');
          }
          element.appendChild(iele);
        }
    return element;


        }
      function createElement (el,className,textContent,faClass) {
    let iele;
    const element = document.createElement('div');
       (className.includes('logo')) && (element.textContent= textContent)
    
    if(faClass.includes('fa-')) {
     iele = document.createElement('i');
    }
    // if (el==='button') {
        // element.classList.add('btn');
        // element.classList.add('text-left');
        element.classList.add('text-white');
        if(faClass.includes('fa-')) {
             iele.classList.add('fa');
             iele.classList.add(faClass);
             element.appendChild(iele);
             if(faClass==='fa-save'){
                element.setAttribute("href","saveGridModal");
                element.dataset["toggle"]="modal";
                element.dataset["target"]="#saveGridModal";
             }
             if(!faClass.includes('angle')) {
             let labelEle = document.createElement('span')
             labelEle.classList.add('title-label');
             labelEle.textContent= textContent;
             element.append(labelEle);}
        }else {
            element.textContent= textContent;
        }
    // }
    element.setAttribute("title",textContent);
    element.classList.add(className);
    if(!className.includes('logo')){
        element.classList.add('sidenav-item');
    }
  
    return element;
}

downloadImage = function() {
    html2canvas(document.querySelector("#board")).then(function(canvas) {
       let dataURL= canvas.toDataURL('image/jpg', 1.0);
        let a = document.createElement("a"); //Create <a>
        a.href = dataURL; //Image Base64 Goes here
        let timeInMiliSec = Date.now();
        a.download = `pixelArt${timeInMiliSec}.jpg`; //File name Here
        a.click(); //Downloaded file
    });
  }

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

