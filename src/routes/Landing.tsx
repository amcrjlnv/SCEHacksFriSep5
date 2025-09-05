import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Zap, Target, ArrowRight, Code2, Lightbulb, HandHeart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              AI-Powered Matching
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find your perfect<br />
              hackathon teammate<br />
              <span className="text-primary">in seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              HackATeam uses advanced AI to connect you with the ideal teammates based on your skills, interests, and project goals. Stop searching, start building.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6 group">
              <Link to="/match">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    About HackATeam
                  </DialogTitle>
                  <DialogDescription className="text-left space-y-4">
                    <p>
                      HackATeam is an AI-powered platform that helps hackathon participants find their ideal teammates based on:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Technical skills and role compatibility
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Shared interests and project domains
                      </li>
                      <li className="flex items-center gap-2">
                        <HandHeart className="h-4 w-4 text-primary" />
                        Availability and working preferences
                      </li>
                    </ul>
                    <p>
                      Our intelligent matching algorithm ensures you connect with teammates who complement your skills and share your passion for innovation.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Placeholder for screenshot/illustration */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-primary/10">
              <div className="bg-background/80 rounded-lg p-6 shadow-xl">
                <div className="text-muted-foreground text-sm mb-4">Preview</div>
                <div className="font-bold font-lg font-white mb-4">John The Coder</div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-primary/20 rounded px-3 py-1 text-xs">React</div>
                    <div className="h-6 bg-primary/20 rounded px-3 py-1 text-xs">Python</div>
                    <div className="h-6 bg-primary/20 rounded px-3 py-1 text-xs">ML/AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HackATeam?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by hackers, for hackers. We understand what makes great teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced algorithms analyze skills, interests, and compatibility to find your perfect teammate match.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Compatibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Match with teammates who complement your skills and share your project interests and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get matched with potential teammates in seconds, not hours. Focus on building, not searching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
