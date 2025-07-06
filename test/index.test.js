const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'src/index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// Inject the transformed JavaScript into the virtual DOM
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

// Trigger DOMContentLoaded
dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

// Expose JSDOM globals
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

// Test suite
describe('Task Lister Lite', () => {
  let form, formInput, taskList;

  before(() => {
    form = document.querySelector('#create-task-form');
    formInput = document.querySelector('#new-task-description');
    taskList = document.querySelector('#tasks');
  });

  beforeEach(() => {
    taskList.innerHTML = ''; // Clean up between tests
    form.reset();
  });

  describe('Handling form submission', () => {
    it('should add an event to the form and add input to webpage', () => {
      formInput.value = 'Wash the dishes';

      const event = new dom.window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      event.preventDefault = () => {};

      form.dispatchEvent(event);

      expect(taskList.textContent).to.include('Wash the dishes');
    });
  });

  describe('Handling task deletion', () => {
    it('should remove a task when the delete button is clicked', () => {
      formInput.value = 'Clean the house';

      const event = new dom.window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      event.preventDefault = () => {};

      form.dispatchEvent(event);

      const taskItem = taskList.querySelector('li');
      const deleteButton = taskItem.querySelector('button');

      deleteButton.click();

      expect(taskList.contains(taskItem)).to.be.false;
    });
  });
});
describe('Task Count Display', () => {
  let form;
  let formInput;
  let taskList;
  let taskCountDisplay;

  before(() => {
    form = document.querySelector('#create-task-form');
    formInput = document.querySelector('#new-task-description');
    taskList = document.querySelector('#tasks');
    taskCountDisplay = document.querySelector('#count');
  });

  it('should update the task count when a task is added', () => {
    formInput.value = 'Do homework';

    const event = new dom.window.Event('submit', {
      bubbles: true,
      cancelable: true
    });
    event.preventDefault = () => {};

    form.dispatchEvent(event);

    expect(taskCountDisplay.textContent).to.equal('1');
  });

  it('should update the task count when a task is deleted', () => {
    const deleteButton = taskList.querySelector('li button');
    deleteButton.click();

    expect(taskCountDisplay.textContent).to.equal('0');
  });
});
