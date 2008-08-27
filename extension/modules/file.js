var EXPORTED_SYMBOLS = ["getDirFiles", "writeStringToFile", "readFileToString", "launchFile"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

// TODO exception handling

function readFileToString(file)
{
    // this is ASCII only
    var data = "";
    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                            .createInstance(Components.interfaces.nsIFileInputStream);
    var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"]
                            .createInstance(Components.interfaces.nsIScriptableInputStream);
    fstream.init(file, -1, 0, 0);
    sstream.init(fstream); 

    var str = sstream.read(4096);
    while (str.length > 0)
    {
      data += str;
      str = sstream.read(4096);
    }

    sstream.close();
    fstream.close();
    return data;
}

function writeStringToFile(string, file)
{
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                             .createInstance(Components.interfaces.nsIFileOutputStream);
    const PR_WRONLY = 0x02; // see PR_Open docs for others
    const PR_CREATE_FILE = 0x08;
    const PR_APPEND = 0x10;
    const PR_TRUNCATE = 0x20;
    
    foStream.init(file, PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, 0666, 0);
    foStream.write(string, string.length);
    foStream.close();
}

function getDirFiles(dir)
{
    var entries = dir.directoryEntries;
    var array = [];
    while(entries.hasMoreElements())
    {
      var entry = entries.getNext();
      entry.QueryInterface(Components.interfaces.nsIFile);
      array.push(entry);
    }
    return array;
}

function launchFile(path)
{
    var file = Components.classes["@mozilla.org/file/local;1"]
                 .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(path);
    file.launch();
}
