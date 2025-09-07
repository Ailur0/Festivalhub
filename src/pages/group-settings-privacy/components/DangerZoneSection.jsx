import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DangerZoneSection = ({ onDangerAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onDangerAction?.('export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteGroup = () => {
    if (deleteConfirmText === 'DELETE GROUP') {
      onDangerAction?.('delete');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const handleTransferOwnership = () => {
    onDangerAction?.('transfer');
  };

  const handleLeaveGroup = () => {
    onDangerAction?.('leave');
  };

  return (
    <div className="bg-card border border-error/20 rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-error/5 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          <div>
            <h3 className="font-semibold text-error font-heading">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-error/20 space-y-4">
          {/* Data Export */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Export Group Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Download a complete backup of all group data including member information, financial records, and settings.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                  <li>• Member details and contact information</li>
                  <li>• Complete financial transaction history</li>
                  <li>• Expense records and budget calculations</li>
                  <li>• Group settings and preferences</li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDataExport}
                loading={isExporting}
                iconName="Download"
                iconPosition="left"
              >
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>

          {/* Transfer Ownership */}
          <div className="border border-warning/20 rounded-lg p-4 bg-warning/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Transfer Ownership</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Transfer group ownership to another admin. You will lose admin privileges and cannot undo this action.
                </p>
                <div className="flex items-center space-x-2 text-xs text-warning">
                  <Icon name="AlertTriangle" size={14} />
                  <span>This action requires confirmation from the new owner</span>
                </div>
              </div>
              <Button
                variant="warning"
                size="sm"
                onClick={handleTransferOwnership}
                iconName="UserCheck"
                iconPosition="left"
              >
                Transfer Ownership
              </Button>
            </div>
          </div>

          {/* Leave Group */}
          <div className="border border-warning/20 rounded-lg p-4 bg-warning/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Leave Group</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Remove yourself from this group. As an admin, you must transfer ownership first or delete the group.
                </p>
                <div className="flex items-center space-x-2 text-xs text-warning">
                  <Icon name="AlertTriangle" size={14} />
                  <span>You cannot leave as the only admin</span>
                </div>
              </div>
              <Button
                variant="warning"
                size="sm"
                onClick={handleLeaveGroup}
                disabled
                iconName="LogOut"
                iconPosition="left"
              >
                Leave Group
              </Button>
            </div>
          </div>

          {/* Delete Group */}
          <div className="border border-error/20 rounded-lg p-4 bg-error/5">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-error mb-1">Delete Group</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete this group and all associated data. This action cannot be undone.
                  </p>
                  <div className="space-y-1 text-xs text-error">
                    <div className="flex items-center space-x-2">
                      <Icon name="X" size={12} />
                      <span>All member data will be permanently deleted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="X" size={12} />
                      <span>Financial records and transaction history will be lost</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="X" size={12} />
                      <span>Group settings and preferences will be removed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="X" size={12} />
                      <span>All invitation links will be revoked</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Group
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 p-4 border border-error rounded-md bg-error/10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-error" />
                      <h5 className="font-medium text-error">Confirm Group Deletion</h5>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      This action is irreversible. Type <strong>DELETE GROUP</strong> to confirm:
                    </p>
                    
                    <Input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e?.target?.value)}
                      placeholder="Type DELETE GROUP to confirm"
                      className="font-mono"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteGroup}
                        disabled={deleteConfirmText !== 'DELETE GROUP'}
                        iconName="Trash2"
                        iconPosition="left"
                      >
                        Delete Group Permanently
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-3 bg-error/10 rounded-md border border-error/20">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
              <div>
                <p className="text-xs font-medium text-error">Important Warning</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Actions in this section are permanent and cannot be undone. Please ensure you have exported any important data before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZoneSection;