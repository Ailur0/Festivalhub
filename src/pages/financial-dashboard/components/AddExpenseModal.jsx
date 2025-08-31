import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddExpenseModal = ({ isOpen, onClose, onAddExpense, selectedCategory, members }) => {
  const [formData, setFormData] = useState({
    category: selectedCategory || '',
    description: '',
    amount: '',
    assignedTo: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    receipt: null
  });

  const categories = [
    { value: 'Decoration', label: 'Decoration' },
    { value: 'Prasad', label: 'Prasad' },
    { value: 'Pooja Items', label: 'Pooja Items' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Cultural Events', label: 'Cultural Events' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
  ];

  const memberOptions = members?.map(member => ({
    value: member?.id,
    label: member?.name,
    description: member?.role
  }));

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.description || !formData?.amount || !formData?.category || !formData?.assignedTo) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: formData?.category,
      description: formData?.description,
      amount: parseFloat(formData?.amount),
      assignedTo: members?.find(m => m?.id === formData?.assignedTo)?.name || '',
      date: formData?.date,
      receipt: formData?.receipt
    };

    onAddExpense(newExpense);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      category: selectedCategory || '',
      description: '',
      amount: '',
      assignedTo: '',
      date: new Date()?.toISOString()?.split('T')?.[0],
      receipt: null
    });
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md festival-shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground font-heading">Add Expense</h2>
              <p className="text-sm text-muted-foreground">Record a new expense</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Select
            label="Category"
            options={categories}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select expense category"
            required
          />

          <Input
            label="Description"
            type="text"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Enter expense description"
            required
          />

          <Input
            label="Amount"
            type="number"
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            placeholder="Enter amount in USD"
            min="0"
            step="0.01"
            required
          />

          <Select
            label="Assigned To"
            options={memberOptions}
            value={formData?.assignedTo}
            onChange={(value) => handleInputChange('assignedTo', value)}
            placeholder="Select responsible member"
            required
          />

          <Input
            label="Date"
            type="date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            required
          />

          <Input
            label="Receipt (Optional)"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleInputChange('receipt', e?.target?.files?.[0])}
            description="Upload receipt image or PDF"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="default"
              iconName="Plus"
              iconPosition="left"
              className="flex-1"
            >
              Add Expense
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;