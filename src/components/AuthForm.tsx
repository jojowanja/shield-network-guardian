
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting login for:', data.email);
      
      const result = await signIn(data.email, data.password);
      
      toast.success("Welcome back!", {
        description: "You have successfully signed in."
      });

      // Navigate to welcome page for the animation sequence
      navigate("/welcome");
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Sign in failed. Please check your credentials.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      setAuthError(errorMessage);
      toast.error("Sign in failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome to Shield</CardTitle>
        <CardDescription className="text-blue-200">
          Sign in to your Shield Network Guardian
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {authError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                {...loginForm.register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Shield"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
