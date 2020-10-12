import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var express = require('express');
const dirTree = require("directory-tree");

/**
 * Serve up directory listings and files via express.
 * This is not compiled by typescript.
 */
const app = express();

app.use('/', express.static('public'));
app.get('/flows', async (req, res) => {
    const flowTree = dirTree("public/flows", { extensions: /\.flow/ });
    res.send(JSON.stringify(flowTree, null, 2));
});
app.get('/specs', async (req, res) => {
    const flowTree = dirTree("public/specs", { extensions: /\.spec/ });
    res.send(JSON.stringify(flowTree, null, 2));
});

app.listen(3000);