var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
Components.utils.import("resource://modules/utils.js");

var EXPORTED_SYMBOLS = ["setAction", "Action"];

actions = {};

function setAction(name, func, context)
{
    actions[name] = {func:func, context:context};
}

function Action(str)
{
  // TODO tighten up the error handling
  ar = str.split("|");
  this._action = ar[0].toLowerCase();
  this._args = ar[1].split(",");
}

Action.prototype.execute = function()
{
    if (actions[this._action] !== undefined)
    {
        const functor = actions[this._action];
        if (functor.context !== undefined)
            functor.func.apply(functor.context, this._args);
        else
            functor.func(this._args); //TODO sort this to pass sep params like above
    }
}
            

