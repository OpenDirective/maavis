var EXPORTED_SYMBOLS = ["EVENTS", "DIRECTIONS", "SCANMODES", "setSkipFunc",  "setHighlightFunc",  "setSelectFunc", "startScan", "onEvent"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const config = {};
Components.utils.import("resource://modules/config.js", config);

const g_config = config.regetUserConfig();

const EVENTS = {"BUTTONDOWN":0, "BUTTONUP":1};
const DIRECTIONS = {"FORWARD":0, "BACKWARD":1};
const SCANMODES = {"AUTO1SWITCH":0, "USER1SWITCH":1, "AUTO2SWITCH":2, "USER2SWITCH":3};

function Nodes(nodes, skipFunc) // double linked list with nextSibling & previousSibling ala DOM nodes
{
    this.firstNode = nodes;
    this.skipFunc = skipFunc;

    var aNode = nodes;
    while (aNode.nextSibling)
        aNode = aNode.nextSibling;
    this.lastNode = aNode;

    this.currentNode = null;
}
Nodes.prototype.current = function ()
{
    return this.currentNode;
}
Nodes.prototype.previous = function()
{
    var node = this.currentNode;
    do
    {  
        if (!node)
            node = this.lastNode;
        else
            node = node.previousSibling;
    } while (!node || (this.skipFunc && this.skipFunc(node))) // TODO could add infinite loop detection
    this.currentNode = node
    return node;
}
Nodes.prototype.next = function()
{
    var node = this.currentNode;
    do
    {
        if (!node)
            node = this.firstNode;
        else
            node = node.nextSibling;
    } while (!node || (this.skipFunc && this.skipFunc(node))) // TODO could add infinite loop detection
    this.currentNode = node
    return node;
}
    
var g_nodes = null;
g_actions = {"onHighlight":null, "onSelect":null};
g_skipFunc = null;

function setSkipFunc(skipFunc)
{
    g_skipFunc = skipFunc;
}

function setHighlightFunc(onHighlight)
{
    g_actions.onHighlight = onHighlight;
}

function setSelectFunc(onSelect)
{
    g_actions.onSelect = onSelect;
}

function _navigate(direction)
{
    const func =  (direction == DIRECTIONS.FORWARD) ? g_nodes.next : g_nodes.previous;
    func.call(g_nodes);
}

function _navigateAndHighlight()
{
    _navigate(DIRECTIONS.FORWARD);
    g_actions.onHighlight(g_nodes.current());
}

function _select()
{
    g_actions.onSelect(g_nodes.current());
}

function startScan(nodes)
{
    g_nodes = new Nodes(nodes, g_skipFunc);
    _navigateAndHighlight();
}

var window = null;
function getContext()
{
    if (window === null)
    {
        const mainwindow = {};
        Components.utils.import("resource://modules/mainwindow.js", mainwindow);
        window = mainwindow.getWindow();// so in scope chain
    }
}
    
// A general purpose timer classs
function Timer(time, cb)
{
    this.timer = null;
    this.time = time;
    this.cb= cb;
}
Timer.prototype.start = function()
{
    if (this.timer !== null)
        window.clearInterval(this.timer);
    this.timer = window.setInterval(this.cb, this.time); //TODO sort out this binding
} 
Timer.prototype.stop = function()
{
    if (this.timer !== null)
        window.clearInterval(this.timer);
    this.timer = null;
}
Timer.prototype.toggle = function()
{  
    if (this.timer === null)
        this.start();
    else
        this.stop();
    return (this.timer !== null);
}


g_timer = new Timer(g_config.scanRate, function() {onEvent("AUTOSCANTIMEOUT", null, null);});

g_scanMode = SCANMODES[g_config.scanMode];
utils.logit('ScanMode is '+g_config.scanMode+ ' ' +g_scanMode);
function onEvent(event, joystick, button)
{
    try
    {  
        getContext();
        //TODO see if can make data driven
        switch(g_scanMode)
        {
            case SCANMODES.AUTO1SWITCH:
                switch(event)
                {
                    case "AUTOSCANTIMEOUT":
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (!g_timer.toggle())
                            _select();
                    break;
                    default:
                        break;
                }
                break;
            case SCANMODES.USER1SWITCH:
                switch(event)
                {
                    case "AUTOSCANTIMEOUT":
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        g_timer.start();
                        break;
                    case EVENTS.BUTTONUP:
                        g_timer.stop();
                        _select();
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.AUTO2SWITCH:
                switch(event)
                {
                    case "AUTOSCANTIMEOUT":
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (button == 0)
                            g_timer.start();
                        else if (button == 1)
                        {
                            g_timer.stop();
                            _select();
                        }
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.USER2SWITCH:
                switch(event)
                {
                    case "AUTOSCANTIMEOUT":
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (button == 0)
                            g_timer.start();
                        else if (button == 1)
                        {
                            g_timer.stop();
                            _select();
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                break
        }
   }
    catch (ex)
    {
        utils.logit(ex);
    }
}
