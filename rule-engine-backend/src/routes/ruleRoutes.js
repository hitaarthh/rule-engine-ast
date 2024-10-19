const express = require('express');
const { createRule, combineRules, evaluateRule, getRuleStructure } = require('../services/ruleEngine');
const { Rule, Node } = require('../models/Rule');  // Import Node here

const router = express.Router();

// New endpoint to get all rules
router.get('/', async (req, res) => {
  try {
    const rules = await Rule.find({}, 'name _id');  // Only fetch name and _id fields
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

// Add this to your existing ruleRoutes.js
router.delete('/:ruleId', async (req, res) => {
  try {
    const { ruleId } = req.params;
    
    // First, get the rule to find its rootNode
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Delete all associated nodes recursively
    async function deleteNodes(nodeId) {
      if (!nodeId) return;
      const node = await Node.findById(nodeId);
      if (node) {
        if (node.left) await deleteNodes(node.left);
        if (node.right) await deleteNodes(node.right);
        await Node.findByIdAndDelete(nodeId);
      }
    }

    // Delete the nodes first
    await deleteNodes(rule.rootNode);

    // Then delete the rule
    await Rule.findByIdAndDelete(ruleId);

    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({ error: 'Failed to delete rule' });
  }
});

router.post('/create', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { name, ruleString } = req.body;
    if (!name || !ruleString) {
      return res.status(400).json({ error: 'Name and ruleString are required' });
    }
    console.log('Attempting to create rule:', { name, ruleString });
    const rule = await createRule(name, ruleString);
    console.log('Rule created successfully:', rule);
    res.json(rule);
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(400).json({ error: error.message, stack: error.stack });
  }
});

router.post('/combine', async (req, res) => {
    try {
      console.log('Received request to combine rules:', req.body);
      const { ruleIds } = req.body;
      if (!ruleIds || !Array.isArray(ruleIds) || ruleIds.length < 2) {
        return res.status(400).json({ error: 'At least two valid rule IDs are required' });
      }
      const combinedRule = await combineRules(ruleIds);
      console.log('Rules combined successfully:', combinedRule);
      res.json(combinedRule);
    } catch (error) {
      console.error('Error combining rules:', error);
      res.status(400).json({ error: error.message });
    }
  });

router.post('/evaluate/:ruleId', async (req, res) => {
  try {
    const { ruleId } = req.params;
    const { data } = req.body;
    
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format. Expected an object.' });
    }

    const result = await evaluateRule(ruleId, data);
    res.json({ result });
  } catch (error) {
    console.error('Error evaluating rule:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/structure/:ruleId', async (req, res) => {
  try {
    const { ruleId } = req.params;
    const structure = await getRuleStructure(ruleId);
    res.json(structure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a GET route for testing
router.get('/test', (req, res) => {
  res.json({ message: 'Rule routes are working' });
});

module.exports = router;