// This class represents a node in a tree.
class Node {
    // The constructor takes a value and an optional list of child nodes.
    constructor(value, children = []) {
        // The value of the node.
        this.value = value;

        // The list of child nodes.
        this.children = children;
    }
}

// This function dynamically generates a tree object from a given input.
function generateTree(nodes) {
    // The root of the tree.
    const root = nodes[0];

    // For each child node, add it to the root node's children list.
    for (const child of nodes.slice(1)) {
        root.children.push(child);
    }

    // Return the root of the tree.
    return root;
}

// This function performs in-order traversal on the tree.
function inOrderTraversal(tree) {
    // For each child node of the tree, recursively perform in-order traversal on that child node.
    for (const child of tree.children) {
        inOrderTraversal(child);
    }

    // Print the value of the tree node.
    console.log(tree.value);
}

// This function reads the input from the user and generates a list of nodes.
function readInput() {
    // Create an empty list to store the nodes.
    const nodes = [];

    // Prompt the user for the value of the root node and add it to the list.
    const rootNodeValue = prompt('Enter the value of the root node: ');
    nodes.push(new Node(rootNodeValue));

    // Define a recursive function to read the child nodes of a given node.
    function readChildNodes(node) {
        // Prompt the user for the values of the child nodes of the given node, separated by commas.
        const childNodeValues = prompt('Enter the values of the child nodes of ' + node.value + ', separated by commas: ');

        // Split the child node values into an array.
        const childNodes = childNodeValues.split(',');

        // For each child node value, if it is not empty, create a new child node and recursively read its child nodes.
        for (const childNodeValue of childNodes) {
            if (childNodeValue === '') {
                continue;
            }

            const childNode = new Node(childNodeValue);
            readChildNodes(childNode);
            node.children.push(childNode);
        }
    }

    // Read the child nodes of the root node.
    readChildNodes(nodes[0]);

    // Return the list of nodes.
    return nodes;
}

// Generate the tree from the user input.
const nodes = readInput();
const tree = generateTree(nodes);

// Perform in-order traversal on the tree.
inOrderTraversal(tree);
