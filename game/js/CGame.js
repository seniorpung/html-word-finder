function CGame(oData){
    var _bUpdate;
    var _bNoCellSelected;
    var _iScore;
    var _iCurLevel;
    var _iTimeElaps;
    var _iCurStageX;
    var _iCurStageY;
    var _szCurWord;
    var _aWordList;
    var _aCellsSelected;
    var _aWrittenWords;
    var _aMatrixCells;
    var _aSelectableCells;
    var _oLineGfx;
    var _oLineDrawing;
    var _oAttachMatrix;
    
    var _oBg;
    var _oInterface;
    var _oEndPanel = null;
    
    this._init = function(){
        _iScore = 0;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);

        _oAttachMatrix = new createjs.Container();
        _oAttachMatrix.x = 310;
        _oAttachMatrix.y = 74;
        s_oStage.addChild(_oAttachMatrix);

        _oInterface = new CInterface();
        
        _aWordList = s_oWordListSelected.getWordList();
        _iCurLevel=1;
        
        
		
	if(s_bMobile) {
            //IE BROWSER
            if (window.navigator.msPointerEnabled) {
                s_oCanvas.addEventListener("MSPointerUp", this._onStageRelease, false);
            }else{
                s_oStage.on("pressup" , this._onStageRelease); 
            }
        }else{
            s_oStage.on("pressup" , this._onStageRelease); 
        }
		
        this._reset();

        this._createMatrix();
        this._populateMatrix();

        _bUpdate=true;
        
        $(s_oMain).trigger("start_level",1);
    };
    
    this.unload = function(){
        if(s_bMobile) {
            //IE BROWSER
            if (window.navigator.msPointerEnabled) {
                s_oCanvas.removeEventListener("MSPointerUp", this._onStageRelease, false);
            }else{
                s_oStage.off("pressup" , this._onStageRelease); 
            }
        }else{
            s_oStage.off("pressup" , this._onStageRelease); 
        }
        
        if(_oEndPanel){
            _oEndPanel.unload();
        }
        _oInterface.unload();
        
        s_oStage.removeAllChildren();  
    };
    
    this._reset = function(){
        _iTimeElaps = TIME_LEVEL;
        _aCellsSelected = new Array();
        _szCurWord = "";
        _bNoCellSelected = true;
        _iScore = 0;
        _aWrittenWords = new Array();
    };

    this._createMatrix = function(){
        var iXOffset = 0;
        var iYOffset = 0;

        _aMatrixCells = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aMatrixCells[i] = new Array();
            for(var j=0;j<NUM_COLS;j++){
                    var iRandValue = Math.floor(Math.random() * (MAX_CHAR_VALUE)) + 1;
                    var oCell = new CCell(iXOffset,iYOffset,i,j,iRandValue,_oAttachMatrix );

                    iXOffset += CELL_WIDTH + 4;

                    _aMatrixCells[i][j] = oCell;
            }
            iXOffset = 0;
            iYOffset += CELL_HEIGHT + 4;
        }
    };

    this._populateMatrix = function(){
        var iRand;
        var aConsonant = s_oWordListSelected.getConsonants();
        var aVowel     = s_oWordListSelected.getVowel();

        var iCont=0;

        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                if(iCont === 2){
                        iCont=0;
                        iRand=Math.floor(Math.random()*(aVowel.length));
                        _aMatrixCells[i][j].setText(aVowel[iRand]);
                }else{
                        iRand=Math.floor(Math.random() * (aConsonant.length));
                        _aMatrixCells[i][j].setText(aConsonant[iRand]);
                }
                iCont++;
            }
        }
    };

    this._gameOver = function(){  
        _bUpdate=false;

        playSound("gameover",1,false);
		
        var szLongest = "";
        var szBestWord = "";
        var iBestWordIndex;
        var iBestScore = 0;
			
        if(_aWrittenWords.length>0){
            //FIND LONGEST AND BEST WORD
            szLongest = _aWrittenWords[0].word;
            szBestWord= _aWrittenWords[0].score;
            iBestWordIndex = 0;

            for(var i=1;i<_aWrittenWords.length;i++){
                    if(szLongest.length<_aWrittenWords[i].word.length){
                            szLongest=_aWrittenWords[i].word;
                    }

                    if(szBestWord<_aWrittenWords[i].score){
                            szBestWord=_aWrittenWords[i].score;
                            iBestWordIndex=i;
                    }
            }

            szBestWord = _aWrittenWords[iBestWordIndex].word;
            iBestScore = _aWrittenWords[iBestWordIndex].score;
        }

	_oEndPanel = new CEndPanel();
        _oEndPanel.show(_iScore,_aWrittenWords.length,szLongest,szBestWord,iBestScore);
        
        $(s_oMain).trigger("end_level",1);
    };
    
    this.onCellSelected = function(oCellSelected,iCellSelectedRow,iCellSelectedCol){
        if(_bNoCellSelected){
            _bNoCellSelected=false;

            _aCellsSelected.push(oCellSelected);
            oCellSelected.select();
            _szCurWord += oCellSelected.getText();

            _oInterface.setWordComposing(_szCurWord);
            this.retrieveSelectableCells(iCellSelectedRow,iCellSelectedCol,oCellSelected);

            _oLineGfx = new createjs.Graphics();
            _oLineGfx.setStrokeStyle(5);
            _oLineGfx.beginStroke("rgba(0,0,0,0.7)");
            _oLineGfx.moveTo(oCellSelected.getX() + (CELL_WIDTH/2), oCellSelected.getY()+(CELL_HEIGHT/2));

            _oLineDrawing = new createjs.Shape(_oLineGfx);
            _oAttachMatrix.addChild(_oLineDrawing);


            if(s_bMobile) {
                //IE BROWSER
                if (window.navigator.msPointerEnabled) {
                        s_oCanvas.addEventListener("MSPointerMove", this._onMSStageMouseMove, false);
                }else{
                        s_oStage.addEventListener("stagemousemove" , this._onStageMouseMove); 
                }
            }else{
                    s_oStage.addEventListener("stagemousemove" , this._onStageMouseMove); 
            }
        }
    };
    
    this.onCellOver = function(oCellSelected,iCellSelectedRow,iCellSelectedCol){
        if(_bNoCellSelected){
            return;
        }

        //MAX WORD LENGTH REACHED
        if(_szCurWord.length === MAX_WORD_LENGTH){
            this._onStageRelease();
            return;
        }


        for(var k=0;k<_aSelectableCells.length;k++){
            if(_aSelectableCells[k] === oCellSelected){
                _aCellsSelected.push(oCellSelected);
                oCellSelected.select();
                
                _szCurWord += oCellSelected.getText();
                _oInterface.setWordComposing(_szCurWord);

                this.retrieveSelectableCells(iCellSelectedRow,iCellSelectedCol,oCellSelected);

                _oLineGfx.lineTo(oCellSelected.getX()+(CELL_WIDTH/2), oCellSelected.getY()+(CELL_HEIGHT/2));
                break;
            }
        }

    };
    
    this.retrieveSelectableCells = function(iCellRow,iCellCol,oCellSelected){
        _aSelectableCells = new Array();
        for(var i=(iCellRow-1);i<(iCellRow+2);i++){
                for(var j=(iCellCol-1);j<(iCellCol+2);j++){
                        if(i>-1 && i<NUM_ROWS && j>-1 && j<NUM_COLS){
                                if(_aMatrixCells[i][j].isActive() === false && _aMatrixCells[i][j] !== oCellSelected){
                                        _aSelectableCells.push(_aMatrixCells[i][j]);
                                }
                        }
                }
        }
    };
    
    this._onStageRelease = function(){
        if(_bNoCellSelected){
                return;
        }
		
	if(s_bMobile) {
            //IE BROWSER
            if (window.navigator.msPointerEnabled) {
                s_oCanvas.removeEventListener("MSPointerMove", this._onStageMouseMove, false);
            }else{
                s_oCanvas.removeEventListener( 'touchmove', this._onStageMouseMove, false );
            }
        }else{
            s_oStage.removeEventListener("stagemousemove" , s_oGame._onStageMouseMove); 
        }
        

        _bNoCellSelected=true;

        if(_oLineDrawing){
            _oLineGfx.clear();
            s_oGame._onCheckWord();
        }
    };
    
    this._clearMatrix = function() {	
        for(var i=0;i<NUM_ROWS;i++){
            for (var j = 0; j < NUM_COLS; j++) {
                _aMatrixCells[i][j].deselect();
            }
        }

        _aCellsSelected=new Array();
        _bNoCellSelected = true;
        _szCurWord = "";
        _oInterface.clearWordComposing();
    };
    
    this._displayRightOnCell = function(){
        for(var i=0;i<_aCellsSelected.length;i++){
            _aCellsSelected[i].showRight();
        }

        playSound("right",1,false);

    };
    
    this._displayWrongOnCell = function(){
        for(var i=0;i<_aCellsSelected.length;i++){
                _aCellsSelected[i].showWrong();
        }
        
        playSound("wrong",1,false);
    };
    
    this._onCheckWord = function(){
        if(_szCurWord.length<3){
            this._clearMatrix();
            return;
        }

        var iRes = binarySearch(_aWordList, _szCurWord.toLowerCase(), 0,_aWordList.length);
        if(iRes === -1){
                //WORD NOT FOUND
                _iScore += SCORE_WORD_WRONG;
                if(_iScore<0){
                    _iScore=0;
                }

                this._displayWrongOnCell();
                _oInterface.displayAnswer(_iScore);
        }else{
                //WORD FOUND
                var bFound=false;
                for(var k=0;k<_aWrittenWords.length;k++){
                    if(_aWrittenWords[k].word === _szCurWord){
                        bFound=true;
                        break;
                    }
                }
                if(bFound){
                        //THIS WORD HAS BEEN ALREADY WRITTEN
                        _iScore += SCORE_WORD_WRONG;
                        if(_iScore<0){
                            _iScore=0;
                        }

                        this._displayWrongOnCell();
                        _oInterface.displayAnswer(_iScore);
                }else{
                        var iTmpScore = 0;
                        for(var t=0;t<_aCellsSelected.length;t++){
                            iTmpScore+=_aCellsSelected[t].getValue();
                        }

                        _iScore += (_szCurWord.length*iTmpScore);
                        this._displayRightOnCell();
                        _oInterface.displayAnswer(_iScore);

                        _aWrittenWords.push({word:_szCurWord,score:(_szCurWord.length*iTmpScore)});

                        _oInterface.refreshWordWritten(_aWrittenWords);
                }
        }

        this._clearMatrix();
    };

    this.onExit = function(){
        this.unload();
        
        $(s_oMain).trigger("share_event",_iScore);
        $(s_oMain).trigger("end_session");
        s_oMain.gotoMenu();
    };
    
    this._onStageMouseMove = function(evt){
        _iCurStageX = evt.stageX/s_iScaleFactor;
        _iCurStageY = evt.stageY/s_iScaleFactor;

        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){ 
		if( _aMatrixCells[i][j].isActive() === false && pointInRectangle(_iCurStageX,_iCurStageY,_aMatrixCells[i][j].getRectPos())){
                    s_oGame.onCellOver(_aMatrixCells[i][j],_aMatrixCells[i][j].getRow(),_aMatrixCells[i][j].getCol());
                    break;
                }
            }
        }
    };
	
    this._onMSStageMouseMove = function(event){
        if (window.navigator.msPointerEnabled && !event.isPrimary){
                return;
        }

        event.preventDefault(); 
		
        _iCurStageX = parseInt(((event.pageX || event.targetTouches[0].pageX)-s_oCanvasLeft) / s_iScaleFactor);
        _iCurStageY = parseInt(((event.pageY || event.targetTouches[0].pageY)-s_oCanvasTop) / s_iScaleFactor);

        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){ 
                if( _aMatrixCells[i][j].isActive() === false && pointInRectangle(_iCurStageX,_iCurStageY,_aMatrixCells[i][j].getRectPos())){
					
                    s_oGame.onCellOver(_aMatrixCells[i][j],_aMatrixCells[i][j].getRow(),_aMatrixCells[i][j].getCol());
                    break;
                }
            }
        }
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        _iTimeElaps -= s_iTimeElaps;
            
        if(_iTimeElaps > 0){
            _oInterface.updateTime(_iTimeElaps);
        }else{
            this._gameOver();
        }  
    };


    s_oGame=this;
    
    TIME_LEVEL = oData.time_level;
    MAX_CHAR_VALUE = oData.max_char_value;
    SCORE_WORD_WRONG = oData.score_wrong;
    
    this._init();
}

var s_oGame;