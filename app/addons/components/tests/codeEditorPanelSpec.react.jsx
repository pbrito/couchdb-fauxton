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
import ReactComponents from "../react-components.react";
import utils from "../../../../test/mocha/testUtils";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";

var assert = utils.assert;
var codeNoNewlines = 'function (doc) {emit(doc._id, 1);}';
var code = 'function (doc) {\n  emit(doc._id, 1);\n}';

describe('CodeEditorPanel', function () {

  describe('Doc icon', function () {
    it('hidden by default', function () {
      var container = document.createElement('div');
      var codeEditorEl = TestUtils.renderIntoDocument(
        <ReactComponents.CodeEditorPanel defaultCode={code} />,
        container
      );
      assert.equal($(ReactDOM.findDOMNode(codeEditorEl)).find('.icon-question-sign').length, 0);
    });
    it('hidden by default', function () {
      var container = document.createElement('div');
      var codeEditorEl = TestUtils.renderIntoDocument(
        <ReactComponents.CodeEditorPanel defaultCode={code} docLink="http://link.com" />,
        container
      );
      assert.equal($(ReactDOM.findDOMNode(codeEditorEl)).find('.icon-question-sign').length, 1);
    });
  });

  describe('Zen Mode', function () {
    it('shows zen mode by default', function () {
      var container = document.createElement('div');
      var codeEditorEl = TestUtils.renderIntoDocument(
        <ReactComponents.CodeEditorPanel defaultCode={code} />,
        container
      );
      assert.equal($(ReactDOM.findDOMNode(codeEditorEl)).find('.zen-editor-icon').length, 1);
    });

    it('omits zen mode if explicitly turned off', function () {
      var container = document.createElement('div');
      var codeEditorEl = TestUtils.renderIntoDocument(
        <ReactComponents.CodeEditor defaultCode={code} allowZenMode={false} />,
        container
      );
      assert.equal($(ReactDOM.findDOMNode(codeEditorEl)).find('.zen-editor-icon').length, 0);
    });
  });

  describe('Beautify', function () {
    it('confirm clicking beautify actually works within context of component', function () {
      var container = document.createElement('div');
      var codeEditorEl = TestUtils.renderIntoDocument(
        <ReactComponents.CodeEditorPanel
          defaultCode={codeNoNewlines}
        />,
        container
      );

      // confirm there are no newlines in the code at this point
      assert.equal(codeEditorEl.getValue().match(/\n/g), null);

      TestUtils.Simulate.click($(ReactDOM.findDOMNode(codeEditorEl)).find('.beautify')[0]);

      // now confirm newlines are found
      assert.equal(codeEditorEl.getValue().match(/\n/g).length, 2);
    });
  });

});
