var EXPORTED_SYMBOLS = ["setAction", "Action"];

var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
var utils = {};
Components.utils.import("resource://modules/utils.js", utils);


actions = {};

function setAction(name, func, contextSetter)
{
    actions[name] = {func:func, contextSetter:contextSetter};
}

function Action(str)
{
    // TODO tighten up the error handling
    const ar = str.split("|");

    const action = ar[0];
    if (actions[action] === undefined)
    {
        utils.logit("Unknown action: '" + action + "'");
    }
    else
    {
      this._action = action;
      this._args = (ar.length > 1) ? ar[1].split(",") : [];
    }
}

Action.prototype.execute = function()
{
    if (actions[this._action] !== undefined)
    { 
        const functor = actions[this._action];
        if (functor.contextSetter !== undefined)
        { 
            functor.func.apply(functor.contextSetter(), this._args);
        }
        else
        {
            functor.func(this._args); //TODO sort this to pass sep params like above
        }
    }
}
            

