const express = require('express');
const cors = require('cors');
const app = express();
const dynamic = require('angular-dynamic-number');
app.use(dynamic)

app.use(cors());
