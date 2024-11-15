const React = require('react');
const { createRoot } = require('react-dom/client');
const App = require('./App.js'); // Change this to .js

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(React.createElement(App)); // Use React.createElement for rendering
  root.unmount();
});
