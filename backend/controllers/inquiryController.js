const Inquiry = require('../models/Inquiry');

const VALID_STATUSES = ['Unread', 'Read', 'Resolved'];

const createInquiry = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const phone = (req.body.phone || '').trim();
    const message = (req.body.message || '').trim();
    const email = (req.body.email || '').trim();

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone, and message are required.' });
    }

    const payload = { name, phone, message };
    if (email) payload.email = email;

    const inquiry = await Inquiry.create(payload);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid inquiry status.' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      status ? { status } : {},
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiry };
