import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CLASS_CODE_REGEX = /^[A-Z0-9]{6,8}$/i;

export function SetupPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(value: string): string | null {
    if (!value.trim()) return "Class code is required.";
    if (!CLASS_CODE_REGEX.test(value.trim()))
      return "Enter a valid class code (6–8 alphanumeric characters).";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(code);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    // TODO: send to main process
    // window.electron.ipcRenderer.send("setup:join-class", code.trim().toUpperCase());
    await new Promise((r) => setTimeout(r, 800)); // placeholder
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    if (error) setError(validate(e.target.value));
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            BetterClass
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your class code to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="class-code">Class code</Label>
            <Input
              id="class-code"
              type="text"
              placeholder="e.g. ABC123"
              value={code}
              onChange={handleChange}
              autoComplete="off"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "class-code-error" : undefined}
              className="h-9 text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
            />
            {error && (
              <p
                id="class-code-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Joining…" : "Join class"}
          </Button>
        </form>
      </div>
    </div>
  );
}
