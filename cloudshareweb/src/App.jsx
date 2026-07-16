import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import MyFiles from "./pages/MyFiles.jsx";
import Subscription from "./pages/Subscription.jsx";
import Transactions from "./pages/Transactions.jsx";
import { RedirectToSignIn } from "@clerk/clerk-react";
import ProtectedRoute from "./wrappers/AppWrapper.jsx";
import { Toaster } from "react-hot-toast";
import { UserCreditsProvider } from "./context/UserCreditsContext.jsx";
import PublicFileView from "./pages/PublicFileView.jsx";

const App = () => {
  return (
    <UserCreditsProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </>
          } />

          <Route path="/upload" element={
            <>
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            </>
          } />

          <Route path="/my-files" element={
            <>
              <ProtectedRoute>
                <MyFiles />
              </ProtectedRoute>
            </>
          } />

          <Route path="/subscriptions" element={
            <>
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            </>
          } />

          <Route path="/transactions" element={
            <>
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            </>
          } />
          <Route path="file/:fileId" element={
            <>
              <PublicFileView />
            </>
          } />
          <Route path="/*" element={<RedirectToSignIn />} />
        </Routes>
      </BrowserRouter>
    </UserCreditsProvider>
  );
};

export default App;