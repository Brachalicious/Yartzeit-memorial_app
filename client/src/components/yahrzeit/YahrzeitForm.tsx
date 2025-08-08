import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YahrzeitFormData } from '@/types/yahrzeit';

interface YahrzeitFormProps {
  onSubmit: (data: YahrzeitFormData) => Promise<void>;
  initialData?: Partial<YahrzeitFormData>;
  title?: string;
}

export function YahrzeitForm({ onSubmit, initialData, title = "Add Yahrzeit Entry" }: YahrzeitFormProps) {
  const [formData, setFormData] = React.useState<YahrzeitFormData>({
    name: initialData?.name || '',
    hebrew_name: initialData?.hebrew_name || '',
    death_date: initialData?.death_date || '',
    relationship: initialData?.relationship || '',
    notes: initialData?.notes || '',
    notify_days_before: initialData?.notify_days_before || 7
  });
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.death_date) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          name: '',
          hebrew_name: '',
          death_date: '',
          relationship: '',
          notes: '',
          notify_days_before: 7
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof YahrzeitFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-amber-200">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name"
                required
                className="text-blue-700 placeholder:text-blue-400 border-amber-300 focus:border-amber-500 focus:ring-amber-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hebrew_name" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                Hebrew Name
              </Label>
              <Input
                id="hebrew_name"
                type="text"
                value={formData.hebrew_name}
                onChange={(e) => handleInputChange('hebrew_name', e.target.value)}
                placeholder="Enter Hebrew name"
                className="text-blue-700 placeholder:text-blue-400 border-amber-300 focus:border-amber-500 focus:ring-amber-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="death_date" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                Date of Passing *
              </Label>
              <Input
                id="death_date"
                type="date"
                value={formData.death_date}
                onChange={(e) => handleInputChange('death_date', e.target.value)}
                required
                className="text-blue-700 border-amber-300 focus:border-amber-500 focus:ring-amber-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                Relationship
              </Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => handleInputChange('relationship', value)}
              >
                <SelectTrigger className="text-blue-700 border-amber-300 focus:border-amber-500 focus:ring-amber-200">
                  <SelectValue placeholder="Select relationship" className="text-blue-400" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Grandparent">Grandparent</SelectItem>
                  <SelectItem value="Other Family">Other Family</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Rabbi/Teacher">Rabbi/Teacher</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notify_days_before" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
              Notification Days Before
            </Label>
            <Select
              value={formData.notify_days_before.toString()}
              onValueChange={(value) => handleInputChange('notify_days_before', parseInt(value))}
            >
              <SelectTrigger className="text-blue-700 border-amber-300 focus:border-amber-500 focus:ring-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
              Notes
            </Label>
            <Input
              id="notes"
              type="text"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or memories"
              className="text-blue-700 placeholder:text-blue-400 border-amber-300 focus:border-amber-500 focus:ring-amber-200"
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting} 
            className="w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold border-0 shadow-md"
          >
            {submitting ? 'Saving...' : initialData ? 'Update Entry' : 'Add Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
