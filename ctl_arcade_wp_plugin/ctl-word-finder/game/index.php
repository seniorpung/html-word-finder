<!DOCTYPE html>
<html>
    <head>
        <title>WORD FINDER</title>
        <link rel="stylesheet" href="css/reset.css" type="text/css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="css/ios_fullscreen.css" type="text/css">
        <link rel="stylesheet" href="css/orientation_utils.css" type="text/css">
        <link rel='shortcut icon' type='image/x-icon' href='./favicon.ico' />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,minimal-ui" />
	<meta name="msapplication-tap-highlight" content="no"/>

        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="js/createjs.min.js"></script>
        <script type="text/javascript" src="js/screenfull.min.js"></script>
        <script type="text/javascript" src="js/howler.min.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        
    </head>
    <body ondragstart="return false;" ondrop="return false;" >
	<div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%"></div>
          <script>
            $(document).ready(function(){
                     var oMain = new CMain({
                                            time_level:120000,  //LEVEL TIME IN MILLISECONDS
                                            max_char_value: 5 , //MAXIMUM VALUE THAT CAN BE ASSIGNED TO A CHAR
                                            score_wrong:-10,    //AMOUNT TO DECREASE FOR WRONG WORD
                                            default_lang: "none",     //SET "none" TO SHOW LANGUAGE PANEL. SET ONE OF THESE VALUES TO START THE BOARD GAME WITH DEFAULT LANGUAGE:
                                                                //SET 0 FOR ENGLISH
                                                                //SET 1 FOR GERMAN
                                                                //SET 2 FOR SPANISH
                                                                //SET 3 FOR FRENCH
                                                                //SET 4 FOR ITALIAN
                                                                //SET 5 FOR PORTUGUESE
                                                                //EXAMPLE: default_lang:0 GAME SELECT ENGLISH
                                            audio_enable_on_startup:false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                                            fullscreen: true,          //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
                                            check_orientation:true     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                                           });
                                           
                                           
                    $(oMain).on("start_session", function(evt) {
                            if(getParamValue('ctl-arcade') === "true"){
                                    parent.__ctlArcadeStartSession();
                            }     
                    });
                        
                    $(oMain).on("end_session", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndSession();
                           }
                    });
                    
                    $(oMain).on("start_level", function(evt, iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeStartLevel({level:iLevel});
                           }
                    });

                    $(oMain).on("end_level", function(evt,iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndLevel({level:iLevel});
                           }
                    });
                    
                    $(oMain).on("save_score", function(evt,iScore, szMode) {
                            trace("save_score: "+iScore+"---"+szMode);
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeSaveScore({score:iScore, mode: szMode});
                           }
                    });
                    
                    $(oMain).on("show_interlevel_ad", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShowInterlevelAD();
                           }
                    });
                    
                    $(oMain).on("share_event", function(evt, iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
                                                                title: TEXT_SHARE_TITLE,
                                                                msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
                                                                msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});
                           }
                    });
                     
                    if(isIOS()){ 
                        setTimeout(function(){sizeHandler();},200); 
                    }else{
                        sizeHandler(); 
                    }
           });

        </script>
        
        <div class="check-fonts">
            <p class="check-font-1">test 1</p>
        </div> 
        
        <canvas id="canvas" class='ani_hack' width="1600" height="768"> </canvas>
        <div data-orientation="landscape" class="orientation-msg-container"><p class="orientation-msg-text">Please rotate your device</p></div>
        <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>
    </body>
</html>
