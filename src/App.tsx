import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext';
import { Toaster } from 'sonner';

// To be built
import LandingPage from './components/landing/LandingPage';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import FinderMode from './components/workspace/FinderMode';
import BatchMode from './components/workspace/BatchMode';
import OverlapMode from './components/workspace/OverlapMode';
import AnalyticsMode from './components/workspace/AnalyticsMode';
import ValidationMode from './components/workspace/ValidationMode';
import CompareMode from './components/workspace/CompareMode';

function App() {
    return (
        <DocumentProvider>
            <Toaster position="top-right" richColors />
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/workspace" element={<WorkspaceLayout />}>
                        <Route index element={<Navigate to="/workspace/finder" replace />} />
                        <Route path="finder" element={<FinderMode />} />
                        <Route path="batch" element={<BatchMode />} />
                        <Route path="overlap" element={<OverlapMode />} />
                        <Route path="analytics" element={<AnalyticsMode />} />
                        <Route path="validation" element={<ValidationMode />} />
                        <Route path="compare" element={<CompareMode />} />
                    </Route>
                </Routes>
            </Router>
        </DocumentProvider>
    );
}

export default App;
