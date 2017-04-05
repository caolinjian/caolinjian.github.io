/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */

function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_.isArray(children) && children != null) {
            children = Array.prototype.slice.call(arguments, 2).filter(function(val) {
                return !!value
            })
        }
        return new Element(tagName, props, children)
    }
    if (_.isArray(props)) {
        children = props
        props = {}
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props
        ? props.key
        : void 0;
    let count = 0

    this.children.forEach(function(child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            children[i] = '' + child
        }
        count++
    })

    this.count = count
}

Element.prototype.render = function() {
    let el = document.createElement(this.tagName)
    let props = this.props;
    for (let propName in props) {
        let propValue = props[propName];
        setAttr(el, propName, propValue)
    }
    children.forEach(function(child) {
        let childEl = (child instanceof Element)
            ? child.render()
            : document.createTextNode(child);
        el.appendChild(childEl)
    })
    return el
}

function setAttr = function(node, key, value) {
    switch (key) {
        case 'style':
            this.style.cssText = value
            break
        case 'value':
            let tagName = node.tagName || '';
            tagName = tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                node.value = value
            } else {
                node.setAttribute(key, value)
            }
            break
        default:
            node.setAttribute(key, value)break
    }
}

/**
 * Virtual-dom diff.
 * @param {Element} oldTree
 * @param {Element} newTree
 */

const REPLACE = 0
const REORDER = 1
const PROPS = 2
const TEXT = 3

function diff(oldTree, newTree) {
    let index = 0; //当前节点
    let patches = {}; // 每个节点的差异
    diff_dfsWalk(oldTree, newTree, index, patches);
    return patches;
}

function diff_dfsWalk(oldNode, newNode, index, patches) {
    let currentPatch = [];
    if (newNode === null) {} else if (typeof oldNode === 'string' && typeof newNode === 'string') {
        currentPatch.push({type: TEXT, content: newNode})
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        let propsPatches = diffProps(oldNode, newNode)
        if (propsPatches) {
            currentPatch.push({type: PROPS, props: propsPatches})
        }
        if (!isIgnoreChildren(newNode)) {
            diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
        }
    } else {
        currentPatch.push({type: REPLACE, node: newNode})
    }

    if (currentPatch.length) {
        patches[index] = currentPatch
    }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if (diffs.moves.length) {
        let reorderPatch = {
            type: patch.REORDER,
            moves: diffs.moves
        }
        currentPatch.push(reorderPatch)
    }
    let leftNode = null;
    let currentNodeIndex = index;
    oldChildren.forEach(function(child, i) {
        let newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) // 计算节点标识
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1;
        diff_dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child
    })
}

function diffProps(oldNode, newNode) {
    let count = 0;
    let oldProps = oldNode.props;
    let newProps = newNode.props;

    let key,
        value;
    let propsPatches = {};

    // Find out different properties
    for (key in oldProps) {
        value = oldProps[key]
        if (newProps[key] !== value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // Find out new property
    for (key in newProps) {
        value = newProps[key]
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // If properties all are identical
    if (count === 0) {
        return null
    }

    return propsPatches
}

function isIgnoreChildren(node) {
    return (node.props && node.props.hasOwnProperty('ignore'))
}

/**
 * Virtual-dom patch.
 * @param {Element} node
 * @param {Object} patches
 */

function patch(node, patches) {
    let walker = {
        index: 0
    }
    patch_dfsWalk(node, walker, patches)
}

function patch_dfsWalk(node, walker, patches) {
    let currentPatches = patches[walker.index]

    let len = node.childNodes
        ? node.childNodes.length
        : 0;
    for (let i = 0; i < len; i++) {
        let child = node.childNodes[i]
        walker.index++;
        patch_dfsWalk(child, walker, patches)
    }

    if (currentPatches) {
        applyPatches(node, currentPatches)
    }
}

function applyPatches(node, currentPatches) {
    currentPatches.forEach(function(currentPatch) {
        switch (currentPatch.type) {
            case REPLACE:
                let newNode = (typeof currentPatch.node === 'string')
                    ? document.createTextNode(currentPatch.node)
                    : currentPatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break
            case REORDER:
                reorderChildren(node, currentPatch.moves);
                break
            case PROPS:
                setProps(node, currentPatch.props);
                break
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentPatch.content;
                } else {
                    // fuck ie
                    node.nodeValue = currentPatch.content;
                }
                break
            default:
                throw new Error('Unknown patch type ' + currentPatch.type)
        }
    })
}

function setProps(node, props) {
    for (let key in props) {
        if (props[key] === void 0) {
            node.removeAttribute(key)
        } else {
            let value = props[key]
            setAttr(node, key, value)
        }
    }
}

function reorderChildren(node, moves) {
    let staticNodeList = toArray(node.childNodes)
    let maps = {}

    staticNodeList.forEach(function(node) {
        if (node.nodeType === 1) {
            let key = node.getAttribute('key')
            if (key) {
                maps[key] = node
            }
        }
    })

    moves.forEach(function(move) {
        let index = move.index
        if (move.type === 0) { // remove item
            if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
                node.removeChild(node.childNodes[index])
            }
            staticNodeList.splice(index, 1)
        } else if (move.type === 1) { // insert item
            let insertNode = maps[move.item.key]
                ? maps[move.item.key] // reuse old item
                : ((typeof move.item === 'object')
                    ? move.item.render()
                    : document.createTextNode(move.item));
            staticNodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
    })
}

function toArray(listLike) {
    if (!listLike) {
        return []
    }

    var list = []

    for (var i = 0, len = listLike.length; i < len; i++) {
        list.push(listLike[i])
    }

    return list
}
