'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const probe = require('kube-probe');

const fruits = require('./lib/api/fruits');
const db = require('./lib/db');
const validations = require('./lib/validations');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/fruits/:id', fruits.find);
app.get('/api/fruits', fruits.findAll);
app.post('/api/fruits', validations.validateCreate, fruits.create);
app.put('/api/fruits/:id', validations.validateUpdate, fruits.update);
app.delete('/api/fruits/:id', fruits.remove);

// Add a health check
probe(app);

db.init().then((result) => {
  console.log('Database init\'d');
}).catch((err) => {
  console.log(err);
});

module.exports = app;
