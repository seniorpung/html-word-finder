function CCell(iX,iY,iRow,iCol,iValue,oParentContainer){
    var _bActive;
    var _iRow;
    var _iCol;
    var _iValue;
    var _oRectPos;
    
    var _oCharText;

    var _oValueText;
    var _oSelect;
    var _oRight;
    var _oWrong;
    var _oHitArea;
    var _oContainer;
    
    this._init = function(iX,iY,iRow,iCol,iValue,oParentContainer){
        _bActive=false;
        _iRow = iRow;
        _iCol = iCol;
        _iValue = iValue;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('cell_bg');
        var oBg = createBitmap(oSprite);
        _oContainer.addChild(oBg);
        
        _oSelect = createBitmap(s_oSpriteLibrary.getSprite('cell_select_bg'));
        _oSelect.visible = false;
        _oContainer.addChild(_oSelect);
		
        _oCharText = new createjs.Text("A","44px "+FONT_GAME, "#6b6a69");
        _oCharText.x = oSprite.width/2;
        _oCharText.y = 56; 
        _oCharText.textAlign = "center";
        _oCharText.textBaseline = "alphabetic";
        _oContainer.addChild(_oCharText);
		
        _oValueText = new createjs.Text(iValue,"20px "+FONT_GAME, "#55bcff");
        _oValueText.x = 15;
        _oValueText.y = 70; 
        _oValueText.textAlign = "center";
        _oValueText.textBaseline = "alphabetic";
        _oContainer.addChild(_oValueText);
        
        _oRight = createBitmap(s_oSpriteLibrary.getSprite('cell_right'));
        _oRight.alpha = 0;
        _oContainer.addChild(_oRight);
        
        _oWrong = createBitmap(s_oSpriteLibrary.getSprite('cell_wrong'));
        _oWrong.alpha = 0;
        _oContainer.addChild(_oWrong);

        oSprite = s_oSpriteLibrary.getSprite('hit_area_cell');
        _oHitArea = new CGfxButton(oSprite.width/2,oSprite.height/2,oSprite,_oContainer);
        _oHitArea.addEventListener(ON_MOUSE_DOWN, this._onCellClicked, this); 

        _oRectPos = new createjs.Rectangle(oParentContainer.x+iX,
                                           oParentContainer.y+iY,
                                           oParentContainer.x+iX + oSprite.width - 20,
                                           oParentContainer.y+iY + oSprite.height - 20);
                                           
    };
    
    this.select = function(){
        _bActive=true;
        _oSelect.visible=true;
    };

    this.deselect = function(){
        _bActive=false;
        _oSelect.visible=false;
    };
    
    this.setText = function(szText){
        _oCharText.text = szText;	
    };
    
    this.showRight = function(){
        var oParent = this;
        createjs.Tween.get(_oRight).to({alpha:1}, 300).call(function(){setTimeout(function(){oParent.hideRight()}, 300);}); 
    };
    
    this.hideRight = function(){
        createjs.Tween.get(_oRight).to({alpha:0}, 300);
    };
    
    this.showWrong = function(){
        var oParent = this;
        createjs.Tween.get(_oWrong).to({alpha:1}, 300).call(function(){setTimeout(function(){oParent.hideWrong()}, 300);}); 
    };
    
    this.hideWrong = function(){
        createjs.Tween.get(_oWrong).to({alpha:0}, 300);
    };
    
    this._onCellClicked = function(){
        s_oGame.onCellSelected(this,iRow,iCol);
    };
    
    this.getText = function(){
        return _oCharText.text;
    };
    
    this.getX = function(){
        return _oContainer.x;
    };

    this.getY = function(){
        return _oContainer.y;
    };
    
    this.getRow = function(){
        return _iRow;
    };
		
    this.getCol = function(){
        return _iCol;
    };
    
    this.getRectPos = function(){
        return _oRectPos;
    };
		
    this.getValue = function(){
        return _iValue;
    };
		
    this.isActive = function(){
            return _bActive;
    };
    
    this. getContainer = function(){
        return _oContainer;
    };
    
    this._init(iX,iY,iRow,iCol,iValue,oParentContainer);
}