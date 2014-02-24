var EXPORTED_SYMBOLS = ["getDirFiles", "writeStringToFile", "readFileToString", "readFileLines", "launchFile"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

// TODO exception handling

function readFileToString(file)
{
    // this is ASCII only
    try
    { 
        var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                                .createInstance(Components.interfaces.nsIFileInputStream);
        var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"]
                                .createInstance(Components.interfaces.nsIScriptableInputStream);
        var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"]
                                .getService(Components.interfaces.nsIUTF8ConverterService);

        fstream.init(file, -1, 0, 0);
        sstream.init(fstream);
    }
    catch(err)
    {
        utils.logit(file.path+' '+err);
        return "";
    }

    var data = "";
    var str = sstream.read(4096);
    while (str.length > 0)
    {
      data += utf8Converter.convertURISpecToUTF8 (str, "UTF-8");
      str = sstream.read(4096);
    }

    sstream.close();
    fstream.close();
    return data;
}

function writeStringToFile(string, file)
{
    const PR_WRONLY = 0x02; // see PR_Open docs for others
    const PR_CREATE_FILE = 0x08;
    const PR_APPEND = 0x10;
    const PR_TRUNCATE = 0x20;
    
    try
    {
        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                                 .createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(file, PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, 0666, 0);
        foStream.write(string, string.length);
        foStream.close();
    }
    catch(err)
    {
        utils.logit(err);
    }
}

function getDirFiles(dir, reMatch)
{
    var entries = dir.directoryEntries;
    var array = [];
    while(entries.hasMoreElements())
    {
        var entry = entries.getNext();
        entry.QueryInterface(Components.interfaces.nsIFile);
        if (!reMatch || reMatch.test(entry.leafName))
        {
            array.push(entry);
        }
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

function readFileLines(file)
{
    var fis = Components.classes["@mozilla.org/network/file-input-stream;1"]
                            .createInstance(Components.interfaces.nsIFileInputStream);
    try
    {
        fis.init(file, -1, 0, 0);
    } 
    catch (e)
    {
        return [];
    }
    
    var charset = /* Need to find out what the character encoding is. Using UTF-8 for this example: */ "UTF-8";
    var is = Components.classes["@mozilla.org/intl/converter-input-stream;1"]
                       .createInstance(Components.interfaces.nsIConverterInputStream);
    is.init(fis, charset, 1024, 0xFFFD);

    if (is instanceof Components.interfaces.nsIUnicharLineInputStream) {
      var lines = [];
      var line = {};
      var cont;
      do {
        cont = is.readLine(line);
//        if (cont)
        {
            var strLine = utils.trim(line.value);
            if (strLine.length)
                lines.push(strLine);
        }
      } while (cont);
    }
    is.close();
    fis.close();
    return lines;
}