import { ThemeProvider } from "@/contexts/ThemeContextType";
import SpamFormPage from "@/components/SpamForm";

function App() {
  return (
    <ThemeProvider>
      <SpamFormPage />
    </ThemeProvider>
  );
}

export default App;