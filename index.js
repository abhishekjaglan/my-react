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




// Step-1(createElement function)

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
    render
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
    <div style="background: salmon">
        <h1>Hello World</h1>
        <h2 style="text-align:right">from Jaglan</h2>
    </div>
);

const container = document.getElementById("root");
// ReactDOM.render(element, container);  ----> rewriting this in step 2 with myReact render function

// Step-2 (render function)

function render(element, container) {
    // creating dom nodes and adding them to DOM
    const domNode =
        element.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(element.type);

    const isProperty = key => key !== "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            domNode[name] = element.props[name]
        })

    // each child of element is created its own domNode and attached to its parent
    element.props.children.forEach(child => {
        render(child, domNode)
    });

    container.appendChild(domNode);
}

// add render() to myReact library
myReact.render(element, container);

// Step - 3 (Concurrent mode)



















//// FINAL ////

// // This creates my own element that needs to rendered and attached to a parent eventually
// function createElement(type, props, ...children) {
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child =>
//                 typeof child === "object"
//                     ? child
//                     : createTextElement(child)
//             ),
//         },
//     }
// }

// // Function to wrap non-obj types of children when creating an element and create a new TEXT_ELEMENT type for them
// function createTextElement(text) {
//     return {
//         type: "TEXT_ELEMENT",
//         props: {
//             nodeValue: text,
//             children: []
//         },
//     }
// }

// function render(element, container) {
//     // creating dom nodes and adding them to DOM
//     const domNode =
//         element.type === "TEXT_ELEMENT"
//             ? document.createTextNode("")
//             : document.createElement(element.type);

//     const isProperty = key => key !== "children"
//     Object.keys(element.props)
//         .filter(isProperty)
//         .forEach(name => {
//             domNode[name] = element.props[name]
//         })

//     // each child of element is created its own domNode and attached to its parent
//     element.props.children.forEach(child => {
//         render(child, domNode)
//     });

//     container.appendChild(domNode);
// }

// //creating my own react library
// const myReact = {
//     createElement,
//     render
// }

// /** @jsx myReact.createElement */
// const element = (
//     <div style="background: salmon">
//         <h1>Hello World</h1>
//         <h2 style="text-align:right">from Jaglan</h2>
//     </div>
// );

// const container = document.getElementById("root");
// myReact.render(element, container);