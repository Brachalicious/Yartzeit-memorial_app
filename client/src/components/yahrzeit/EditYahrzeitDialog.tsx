import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { YahrzeitForm } from './YahrzeitForm';
import { YahrzeitEntry, YahrzeitFormData } from '@/types/yahrzeit';

interface EditYahrzeitDialogProps {
  entry: YahrzeitEntry | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: number, data: YahrzeitFormData) => Promise<void>;
}

export function EditYahrzeitDialog({ entry, open, onClose, onUpdate }: EditYahrzeitDialogProps) {
  const handleSubmit = async (data: YahrzeitFormData) => {
    if (!entry) return;
    
    await onUpdate(entry.id, data);
    onClose();
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Yahrzeit Entry</DialogTitle>
        </DialogHeader>
        <YahrzeitForm
          onSubmit={handleSubmit}
          initialData={{
            name: entry.name,
            hebrew_name: entry.hebrew_name || '',
            death_date: entry.death_date,
            relationship: entry.relationship || '',
            notes: entry.notes || '',
            notify_days_before: entry.notify_days_before
          }}
          title=""
        />
      </DialogContent>
    </Dialog>
  );
}
