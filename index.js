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

// // const element = myReact.createElement(
// //     "div",
// //     { id: "foo" },
// //     myReact.createElement("a", null, "bar"),
// //     myReact.createElement("b")
// // );

// // above object can be re-written to use jsx inside it my adding following comment for babel to use our createElement function and not react's

// /** @jsx myReact.createElement */
// const element = (
//     <div style="background: salmon">
//         <h1>Hello World</h1>
//         <h2 style="text-align:right">from Jaglan</h2>
//     </div>
// );

// const container = document.getElementById("root");
// // ReactDOM.render(element, container);  ----> rewriting this in step 2 with myReact render function

// // Step-2 (render function)

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

// // add render() to myReact library
// myReact.render(element, container);

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

// function performNextUnitOfWork(fiber) {
//     // add dom node
//     if(!fiber.domNode){
//         fiber.domNode = createDomNode(fiber)
//     }

//     if(fiber.parent){
//         fiber.parent.domNode.appendChild(fiber.domNode)
//     }

//     // create new fibers
//     const elements = fiber.props.children
//     let index = 0
//     let prevSibling = null

//     while(index < elements.length){
//         const element = elements[index]

//         const newFiber = {
//             type: element.type,
//             props: element.props,
//             parent: fiber,
//             domNode: null
//         }

//         if(index == 0){
//             fiber.child = newFiber
//         }else{
//             prevSibling.sibling = newFiber
//         }
        
//         prevSibling = newFiber
//         index++
//     }
    
//     // return next unit of work
//     if(fiber.child){
//         return fiber.child
//     }
//     let nextFiber = fiber
//     while(nextFiber){
//         if(nextFiber.sibling){
//             return nextFiber.sibling
//         }
//         nextFiber = nextFiber.parent
//     }
// }


// -- STEP - 5 -- //
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

// function commitRoot(wipRoot){
//     commitWork(wipRoot.child)
//     wipRoot = null; 
// }

// function commitWork(fiber){
//     if(!fiber){
//         return
//     }
//     const domNodeParent = fiber.parent.domNode;
//     domNodeParent.appendChild(fiber.domNode);
//     commitWork(fiber.child);
//     commitWork(fiber.sibling);
// }

// function render(element, container){
//     wipRoot = {
//         domNode: container,
//         props: {
//             children:[
//                 element,
//             ]
//         }
//     }
//     nextUnitOfWork = wipRoot;
// }

// let nextUnitOfWork = null;
// let wipRoot = null

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

//     if(!nextUnitOfWork && wipRoot){
//         commitRoot();
//     }
// }

// requestIdleCallback(workLoop)

// function performNextUnitOfWork(fiber) {
//     // add dom node
//     if(!fiber.domNode){
//         fiber.domNode = createDomNode(fiber)
//     }

//     // we dont update dom for each call of this function as it can be interupted by the browser and will lead to inconsistent rendering of elements and UI , therefore we keep track of the root of fiber tree and commit all of it once the tree is complete

//     // create new fibers
//     const elements = fiber.props.children
//     let index = 0
//     let prevSibling = null

//     while(index < elements.length){
//         const element = elements[index]

//         const newFiber = {
//             type: element.type,
//             props: element.props,
//             parent: fiber,
//             domNode: null
//         }

//         if(index == 0){
//             fiber.child = newFiber
//         }else{
//             prevSibling.sibling = newFiber
//         }
        
//         prevSibling = newFiber
//         index++
//     }
    
//     // return next unit of work
//     if(fiber.child){
//         return fiber.child
//     }
//     let nextFiber = fiber
//     while(nextFiber){
//         if(nextFiber.sibling){
//             return nextFiber.sibling
//         }
//         nextFiber = nextFiber.parent
//     }
// } 

// STEP --- 6 --- // (Reconciliation - Update and deletion)
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

function updateDom(domNode, prevProps, nextProps){
    // TODO
}

function commitRoot(wipRoot){
    deletions.forEach(commitWork); // commiting all deletions element for deletion
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null; 
}

function commitWork(fiber){
    if(!fiber){
        return
    }
    const domNodeParent = fiber.parent.domNode;
    if(
        fiber.effectTag === "PLACEMENT" &&
        fiber.domNode != null
    ){
        domNodeParent.appendChild(fiber.domNode);
    }else if(
        fiber.effectTag === "DELETION"
    ){
        domNodeParent.removeChild(fiber.domNode)
    }else if(
        fiber.effectTag === "UPDATE" &&
        fiber.domNode != null
    ){
        updateDom(
            fiber.domNode,
            fiber.alternate.props,
            fiber.props
        )
    }
    
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function render(element, container){
    wipRoot = {
        domNode: container,
        props: {
            children:[
                element,
            ]
        },
        // adding alternate key : points to the old fiber corresponding to this fiber of the previous commit
        alternate: currentRoot,
    }
    deletions = [] // array that keeps track of all fibers that need to be deleted
    nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null; 

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

    if(!nextUnitOfWork && wipRoot){
        commitRoot();
    }
}

requestIdleCallback(workLoop)

function performNextUnitOfWork(fiber) {
    // add dom node
    if(!fiber.domNode){
        fiber.domNode = createDomNode(fiber)
    }

    // we dont update dom for each call of this function as it can be interupted by the browser and will lead to inconsistent rendering of elements and UI , therefore we keep track of the root of fiber tree and commit all of it once the tree is complete

    // create new fibers
    const elements = fiber.props.children
    reconcileChildren(fiber, elements);

    // shifting creation of new fibers to a new fucntion

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

function reconcileChildren(wipFiber, elements){
    let index = 0
    let oldFiber = 
        wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while(index < elements.length || oldFiber != null){
        const element = elements[index]
        const newFiber = null

        // TODO Compare old fiber to new fiber
        const sameType = 
            oldFiber && 
            element && 
            oldFiber.type == element.type

        // when old fiber and new element have same type
        if(sameType){
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                domNode: oldFiber.domNode,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            }
        }

        // when old fiber and new element dont have same type and theres a new element
        if(element && !sameType){
            newFiber = {
                type: element.type,
                props: element.props,
                domNode: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        }

        // when old fiber and new element dont have same type so we delete oldFiber
        if(oldFiber && !sameType){
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }

        if(index == 0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }
        
        prevSibling = newFiber
        index++
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