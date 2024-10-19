const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['operator', 'operand'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' },
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }
});

const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  rootNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node'
  }
});

const Node = mongoose.model('Node', NodeSchema);
const Rule = mongoose.model('Rule', RuleSchema);

module.exports = { Node, Rule };