import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Shuffle, Archive } from 'lucide-react';

interface RecipeNotesProps {
  notes?: string[];
  variations?: string[];
  storage?: string;
}

export function RecipeNotes({ notes, variations, storage }: RecipeNotesProps) {
  const hasContent = (notes && notes.length > 0) || (variations && variations.length > 0) || storage;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Tips and Notes */}
      {notes && notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-savor-saffron" />
              <span>Tips & Notes</span>
              <Badge variant="secondary" className="ml-2">
                {notes.length} tip{notes.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-savor-saffron/5 rounded-lg border border-savor-saffron/20">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-savor-saffron/20 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-savor-saffron">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variations */}
      {variations && variations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shuffle className="h-5 w-5 text-savor-sage" />
              <span>Variations</span>
              <Badge variant="secondary" className="ml-2">
                {variations.length} idea{variations.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {variations.map((variation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-savor-sage/5 rounded-lg border border-savor-sage/20">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-savor-sage/20 flex-shrink-0 mt-0.5">
                    <Shuffle className="h-3 w-3 text-savor-sage" />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {variation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Instructions */}
      {storage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-savor-paprika" />
              <span>Storage</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="p-3 bg-savor-paprika/5 rounded-lg border border-savor-paprika/20">
              <p className="text-sm leading-relaxed text-foreground">
                {storage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
