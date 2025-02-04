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

// Step - 3 (Concurrent mode) // To make DOM rendering interuptable and website responsive
// let nextUnitOfWork = null;

// function workLoop(deadline) {
//     let shoudlYield = false;

//     while (nextUnitOfWork && !shoudlYield) {
//         nextUnitOfWork = performNextUnitOfWork(
//             nextUnitOfWork
//         )

//         shoudlYield = deadline.timeRemaining() < 1
//     }

//     if (nextUnitOfWork) {
//         requestIdleCallback(workLoop)
//     }
// }

// requestIdleCallback(workLoop)

// function performNextUnitOfWork(nextUnitOfWork) {
//     // TODO
// }


// -- Step - 4 -- // (fiber data structure)(Parent -> Child, Child -> Sibling, [if no sibling]current fiber -> parent's sibling[uncle], [if no uncle] parent -> parent)

//creating just DOM node and returning it (no recursive calls to make the dom render like earlier)
function createDomNode(fiber){
    const domNode = 
        fiber.type === "TEXT_ELEMENT"
        ? document.createTextElement("")
        : document.createElement(fiber.type)
        
    const isProperty = key => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name =>{
            domNode[name] = fiber[name]
        })
    
    return domNode
}

function render(element, container){
    nextUnitOfWork = {
        domNode: container,
        props: {
            children:[
                element,
            ]
        }
    }
}

let nextUnitOfWork = null;

function workLoop(deadline) {
    let shoudlYield = false;

    while (nextUnitOfWork && !shoudlYield) {
        nextUnitOfWork = performNextUnitOfWork(
            nextUnitOfWork
        )

        shoudlYield = deadline.timeRemaining() < 1
    }

    if (nextUnitOfWork) {
        requestIdleCallback(workLoop)
    }
}

requestIdleCallback(workLoop)

function performNextUnitOfWork(fiber) {
    // add dom node
    if(!fiber.domNode){
        fiber.domNode = createDomNode(fiber)
    }

    if(fiber.parent){
        fiber.parent.domNode.appendChild(fiber.domNode)
    }

    // create new fibers
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while(index < elements.length){
        const element = elements[index]

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            domNode: null
        }

        if(index == 0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }
        
        prevSibling = newFiber
        index++
    }
    
    // return next unit of work
    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}


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

// function createDomNode(fiber){
//     const domNode = 
//         fiber.type === "TEXT_ELEMENT"
//         ? document.createTextElement("")
//         : document.createElement(fiber.type)
        
//     const isProperty = key => key !== "children"
//     Object.keys(fiber.props)
//         .filter(isProperty)
//         .forEach(name =>{
//             domNode[name] = fiber[name]
//         })
    
//     return domNode
// }

// function render(element, container){
//     nextUnitOfWork = {
//         domNode: container,
//         props: {
//             children:[
//                 element,
//             ]
//         }
//     }
// }

// const container = document.getElementById("root");
// myReact.render(element, container);

// let nextUnitOfWork = null;

// function workLoop(deadline) {
//     let shoudlYield = false;

//     while (nextUnitOfWork && !shoudlYield) {
//         nextUnitOfWork = performNextUnitOfWork(
//             nextUnitOfWork
//         )

//         shoudlYield = deadline.timeRemaining() < 1
//     }

//     if (nextUnitOfWork) {
//         requestIdleCallback(workLoop)
//     }
// }

// requestIdleCallback(workLoop)

// function performNextUnitOfWork(nextUnitOfWork) {
//     // TODO
// }