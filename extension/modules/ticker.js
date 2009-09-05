var EXPORTED_SYMBOLS = ["Ticker"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

var window = null;
    
// A general purpose timer classs
function Ticker(time, cb)
{
    if (window === null)
    {
        const mainwindow = {};
        Components.utils.import("resource://modules/mainwindow.js", mainwindow);
        window = mainwindow.getWindow();
    }
    this.timer = null;
    this.time = time;
    this.cb= cb;
}
Ticker.prototype.start = function()
{
    if (this.timer !== null)
        window.clearInterval(this.timer);
    this.timer = window.setInterval(this.cb, this.time); //TODO sort out this binding
} 
Ticker.prototype.stop = function()
{
    if (this.timer !== null)
        window.clearInterval(this.timer);
    this.timer = null;
}
Ticker.prototype.toggle = function()
{  
    if (this.timer === null)
        this.start();
    else
        this.stop();
    return this.isTicking();
}
Ticker.prototype.isTicking = function()
{  
    return (this.timer !== null);
}
