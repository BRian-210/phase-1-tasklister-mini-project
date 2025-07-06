const chai = require('chai');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

const expect = chai.expect;

describe('Task Lister Lite', () => {
  let dom;
  let document;
  let window;
  let form, formInput, taskList, taskCountDisplay;

  before(() => {
    // Load HTML
    const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

    // Transform JS with Babel
    const { code: transformedScript } = babel.transformFileSync(
      path.resolve(__dirname, '..', 'src', 'script.js'),
      { presets: ['@babel/preset-env'] }
    );

    // Set up JSDOM
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
    });

    // Inject the transformed script
    const scriptElement = dom.window.document.createElement('script');
    scriptElement.textContent = transformedScript;
    dom.window.document.body.appendChild(scriptElement);

    // Simulate DOMContentLoaded
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    window = dom.window;
    document = window.document;

    // Set globals
    global.window = window;
    global.document = document;
    global.HTMLElement = window.HTMLElement;
    global.Node = window.Node;
    global.Text = window.Text;

    // Cache elements
    form = document.querySelector('#create-task-form');
    formInput = document.querySelector('#new-task-description');
    taskList = document.querySelector('#tasks');
    taskCountDisplay = document.querySelector('#count');
  });

  beforeEach(() => {
    taskList.innerHTML = '';
    form.reset();
    taskCountDisplay.textContent = '0';
  });

  // Helper to add a task
  function addTask(description = 'Sample Task') {
    formInput.value = description;
    const event = new dom.window.Event('submit', { bubbles: true, cancelable: true });
    event.preventDefault = () => {};
    form.dispatchEvent(event);
  }

  describe('Form submission', () => {
    it('adds a new task to the list', () => {
      addTask('Wash dishes');
      const tasks = taskList.querySelectorAll('li');
      expect(tasks.length).to.equal(1);
      expect(tasks[0].textContent).to.include('Wash dishes');
    });
  });

  describe('Task deletion', () => {
    it('removes a task when the delete button is clicked', () => {
      addTask('Take out trash');

      const taskItem = taskList.querySelector('li');
      expect(taskItem).to.not.be.null;

      const deleteBtn = taskItem.querySelector('button:last-child');
      expect(deleteBtn).to.not.be.null;

      deleteBtn.click();

      expect(taskList.contains(taskItem)).to.be.false;
    });
  });

  describe('Task count updates', () => {
    it('shows correct count after adding a task', () => {
      addTask('Do homework');
      expect(taskCountDisplay.textContent).to.equal('1');
    });

    it('shows correct count after deleting a task', () => {
      addTask('Sample task');

      const taskItem = taskList.querySelector('li');
      const deleteBtn = taskItem.querySelector('button:last-child');
      deleteBtn.click();

      expect(taskCountDisplay.textContent).to.equal('0');
    });
  });
});
