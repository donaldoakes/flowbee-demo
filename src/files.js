import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var express = require('express');
const dirTree = require("directory-tree");

/**
 * Serve up directory listings and files via express.
 * This is not compiled by typescript.
 */
const app = express();

express.static.mime.define({'application/json': ['desc']});
express.static.mime.define({'application/yaml': ['flow']});

app.use('/', express.static('public'));

const trimPath = item => {
    if (item.path.startsWith('public/')) {
        item.path = item.path.substring(6);
    }
};

app.get('/flows', async (req, res) => {
    const flowTree = dirTree("public/flows", {
        extensions: /\.flow/,
        normalizePath: true
    }, trimPath);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(flowTree, null, 2));
});
app.get('/descriptors', async (req, res) => {
    const flowTree = dirTree("public/spedescriptorscs", {
        extensions: /\.desc/,
        normalizePath: true
    }, trimPath);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(flowTree, null, 2));
});

app.listen(8080);