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
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 rounded-lg border border-blue-200 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent mb-3">
          Manage Entries
        </h2>
        <p className="text-lg bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
          View, edit, and manage all your yahrzeit entries
        </p>
        <div className="mt-4 text-sm bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent font-semibold">
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
