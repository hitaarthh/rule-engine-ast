const { Node, Rule } = require('../models/Rule');

async function createRule(ruleName, ruleString) {
  try {
    console.log('Parsing rule string:', ruleString);
    const ast = parseRuleString(ruleString);
    console.log('Parsed AST:', JSON.stringify(ast, null, 2));

    console.log('Saving AST to database');
    const rootNode = await saveASTToDatabase(ast);
    console.log('Saved root node:', rootNode);

    console.log('Creating new Rule');
    const rule = new Rule({ name: ruleName, rootNode: rootNode._id });
    await rule.save();
    console.log('Rule saved successfully');

    return rule;
  } catch (error) {
    console.error('Error in createRule:', error);
    throw new Error(`Error creating rule: ${error.message}`);
  }
}

async function getRuleStructure(ruleId) {
  const rule = await Rule.findById(ruleId).populate({
    path: 'rootNode',
    populate: { path: 'left right', populate: { path: 'left right' } }
  });
  if (!rule) {
    throw new Error('Rule not found');
  }

  function getNodeStructure(node) {
    if (!node) return null;

    const structure = {
      type: node.type,
      value: node.value
    };

    if (node.left) structure.left = getNodeStructure(node.left);
    if (node.right) structure.right = getNodeStructure(node.right);

    return structure;
  }

  return {
    name: rule.name,
    structure: getNodeStructure(rule.rootNode)
  };
}

async function combineRules(ruleIds) {
  try {
    console.log('Combining rules with IDs:', ruleIds);
    const rules = await Rule.find({ _id: { $in: ruleIds } }).populate({
      path: 'rootNode',
      populate: { path: 'left right', populate: { path: 'left right' } }
    });
    console.log('Found rules:', rules);

    if (rules.length === 0) {
      throw new Error('No valid rules found to combine');
    }

    const combinedAST = combineASTNodes(rules.map(rule => rule.rootNode));
    console.log('Combined AST:', JSON.stringify(combinedAST, null, 2));

    const rootNode = await saveASTToDatabase(combinedAST);
    console.log('Saved combined root node:', rootNode);

    // Generate a unique name for the combined rule
    let ruleName = 'Combined Rule';
    let ruleCount = 1;

    // Check for existing rules with the name and increment the count
    while (await Rule.findOne({ name: ruleName })) {
      ruleName = `Combined Rule ${ruleCount}`;
      ruleCount++;
    }

    const combinedRule = new Rule({ name: ruleName, rootNode: rootNode._id });
    await combinedRule.save();
    console.log('Combined rule saved successfully with name:', ruleName);

    return combinedRule;
  } catch (error) {
    console.error('Error in combineRules:', error);
    throw new Error(`Error combining rules: ${error.message}`);
  }
}


async function evaluateRule(ruleId, data) {
  try {
    console.log(`Evaluating rule with ID: ${ruleId}`);
    console.log('Input data:', JSON.stringify(data, null, 2));

    const rule = await Rule.findById(ruleId).populate({
      path: 'rootNode',
      populate: {
        path: 'left right',
        populate: {
          path: 'left right',
          populate: {
            path: 'left right'
          }
        }
      }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    console.log('Rule structure:', JSON.stringify(rule.rootNode, null, 2));

    const result = evaluateNode(rule.rootNode, data);
    console.log('Evaluation result:', result);
    return result;
  } catch (error) {
    console.error('Error in evaluateRule:', error);
    throw new Error(`Error evaluating rule: ${error.message}`);
  }
}

function evaluateNode(node, data) {
  console.log('Evaluating node:', JSON.stringify(node, null, 2));
  
  if (!node) {
    throw new Error('Invalid node: node is null or undefined');
  }
  
  if (typeof node.type === 'undefined') {
    throw new Error(`Node type is undefined: ${JSON.stringify(node, null, 2)}`);
  }

  if (node.type === 'operand') {
    const [attribute, operator, value] = node.value.split(' ');
    const attributeValue = data[attribute];
    
    if (attributeValue === undefined) {
      throw new Error(`Attribute '${attribute}' not found in data`);
    }

    console.log(`Comparing: ${attributeValue} ${operator} ${value}`);

    switch (operator) {
      case '>': return attributeValue > parseFloat(value);
      case '<': return attributeValue < parseFloat(value);
      case '>=': return attributeValue >= parseFloat(value);
      case '<=': return attributeValue <= parseFloat(value);
      case '=': return attributeValue == value.replace(/'/g, '');
      case '!=': return attributeValue != value.replace(/'/g, '');
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  } else if (node.type === 'operator') {
    const leftResult = evaluateNode(node.left, data);
    const rightResult = evaluateNode(node.right, data);

    console.log(`Operator: ${node.value}, Left: ${leftResult}, Right: ${rightResult}`);

    switch (node.value) {
      case 'AND': return leftResult && rightResult;
      case 'OR': return leftResult || rightResult;
      default: throw new Error(`Unknown operator: ${node.value}`);
    }
  }

  throw new Error(`Invalid node type: ${node.type}`);
}

function parseRuleString(ruleString) {
  console.log('Tokenizing rule string');
  const tokens = tokenize(ruleString);
  console.log('Tokens:', tokens);
  console.log('Building AST');
  return buildAST(tokens);
}

function tokenize(ruleString) {
  return ruleString.split(/\s+/).filter(token => token.length > 0);
}

function buildAST(tokens) {
  const operators = ['AND', 'OR'];
  const comparators = ['>', '<', '>=', '<=', '=', '!='];
  let index = 0;

  function parseExpression() {
    console.log('Parsing expression, current index:', index);
    if (index >= tokens.length) {
      throw new Error('Unexpected end of input');
    }

    let node = parseComparison();

    while (index < tokens.length && operators.includes(tokens[index])) {
      const operator = tokens[index++];
      console.log('Found operator:', operator);
      const right = parseComparison();
      node = {
        type: 'operator',
        value: operator,
        left: node,
        right: right
      };
    }

    return node;
  }

  function parseComparison() {
    console.log('Parsing comparison, current index:', index);
    const left = tokens[index++];
    const operator = tokens[index++];
    const right = tokens[index++];

    if (!comparators.includes(operator)) {
      throw new Error(`Invalid comparison operator: ${operator}`);
    }

    return {
      type: 'operand',
      value: `${left} ${operator} ${right}`
    };
  }

  console.log('Starting to build AST');
  const ast = parseExpression();
  console.log('Final AST:', JSON.stringify(ast, null, 2));
  return ast;
}

async function saveASTToDatabase(ast) {
  if (!ast || typeof ast !== 'object') {
    throw new Error('Invalid AST structure');
  }

  // If the node already exists in the database, return it
  if (ast._id) {
    return ast;
  }

  const nodeData = {
    type: ast.type,
    value: ast.value
  };

  if (!nodeData.type || !nodeData.value) {
    console.error('Invalid node data:', ast);
    throw new Error(`Invalid node data: type and value are required. Received: ${JSON.stringify(ast)}`);
  }

  const node = new Node(nodeData);

  if (ast.left) {
    const leftNode = await saveASTToDatabase(ast.left);
    node.left = leftNode._id;
  }

  if (ast.right) {
    const rightNode = await saveASTToDatabase(ast.right);
    node.right = rightNode._id;
  }

  await node.save();
  return node;
}

function combineASTNodes(nodes) {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];

  return nodes.reduce((combined, node) => ({
    type: 'operator',
    value: 'AND',
    left: combined,
    right: node
  }));
}

module.exports = {
  createRule,
  combineRules,
  evaluateRule,
  getRuleStructure
};