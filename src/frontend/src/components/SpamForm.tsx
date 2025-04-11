import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContextType";

export default function SpamFormPage() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState<{ label: string; confidence: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: emailText }),
      });

      const data = await response.json();
      setResult({
        label: data.prediction === "spam" ? "SPAM" : "NOT SPAM",
        confidence: data.confidence,
      });
    } catch (error) {
      setResult({
        label: "Error predicting email.",
        confidence: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary text-center">
              📧 Spam Email Checker
            </h1>
            <Button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </Button>
          </div>
          <p className="text-center text-primary text-lg font-medium">
            Paste your email content below to check if it's spam or not.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emailText" className="text-lg font-medium">
                Email Content
              </Label>
              <Textarea
                id="emailText"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste your email content here..."
                rows={8}
                className="border-gray-300 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-secondary hover:bg-primary-dark"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Email"}
            </Button>
          </form>

          {result && (
            <div className="text-lg font-semibold text-center mt-4">
              <span className="text-gray-700">Result: </span>
              <span
                className={
                  result.label === "SPAM" ? "text-red-500" : "text-green-500"
                }
              >
                {result.label}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                Confidence: {result.confidence}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
