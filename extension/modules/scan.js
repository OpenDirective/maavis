var EXPORTED_SYMBOLS = ["DIRECTIONS", "SCANMODES", "setSkipFunc",  "setHighlightFunc",  "setSelectFunc", "startScan", "holdScan", "releaseScan", "resumeScan", "setCurrent"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
var skype = {};
Components.utils.import("resource://modules/skype.js", skype);
var ticker = {};
Components.utils.import("resource://modules/ticker.js", ticker);

const EVENTS = {"START":0, "TICK":1, "BUTTONDOWN":2, "BUTTONUP":3, "HOLD":1000, "RELEASE":1001};
const DIRECTIONS = {"FORWARD":0, "BACKWARD":1};
const SCANMODES = {"AUTO1SWITCH":0, "USER1SWITCH":1, "AUTO2SWITCH":2, "USER2SWITCH":3, "AUTO1SWITCHAUTOSTART":4};

function _logState(what)
{
    return; // comment out to monitor state changes
    utils.logit(what);
}

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
var g_actions = {"onHighlight":null, "onSelect":null};
var g_skipFunc = null;
var g_pauseScan = false;
var g_pendingTick = false;

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

function setCurrent(node)
{	if (g_nodes) // TODO check in list
	{	
		g_nodes.currentNode = node;
        g_pauseScan = g_actions.onHighlight(g_nodes.current());
	}
}

function _navigateAndHighlight()
{
    if (!g_pauseScan)
    {
        const prevnode = g_nodes.current();
        _navigate(DIRECTIONS.FORWARD);
        if (prevnode != g_nodes.current())
        {  // no point selecting if not changed
            g_pauseScan = g_actions.onHighlight(g_nodes.current());
            g_pendingTick = false;
            if(g_pauseScan)
            {
              _logState('pause '+((g_nodes.current())?g_nodes.current().label:'none'));
            }
        }
    }
    else
    {
        _logState('pending '+((g_nodes.current())?g_nodes.current().label:'none'));
        g_pendingTick = true;
    }
}

function _select()
{
    _logState('select '+((g_nodes.current())?g_nodes.current().label:'none'));
    if (g_pendingTick)
    {
        g_pendingTick = false; // stop any extra steps
    }

    g_actions.onSelect(g_nodes.current());
}

function _tick() 
{
    _onEvent(EVENTS.TICK, null, null);
}

var g_killTime = null;
var g_onKill = null;
function holdScan(killTime, onKill)
{
    _logState('hold '+g_pendingTick);
    g_killTime = killTime;
    g_onKill = onKill;
    _onEvent(EVENTS.HOLD, null, null);
}

function releaseScan()
{
    _onEvent(EVENTS.RELEASE, null, null);
}

function resumeScan()
{ // so can process immediatiately rather than waiting for next tick
    if (g_pauseScan)
    {
        _logState('resume '+g_pendingTick);
        g_pauseScan = false;
        if (g_pendingTick)
        {
            g_pendingTick = false;
            window.setTimeout(_tick, 1); // so done after this 'thread' returns
        }
    }
}

var g_ticker = undefined;
var g_scanMode = undefined;

function startScan(mode, rate, nodes)
{
    getContext();

    utils.logit('ScanMode: '+mode+' ScanRate: '+rate);

    g_scanMode = SCANMODES[mode];
    g_pauseScan = false;
    g_nodes = new Nodes(nodes, g_skipFunc);
    g_ticker = new ticker.Ticker(rate, _tick);
    _onEvent(EVENTS.START, null, null); // "off we go" as mole said
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
    
function onJoyButtonStatus(status, joystick, button)
{
    const direction = (status == 1) ? EVENTS.BUTTONDOWN : EVENTS.BUTTONUP;
    _onEvent(direction, joystick, button);
}
skype.setJoyStatusObserver(onJoyButtonStatus);

var g_holding = false;
var g_killTimeout = null;
function _onEvent(event, joystick, button)
{
    try
    { 
        if (event == EVENTS.HOLD)
        {
            g_holding = true;
            return;
        }
        else if (g_holding == true)
        {
             switch(event)
            {
                case EVENTS.BUTTONDOWN:
                    if(g_onKill && g_killTime)
                        g_killTimeout = window.setTimeout(g_onKill, g_killTime);  // TODO eat Button up on timeout
                    else
                        _onEvent(EVENTS.RELEASE, null, null);
                    break;
                case EVENTS.BUTTONUP:
                    if (g_killTimeout)
                    {
                        window.clearTimeout(g_killTimeout);
                        g_killTimeout = null;
                    }
                    break;
                case EVENTS.RELEASE:
                    if (g_killTimeout)
                    {
                        window.clearTimeout(g_killTimeout);
                        g_killTimeout = null;
                    }
                    g_holding = false;
                    if (g_scanMode ==SCANMODES.AUTO1SWITCHAUTOSTART)
                        g_ticker.start(); //start it again
                    break;
                default:
                    break;
            }
            return;
        }
        
        //TODO see if can make data driven
        switch(g_scanMode)
        {
            case SCANMODES.AUTO1SWITCH: // press to start, press to stop
                switch(event)
                {
                    case EVENTS.START:
                        break
                    case EVENTS.TICK:
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (g_ticker.toggle())
                        {
                            _navigateAndHighlight();
                        }
                        else
                        {
                            _select();
                        }
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.AUTO1SWITCHAUTOSTART: // press to start, press to stop
                switch(event)
                {
                    case EVENTS.START:
                        g_ticker.start()
                        _navigateAndHighlight();
                        break
                    case EVENTS.TICK:
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (g_ticker.toggle())
                        {
                            _navigateAndHighlight();
                        }
                        else
                        {
                            _select();
                        }
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.USER1SWITCH: // whilst_ switch is pressed down
                switch(event)
                {
                    case EVENTS.START:
                        break
                    case EVENTS.TICK:
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        _navigateAndHighlight();
                        g_ticker.start();
                        break;
                    case EVENTS.BUTTONUP:
                        g_ticker.stop();
                        _select();
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.AUTO2SWITCH: // switch 1 to start, switch 2 to select
                switch(event)
                {
                    case EVENTS.START:
                        break
                    case EVENTS.TICK:
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (button == 0)
                        {
                            g_ticker.start();
                             _navigateAndHighlight();
                        }
                        else if (button == 1)
                        {
                            g_ticker.stop();
                            _select();
                        }
                        break;
                    default:
                        break;
                }
                break;
            case SCANMODES.USER2SWITCH: // switch 1 to move whilst pressed, switch 2 to select
                switch(event)
                {
                    case EVENTS.START:
                        break
                    case EVENTS.TICK:
                        _navigateAndHighlight();
                        break
                    case EVENTS.BUTTONDOWN:
                        if (button == 0)
                        {
                            g_ticker.start();
                             _navigateAndHighlight();
                        }
                        else if (button == 1)
                        {
                            g_ticker.stop();
                            _select();
                        }
                        break;
                    case EVENTS.BUTTONUP:
                        if (button == 0)
                            g_ticker.stop();
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
