// Step-0
// const { JSDOM } = require("jsdom");

// const { window } = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// const { document } = window;

// const element = {
//     type: "h1",
//     props: {
//         title: "foo",
//         children: "Hello",
//     }
// };

// const container = document.getElementById("root");
// console.log(container)

// const node = document.createElement(element.type);
// node["title"] = element.props.title;

// const textNode = document.createTextNode("");
// textNode["nodeValue"] = element.props.children;
// node.appendChild(textNode);

// container.appendChild(node);

// Step-1
// This creates my own element that needs to rendered and attached to a parent eventually
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            ),
        },
    }
}

// Function to wrap non-obj types of children when creating an element and create a new TEXT_ELEMENT type for them
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        },
    }
}

//creating my own react library
const myReact = {
    createElement,
}

// const element = myReact.createElement(
//     "div",
//     { id: "foo" },
//     myReact.createElement("a", null, "bar"),
//     myReact.createElement("b")
// );

// above object can be re-written to use jsx inside it my adding following comment for babel to use our createElement function and not react's

/** @jsx myReact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
)

const container = document.getElementById("root");
ReactDOM.render(element, container);