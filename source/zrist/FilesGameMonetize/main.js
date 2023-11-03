window._unlockingAllLevels=false;
window._allLevelsUnlocked=false;
function unlockAllLevels(){window._unlockingAllLevels=true;}
window.addEventListener("load",function(){
    var Engine=document.getElementById("gameFrame").contentWindow.Engine;
    var Game=document.getElementById("gameFrame").contentWindow.Game;
    var testMode=false;
    var adTime=3.0*1000*60;
    var adTimeB=3.0*1000*60;
    var canTriggerOnSpeedrun=false;
    var adTimerStarted=false;
    var adDateOld=null;
    Game.TEXT_MORE_GAMES="+GAMES";
    var checkAdTrigger=function(canTrigger){
        if(!adTimerStarted){
            adDateOld=Date.now();
            window._adPauseGame=function(){Game.mute();}
            window._adResumeGame=function(){
                adTime=adTimeB;
                Game.LevelAdLoader.hide(canTriggerOnSpeedrun);
                Game.unmute();
                adDateOld=Date.now();
                document.getElementById("gameFrame").contentWindow.focus();
            };
            adTimerStarted=true;
            return;
        }
        if(testMode){
            requestMidAd();
            return;
        }
        if(!canTrigger||((Date.now()-adDateOld<=adTime)))return;
        requestMidAd(); 
    }
    var requestMidAd=function(){
        if(typeof sdk!=='undefined'&&sdk.showBanner!=='undefined'){
            Game.LevelAdLoader.show();
            sdk.showBanner();
        }
    }
    Game.addAction("presstocontinue",function(){
        window._adPauseGame=function(){
            Engine.System.pause();
            Game.mute();
        };
        window._adResumeGame=function(){
            Engine.System.resume();
            Game.unmute();
            adDateOld=Date.now();
            document.getElementById("gameFrame").contentWindow.focus();
        };
        sdk.showBanner();
    });
    Game.addAction("zristcheckad",function(){checkAdTrigger(true);});
    function startGame(){
        if(!window._runGame){
            setTimeout(startGame,1.0/60.0);
            return;
        }
        Engine.System.run();
    }
    startGame();
});