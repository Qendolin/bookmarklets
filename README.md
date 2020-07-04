# bookmarklets
 A collection of useful bookmarklets

# How to use

Generate the bookmarklets using `npm run-script build [-- {--prefix | -p} <prefix>]`. This reads all `.js` files from the `src` folder and generates files in the `out` folder. The default prefix is `Utils`. Scripts can start with a comment containing `name: <name>` to specify the name of the bookmarklet.  
**This comment has to be the first line not containing only whitespace**.  
If this comment is not present then filename of the script is used instead.
If the prefix

The bookmarklets are saved as `url`, `text` and `html` files. The text files contain the raw `javascript:` url. The html files can be imported in browsers using the bookmark import function.

The file `out/.html` contains all bookmarklets.