'use client';

import { useGetHello } from '@/api/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const { data, isLoading, error, refetch } = useGetHello();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Claude Bootstrap</CardTitle>
          <CardDescription>
            A turborepo starter with Next.js and Express
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error: {String(error)}</p>}
          {data && <p className="text-lg font-medium">{data.message}</p>}
          <Button onClick={() => void refetch()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
