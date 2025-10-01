import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  details: Record<string, any>;
}

// Helper to render status badge with color
function renderStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return <Badge variant="success">Completed</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'processing':
    case 'in progress':
    case 'in_progress':
      return <Badge variant="info">In Progress</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'refunded':
      return <Badge variant="secondary">Refunded</Badge>;
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'inactive':
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, title, description, details }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
          {description && <DialogDescription className="mb-2">{description}</DialogDescription>}
        </DialogHeader>
        <div className="divide-y divide-slate-200">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 text-base">
              <span className="font-medium text-slate-700 w-1/2 text-left">{key}</span>
              <span className="w-1/2 text-right">
                {key.toLowerCase() === 'status'
                  ? renderStatusBadge(String(value))
                  : <span className="text-slate-900 font-semibold">{String(value)}</span>
                }
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
