// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.
import Documents from "../resources";

var opts = {
  params: {},
  database: {
    safeID: function () { return '1';}
  }
};

function createDocColumn (docs) {
  docs = docs.map(function (doc) {
    return Documents.Doc.prototype.parse(doc);
  });

  return new Documents.AllDocs(docs, opts);
}

function createMangoIndexDocColumn (docs) {
  docs = docs.map(function (doc) {
    return Documents.MangoIndex.prototype.parse(doc);
  });

  return new Documents.MangoIndexCollection(docs, opts);
}

export default {
  createDocColumn: createDocColumn,
  createMangoIndexDocColumn: createMangoIndexDocColumn
};
