var p = null;
var edproc = null;

function loadApp()
{

    p = document.getElementById('player');

    dojo.require("dojo.data.ItemFileReadStore");
       
}

function dstest()
{
    var store = new dojo.data.ItemFileReadStore({url: "./ds.json"});
    var gotContinents = function(items, request)
    {
        for (var i = 0; i < items.length; i++)
        {
           var item = items[i];
           alert("Located continent: " + store.getLabel(item));
        }
    }
    store.fetch({query: {type:"continent"}, onError: function(error, request){alert(error);}, onComplete: gotContinents});
}


