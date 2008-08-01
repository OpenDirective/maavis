if (!this.Utils) {

// Create object only if one does not already exist. We create the
// object in a closure to avoid creating global variables.

    var Utils = function () {
        // private stuff
        var PATH_SEP = '/';

        function getPathFolder (f)
        {
            var arr = f.split(PATH_SEP);
            var folder = arr.slice(0,-1).join(PATH_SEP);
            return folder;
        }

        function makeAbsFileURI (file)
        // given any URI make an absolute file ref from current location
        {
            path = document.location.pathname;   // we seem to be ok with the extra leading though it would seem not good for WIN paths with drive letter.
            var dir = getPathFolder(path);
            var uri = 'file://' + dir + PATH_SEP + file;
            return uri
        } 

        // public inteface returned as an object 
        return { 
            PATH_SEP: function() { return PATH_SEP; }(),
            getPathFolder: getPathFolder,
            makeAbsFileURI: makeAbsFileURI
        }; // object literal
    }(); //function
} // if