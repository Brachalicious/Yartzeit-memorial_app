import * as React from 'react';
import { useYahrzeit } from '@/hooks/useYahrzeit';
import { YahrzeitList } from '@/components/yahrzeit/YahrzeitList';
import { EditYahrzeitDialog } from '@/components/yahrzeit/EditYahrzeitDialog';
import { YahrzeitEntry } from '@/types/yahrzeit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ManageEntriesPage() {
  const { entries, loading, error, updateEntry, deleteEntry } = useYahrzeit();
  const [editingEntry, setEditingEntry] = React.useState<YahrzeitEntry | null>(null);

  const handleEdit = (entry: YahrzeitEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this yahrzeit entry?')) {
      await deleteEntry(id);
    }
  };

  const handleCloseEdit = () => {
    setEditingEntry(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Loading yahrzeit entries...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Entries</h2>
          <p className="text-muted-foreground mt-2">
            View, edit, and manage all your yahrzeit entries
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      <YahrzeitList
        entries={entries}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditYahrzeitDialog
        entry={editingEntry}
        open={!!editingEntry}
        onClose={handleCloseEdit}
        onUpdate={updateEntry}
      />
    </div>
  );
}
