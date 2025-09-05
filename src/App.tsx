import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeaderNav } from './components/HeaderNav';
import { Footer } from './components/Footer';
import { Landing } from './routes/Landing';
import { MatchForm } from './routes/MatchForm';
import { Results } from './routes/Results';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderNav />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/match" element={<MatchForm />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;