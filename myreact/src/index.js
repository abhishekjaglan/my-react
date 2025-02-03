/** @jsx myReact.createElement */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function render(element, container) {
  const domNode =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      domNode[name] = element.props[name];
    });

  element.props.children.forEach(child => {
    render(child, domNode);
  });

  container.appendChild(domNode);
}

//creating my own react library
const myReact = {
  createElement,
  render
};


const element = (
  <div style={{ background: 'salmon' }}>
    <h1>Hello World</h1>
    <h2 style={{ textAlign: 'right' }}>from Jaglan</h2>
  </div>
);

const container = document.getElementById("root");
myReact.render(element, container);