import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-muted-foreground">?</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-center">Looks like you're lost</h1>
        <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
          We couldn't find the page you're looking for in the Hub. It might have been moved or deleted.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
