import React from 'react';
import Promotion from './pages/Promotion';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* App renders page components */}
      <Promotion />
      <ScrollToTop />
    </div>
  );
}

export default App;