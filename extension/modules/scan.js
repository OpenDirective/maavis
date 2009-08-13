var EXPORTED_SYMBOLS = ["EVENTS", "setSkipFunc",  "setHighlightFunc",  "setSelectFunc", "startScan", "onEvent"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

const EVENTS = {"BUTTONDOWN":0, "BUTTONUP":1};
const DIRECTIONS = {"FORWARD":0, "BACKWARD":1};
  
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

function startScan(nodes)
{
    g_nodes = new Nodes(nodes, g_skipFunc);
    _navigateAndHighlight();
}

function onEvent(event, joystick, button)
{
    try
    {
        if (button == 0 && event == EVENTS.BUTTONUP)
        {
            _navigateAndHighlight();
        }
        if (button == 1 && event == EVENTS.BUTTONUP)
            g_actions.onSelect(g_nodes.current());
    }
    catch (ex)
    {
        utils.logit(ex);
    }
}
