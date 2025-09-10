import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JoinGroupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!inviteCode?.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock validation - accept codes like "DIWALI2024", "FESTIVAL123"
      const validCodes = ['DIWALI2024', 'FESTIVAL123', 'HOLI2024', 'NAVRATRI24'];
      
      if (validCodes?.includes(inviteCode?.toUpperCase())) {
        setIsLoading(false);
        onClose();
        navigate('/group-management');
      } else {
        setIsLoading(false);
        setError('Invalid invite code. Please check and try again.');
      }
    }, 1500);
  };

  const handleInputChange = (e) => {
    setInviteCode(e?.target?.value?.toUpperCase());
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg festival-shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground font-heading">
                Join Group
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the invite code to join a festival group
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Invite Code"
            type="text"
            placeholder="Enter invite code (e.g., DIWALI2024)"
            value={inviteCode}
            onChange={handleInputChange}
            error={error}
            required
            description="Ask your group admin for the invite code"
            className="text-center font-mono text-lg tracking-wider"
          />

          {/* Sample Codes for Demo */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Demo Codes (for testing):
            </p>
            <div className="flex flex-wrap gap-2">
              {['DIWALI2024', 'FESTIVAL123', 'HOLI2024', 'NAVRATRI24']?.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setInviteCode(code)}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded font-mono hover:bg-primary/20 transition-micro"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
            >
              Join Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;